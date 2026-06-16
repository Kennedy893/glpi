import { useState } from "react";
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository";
import { TicketRepository } from "../../domain/repositories/TicketRepository";
import { parseCsv } from "../../domain/models/utils/CsvParser";
import { validateRow } from "../../domain/models/import/NewImport";
import { TicketCostRepository } from "../../domain/repositories/TicketCostRepository";

export const useNewImport =  (refToGlpiId) => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const addLog = (message) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const importCsv = (file, refToGlpiId) => {
    if (!file) return; // ← Ne rien faire si pas de fichier
    // return new Promise((resolve, reject) => {
        setLoading(true);
        setLogs([]);
        setProgress(0);

        const reader = new FileReader();

        reader.onload = async (e) => {
        try {
            const text = e.target.result;
            console.log("Lecture du fichier CSV...");
            
            addLog("Lecture du fichier CSV...");
            
            // 1. Parsing fait main
            const rawRows = parseCsv(text);
            if (rawRows.length === 0) {
                addLog("❌ Le fichier CSV est vide ou invalide.");
                console.log("❌ Le fichier CSV est vide ou invalide.");
                
                setLoading(false);
                return;
            }

            addLog(`Analyse et validation de ${rawRows.length} lignes...`);
            console.log(`Analyse et validation de ${rawRows.length} lignes...`);
            

            // 2. Phase de Validation
            const validatedRows = [];
            const allErrors = [];

            rawRows.forEach((rawRow, index) => {
                const { data, errors } = validateRow(rawRow, index);
                if (errors.length > 0) {
                    allErrors.push(...errors);
                } else {
                    validatedRows.push(data);
                }
            });

            // S'il y a la moindre erreur de validation, on stoppe tout avant d'appeler GLPI
            // if (allErrors.length > 0) {
            //     addLog("❌ Échec de la validation du fichier. Corrigez les erreurs suivantes :");
            //     allErrors.forEach(err => addLog(err));
            //     reject(new Error('Erreur de validation'));  // ← reject
            //     setLoading(false);
            //     return;
            // }

            addLog("✅ Validation réussie. Début de l'intégration GLPI...");

            // 3. Intégration séquentielle GLPI
            const totalRows = validatedRows.length;
            let hasError = false;
            
            for (let i = 0; i < totalRows; i++) {
            const ligne = validatedRows[i];

            // const ligne = {
            //     ticket: rawRows[i].ticket,
            //     mvt: rawRows[i].mvt,
            //     valeur: rawRows[i].valeur
            // }

            console.log(ligne);
            

            try {
                const glpiTicketId = refToGlpiId[ligne.ticket];
                // console.log('manomboka');
                

                if (ligne.mvt === 'close' || ligne.mvt === 'Close') {
                    console.log('close');
                    
                    const items = await TicketRepository.getItemsByTicket(glpiTicketId);
                    const nbItems = items.length;

                    if (nbItems > 0 && ligne.valeur && parseFloat(ligne.valeur) > 0) 
                    {
                        const costPerItem = parseFloat(ligne.valeur) / nbItems;

                        for (const item of items) {
                            try {
                                const glpiCosts = await TicketCostRepository.getCostByTicketAndItem(glpiTicketId, item.id);
                                console.log(glpiCosts);
                                
                                // Créer le SuperCost
                                const res = await SuperCostRepository.createSuperCost({
                                    ticketId: glpiTicketId || 0,
                                    itemId: item.id,
                                    cost: costPerItem || 0,
                                    categorie: item.itemType || item.type
                                });
                                console.log(res);
                                

                                // Créer le Cout glpi
                                await SuperCostRepository.createGlpiCost({
                                    ticketId: glpiTicketId,
                                    itemId: item.id,
                                    cost: glpiCosts.total_cost || 0,
                                    categorie: item.itemType || item.type
                                });
                            } catch (error) {
                                console.error(`Erreur pour l'item ${item.id}:`, error);
                            }
                        }
                    }
                    
                }

                else if (ligne.mvt === 'open' || ligne.mvt === 'Open') {
                    // Récupérer les items du ticket
                    const items = await TicketRepository.getItemsByTicket(glpiTicketId);
                    const nbItems = items.length;
                    const superCost = await SuperCostRepository.getLastSuperCost(glpiTicketId);
                    console.log(superCost);
                    
                    if (nbItems > 0 && ligne.valeur && parseFloat(ligne.valeur) > 0) 
                    {
                        const cost = parseFloat(superCost[0].cout || 0) * ligne.valeur / 100;
                        
                        // Créer un supercost pour chaque item
                        for (const item of items) {
                            try {
                                // Créer le Cout glpi
                                await SuperCostRepository.createReouvertureCost({
                                    ticketId: glpiTicketId,
                                    itemId: item.id,
                                    cost: cost || 0,
                                    categorie: item.itemType || item.type
                                });
                            } catch (error) {
                                console.error(`Erreur pour l'item ${item.id}:`, error);
                            }
                        }
                        
                        console.log(`💰 ${nbItems} Reouverture créée pour le ticket ${glpiTicketId}`);
                    } else if (nbItems === 0) {
                        console.warn(`⚠️ Aucun item trouvé pour le ticket ${glpiTicketId}`);
                    }
                }

                else if (ligne.mvt === 'cancel' || ligne.mvt === 'Cancel') {
                    try {
                        const response = await SuperCostRepository.annulerLastSuperCosts(glpiTicketId);
                    } catch (error) {
                        console.error('Erreur pour l\'annulation');
                    }
                    
                }
                
            } catch (error) {
                // addLog(`❌ Erreur lors de l'intégration de ${assetLogName} : ${error.message || error}`);
                hasError = true;
                console.error(error);
                
                // reject(new Error(`Erreur sur ${asset.name}: ${error.message}`));  // ← reject
                return;
            }

            setProgress(Math.round(((i + 1) / totalRows) * 100));
            }

            // addLog("🏁 Processus d'importation terminé.");
            if (!hasError) {
            addLog("🏁 Import terminé.");
            // resolve({ success: true, count: rawRows.length });  // ← resolve avec données
            }

            // resolve(); // ✅ signale la fin réelle
        } catch (err) {
            addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
            // resolve(); // resolve même en cas d'erreur pour ne pas bloquer la chaîne
            // reject(err);
            console.error(err);
            
        } finally {
            setLoading(false);
        }
        };

        reader.onerror = () => {
        addLog("❌ Erreur lors de la lecture physique du fichier.");
        setLoading(false);
        // resolve(); // ne pas rejeter pour ne pas bloquer la chaîne
        // reject(new Error('Erreur de lecture fichier'));  // ← reject
        };

        // Déclenche la lecture du fichier en texte UTF-8
        reader.readAsText(file, 'UTF-8');
    // });

    
    }
    return { importCsv, loading, logs, progress };
}