import { useState } from "react";
import { validateAndMapTicketCostRow } from "../../domain/models/import/TicketCostImport";
import { ImportTicketCostRepository } from "../../domain/repositories/ImportTicketCostRepository";
import { parseCsv } from "../../domain/models/utils/CsvParser";

export const useTicketCostImport = (refToGlpiId) => {
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
                    
                    // 1. Parsing fait main
                    const rawRows = parseCsv(text);
                    if (rawRows.length === 0) {
                        addLog("❌ Le fichier CSV est vide ou invalide.");
                        setLoading(false);
                        return;
                    }

                    addLog(`Analyse et validation de ${rawRows.length} lignes...`);

                    // 2. Phase de Validation
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

                    // S'il y a la moindre erreur de validation, on stoppe tout avant d'appeler GLPI
                    if (allErrors.length > 0) {
                        addLog("❌ Échec de la validation du fichier. Corrigez les erreurs suivantes :");
                        allErrors.forEach(err => addLog(err));
                        setLoading(false);
                        return;
                    }

                    addLog("✅ Validation réussie. Début de l'intégration GLPI...");

                    // 3. Intégration séquentielle GLPI
                    const totalRows = validatedRows.length;

                    for (let i = 0; i < totalRows; i++) {
                        const ticketCost = validatedRows[i];
                        const ticketCostLogName = `${ticketCost.name} ${ticketCost.numTicket}`;

                        try {
                            // Résolution directe depuis la table en mémoire
                            const glpiTicketId = refToGlpiId[ticketCost.numTicket];
                            if (!glpiTicketId || glpiTicketId === 0 || glpiTicketId === '') {
                                console.log("ERREUR glpiTicketId");
                            }

                            const ticketCostId = await ImportTicketCostRepository.createTicketCost({
                                "tickets_id": glpiTicketId,
                                "actiontime": ticketCost.actiontime,
                                "cost_time": ticketCost.cost_time,
                                "cost_fixed": ticketCost.cost_fixed
                            })
                        } catch (error) {
                            addLog(`❌ Erreur pour Num_Ticket=${ticketCost.numTicket} : ${error.message || error}`);
                        }
                    }
                    addLog("🏁 Processus d'importation terminé.");
                    resolve(); // ✅ signale la fin réelle
                    // return refToGlpiId;
                } catch (err) {
                    addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
                    resolve(); // resolve même en cas d'erreur pour ne pas bloquer la chaîne
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                addLog("❌ Erreur lors de la lecture physique du fichier.");
                setLoading(false);
                resolve(); // ne pas rejeter pour ne pas bloquer la chaîne
            };

            // Déclenche la lecture du fichier en texte UTF-8
            reader.readAsText(file, 'UTF-8');
        });
    }
    return { importCsv, loading, logs, progress };
};