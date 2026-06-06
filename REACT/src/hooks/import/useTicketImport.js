import { useState } from 'react';
import { parseCsv } from '../../domain/models/utils/CsvParser';
import { validateAndMapTicketRow } from "../../domain/models/import/TicketImport";
import { ImportTicketRepository } from "../../domain/repositories/ImportTicketRepository";

export const useTicketImport = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const addLog = (message) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const importCsv = async (file) => {
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
                    return;
                }

                addLog("✅ Validation réussie. Début de l'intégration GLPI...");

                // 3. Intégration séquentielle GLPI
                const totalRows = validatedRows.length;

                const refToGlpiId = {}; // table de correspondance en mémoire
                
                for (let i = 0; i < totalRows; i++) {
                    const ticket = validatedRows[i];
                    const ticketLogName = `${ticket.refTicket} ${ticket.titre}`;
                    console.log('ITEMS = ',ticket.items);
                    
                    try {
                        // Creer le Ticket
                        const response = await ImportTicketRepository.createTicket({
                            "date": ticket.date,
                            "type": ticket.type,
                            "name": ticket.titre,
                            "content": ticket.description,
                            "status": ticket.status,
                            "priority": ticket.priority,
                            "entities_id": 0
                        });

                        // Sauvegarder la correspondance
                        refToGlpiId[ticket.refTicket] = response;
                        // → refToGlpiId["1"] = 42  (l'id réel dans GLPI)
                        console.log(refToGlpiId);
                        
                    } catch (error) {
                        addLog(`❌ Erreur lors de l'intégration de ${ticketLogName} : ${error.message || error}`);
                    }
                    setProgress(Math.round(((i + 1) / totalRows) * 100));
                }
                addLog("🏁 Processus d'importation terminé.");
                return refToGlpiId;
            } catch (err) {
                addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            addLog("❌ Erreur lors de la lecture physique du fichier.");
            setLoading(false);
        };

        // Déclenche la lecture du fichier en texte UTF-8
        reader.readAsText(file, 'UTF-8');
    };

    return { importCsv, loading, logs, progress };
}