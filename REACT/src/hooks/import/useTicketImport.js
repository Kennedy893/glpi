import { useState } from 'react';
import { parseCsv } from '../../domain/models/utils/CsvParser';
import { validateAndMapTicketRow } from "../../domain/models/import/TicketImport";
import { ImportTicketRepository } from "../../domain/repositories/ImportTicketRepository";
import { ImportAssetVerif } from '../../domain/repositories/ImportAssetVerif';

export const useTicketImport = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const addLog = (message) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const importCsv = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const localRefToGlpiId = {}; // ← table locale

            reader.onload = async (e) => {
            try {
                const text = e.target.result;
                addLog("Lecture du fichier CSV...");
                
                // 1. Parsing fait main
                const rawRows = parseCsv(text);
                // if (rawRows.length === 0) {
                //     addLog("❌ Le fichier CSV est vide ou invalide.");
                //     setLoading(false);
                //     return;
                // }

                addLog(`Analyse et validation de ${rawRows.length} lignes...`);

                // 2. Phase de Validation
                const validatedRows = [];
                const allErrors = [];

                rawRows.forEach((rawRow, index) => {
                    const { data, errors } = validateAndMapTicketRow(rawRow, index);
                    if (errors.length > 0) {
                    allErrors.push(...errors);
                    } else {
                    validatedRows.push(data);
                    }
                });

                // S'il y a la moindre erreur de validation, on stoppe tout avant d'appeler GLPI
                if (allErrors.length > 0) {
                    addLog("❌ Échec de la validation du fichier. Corrigez les erreurs suivantes :");
                    allErrors.forEach(err => addLog(err));
                    setLoading(false);
                    reject(new Error('Validation échouée'));  // ← reject
                    return;
                }

                addLog("✅ Validation réussie. Début de l'intégration GLPI...");

                // 3. Intégration séquentielle GLPI
                const totalRows = validatedRows.length;

                const refToGlpiId = {}; // table de correspondance en mémoire
                
                // Table de mapping itemtype → fonction de recherche
                const FIND_ASSET_FN = {
                    'Computer':        (name) => ImportAssetVerif.findComputerByName(name),
                    'Monitor':         (name) => ImportAssetVerif.findMonitorByName(name),
                    // 'Printer':         (name) => ImportAssetVerif.findPrinterByName(name),
                    // 'NetworkEquipment':(name) => ImportAssetVerif.findNetworkEquipmentByName(name),
                    'Phone':           (name) => ImportAssetVerif.findPhoneByName(name),
                    // 'Peripheral':      (name) => ImportAssetVerif.findPeripheralByName(name),
                };

                for (let i = 0; i < totalRows; i++) {
                    const ticket = validatedRows[i];
                    const ticketLogName = `${ticket.refTicket} ${ticket.titre}`;
                    console.log('ITEMS = ',ticket.items);
                    
                    try {
                        // 1- Creer le Ticket
                        const ticketId = await ImportTicketRepository.createTicket({
                            "date": ticket.date,
                            "type": ticket.type,
                            "name": ticket.titre,
                            "content": ticket.description,
                            "status": ticket.status,
                            "priority": ticket.priority,
                            "entities_id": 0
                        });

                        // Sauvegarder la correspondance
                        refToGlpiId[ticket.refTicket] = ticketId;
                        // → refToGlpiId["1"] = 42  (l'id réel dans GLPI)
                        console.log(refToGlpiId);

                        // 2- Lien Ticket<->Asset
                        // for (const item of ticket.items) {
                        //     try {
                        //         // Trouver l'asset par nom (pas getOrCreate !)
                        //         const findFn = FIND_ASSET_FN[item.itemtype];
                        //         if (!findFn) {
                        //             addLog(`⚠️ Type "${item.itemtype}" non géré — asset ${item.name} ignoré.`);
                        //         continue;
                        //         }

                        //         // FindID By Name
                        //         const assetId = await findFn(item.name);
                        //         if (!assetId) {
                        //             addLog(`⚠️ Asset "${item.name}" introuvable dans GLPI — lien ignoré.`);
                        //             continue;
                        //         }

                        //         // POST /Item_Ticket — le vrai lien
                        //         await ImportTicketRepository.createItemTicket({
                        //             tickets_id: ticketId,
                        //             itemtype:   item.itemtype,
                        //             items_id:   assetId
                        //         });

                        //         addLog(`🔗 Lien créé : ${item.itemtype} "${item.name}" → Ticket ${ticketId}`);

                        //     } catch (itemError) {
                        //         addLog(`⚠️ Erreur lien asset ${item.name} : ${itemError.message}`);
                        //     }
                        // }

                        // APRÈS (déduplication automatique)
                        const uniqueItems = [];
                        const seen = new Set();

                        for (const item of ticket.items) {
                            const key = `${item.name}|${item.itemtype}`;
                            if (!seen.has(key)) {
                                seen.add(key);
                                uniqueItems.push(item);
                            }
                        }

                        if (uniqueItems.length !== ticket.items.length) {
                            addLog(`⚠️ Doublons détectés pour le ticket ${ticket.refTicket} - ${ticket.items.length - uniqueItems.length} doublons supprimés`);
                        }

                        // 3. Lier les assets uniques
                        for (const item of uniqueItems) {
                            try {
                                // Récupérer la fonction de recherche selon le type
                                const findFn = FIND_ASSET_FN[item.itemtype];
                                
                                if (!findFn) {
                                    addLog(`⚠️ Type "${item.itemtype}" non géré — asset ${item.name} ignoré`);
                                    continue;
                                }

                                const assetId = await findFn(item.name);
                                
                                if (!assetId) {
                                    addLog(`⚠️ Asset "${item.name}" introuvable dans GLPI — lien ignoré`);
                                    continue;
                                }

                                await ImportTicketRepository.createItemTicket({
                                    tickets_id: ticketId,
                                    itemtype: item.itemtype,
                                    items_id: assetId
                                });

                                addLog(`🔗 Lien créé : ${item.itemtype} "${item.name}" → Ticket ${ticketId}`);

                            } catch (itemError) {
                                addLog(`⚠️ Erreur lien asset ${item.name} : ${itemError.message}`);
                            }
                        }

                        
                    } catch (error) {
                        addLog(`❌ Erreur lors de l'intégration de ${ticketLogName} : ${error.message || error}`);
                    }
                    setProgress(Math.round(((i + 1) / totalRows) * 100));
                }
                addLog("🏁 Processus d'importation terminé.");
                resolve(refToGlpiId); // ✅ retourne la table via resolve
                return refToGlpiId;
            } catch (err) {
                addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
                reject(err);  // ← reject
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            addLog("❌ Erreur lors de la lecture physique du fichier.");
            reject(new Error('Erreur lecture fichier'));  // ← reject
            setLoading(false);
        };

        // Déclenche la lecture du fichier en texte UTF-8
        reader.readAsText(file, 'UTF-8');
    });

    }
    return { importCsv, loading, logs, progress };
}