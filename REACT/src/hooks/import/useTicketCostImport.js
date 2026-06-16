import { useState } from "react";
import { validateAndMapTicketCostRow } from "../../domain/models/import/TicketCostImport";
import { ImportTicketCostRepository } from "../../domain/repositories/ImportTicketCostRepository";
import { parseCsv } from "../../domain/models/utils/CsvParser";
import { TicketRepository } from "../../domain/repositories/TicketRepository";
import { TicketCostRepository } from "../../domain/repositories/TicketCostRepository";
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository";

export const useTicketCostImport = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const addLog = (message) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const importCsv = (file, refToGlpiId) => {
        return new Promise((resolve, reject) => {
            setLoading(true);
            setLogs([]);
            setProgress(0);

            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const text = e.target.result;
                    addLog("Lecture du fichier CSV...");
                    
                    const rawRows = parseCsv(text);

                    addLog(`Analyse et validation de ${rawRows.length} lignes...`);

                    // Phase de Validation
                    const validatedRows = [];
                    const allErrors = [];

                    rawRows.forEach((rawRow, index) => {
                        const { data, errors } = validateAndMapTicketCostRow(rawRow, index);
                        if (errors.length > 0) {
                            allErrors.push(...errors);
                        } else {
                            validatedRows.push(data);
                        }
                    });

                    if (allErrors.length > 0) {
                        addLog("❌ Échec de la validation du fichier. Corrigez les erreurs suivantes :");
                        allErrors.forEach(err => addLog(err));
                        reject(new Error('Validation échouée'));
                        return;
                    }

                    addLog("✅ Validation réussie. Début de l'intégration GLPI...");

                    // 1. Créer tous les TicketCost dans GLPI 
                    const totalRows = validatedRows.length;
                    const ticketCostsByTicket = {}; // Regrouper les coûts par ticket

                    for (let i = 0; i < totalRows; i++) {
                        const ticketCost = validatedRows[i];

                        try {
                            const glpiTicketId = refToGlpiId[ticketCost.numTicket];
                            if (!glpiTicketId) {
                                addLog(`❌ Ticket ${ticketCost.numTicket} introuvable dans le mapping`);
                                continue;
                            }

                            // Créer le TicketCost dans GLPI
                            await ImportTicketCostRepository.createTicketCost({
                                "tickets_id": glpiTicketId,
                                "actiontime": ticketCost.actiontime,
                                "cost_time": ticketCost.cost_time,
                                "cost_fixed": ticketCost.cost_fixed
                            });

                            // Regrouper les coûts par ticket
                            if (!ticketCostsByTicket[glpiTicketId]) {
                                ticketCostsByTicket[glpiTicketId] = {
                                    ticketId: glpiTicketId,
                                    costs: []
                                };
                            }
                            ticketCostsByTicket[glpiTicketId].costs.push(ticketCost);

                            addLog(`✅ TicketCost créé pour le ticket ${glpiTicketId}`);

                        } catch (error) {
                            addLog(`❌ Erreur pour Num_Ticket=${ticketCost.numTicket} : ${error.message || error}`);
                        }
                        setProgress(Math.round(((i + 1) / totalRows) * 50)); // 50% pour la création des TicketCost
                    }

                    // 2. Insérer dans SQLite (SuperCost) UNE FOIS par ticket
                    addLog("📦 Insertion des SuperCosts dans SQLite...");
                    
                    const ticketIds = Object.keys(ticketCostsByTicket);
                    let totalSuperCostsCreated = 0;

                    for (const ticketId of ticketIds) {
                        const ticketData = ticketCostsByTicket[ticketId];
                        const glpiTicketId = parseInt(ticketId);

                        try {
                            // Récupérer les items du ticket
                            const items = await TicketRepository.getItemsByTicket(glpiTicketId);
                            
                            if (items.length > 0) {

                                // Créer un SuperCost pour chaque item avec le coût total
                                for (const item of items) {
                                    try {
                                        const glpiCosts = await TicketCostRepository.getCostByTicketAndItem(glpiTicketId, item.id);
                                        await SuperCostRepository.createGlpiCost({
                                            ticketId: glpiTicketId,
                                            itemId: item.id,
                                            cost: glpiCosts.total_cost, // ← Coût total du ticket
                                            categorie: item.itemType || item.type || 'Unknown'
                                        });
                                        totalSuperCostsCreated++;
                                    } catch (error) {
                                        console.error(`Erreur pour l'item ${item.id}:`, error);
                                    }
                                }
                                
                                addLog(`💰 ${items.length} SuperCost(s) créé(s) pour le ticket ${glpiTicketId} (coût total: ${totalCost})`);
                            } else {
                                addLog(`⚠️ Aucun item trouvé pour le ticket ${glpiTicketId}`);
                            }

                        } catch (error) {
                            addLog(`❌ Erreur lors de l'insertion SQLite pour le ticket ${glpiTicketId}: ${error.message}`);
                        }
                        
                        setProgress(50 + Math.round(((ticketIds.indexOf(ticketId) + 1) / ticketIds.length) * 50));
                    }

                    addLog("🏁 Import des coûts terminé.");
                    addLog(`✅ ${totalSuperCostsCreated} SuperCost(s) créé(s) au total.`);
                    resolve({ success: true, count: totalRows, superCostsCreated: totalSuperCostsCreated });
                    
                } catch (err) {
                    addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
                    reject(err);
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                addLog("❌ Erreur lors de la lecture physique du fichier.");
                setLoading(false);
                reject(new Error('Erreur lecture fichier'));
            };

            reader.readAsText(file, 'UTF-8');
        });
    }
    return { importCsv, loading, logs, progress };
};