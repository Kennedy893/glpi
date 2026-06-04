import { useState } from "react"
import { resetDataRepository } from "../../domain/repositories/resetDataRepository";

export const useResetData = () => {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const resetData = async () => {
        try {
            addLog("Debut de la reinitialisation...")
            const response = await resetDataRepository.resetAllData();  
            
            if (response.success) {
                addLog("Reinitialisation terminée avec succès!")
            }

        } catch (error) {
            addLog("[Reinitialisation] Erreur : " + error.message || error);
        } finally {
            setLoading(false);
        }
    };

    return { resetData, loading, logs };
}