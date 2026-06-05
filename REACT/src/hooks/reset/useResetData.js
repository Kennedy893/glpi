// hooks/reset/useResetData.js
import { useState } from "react";
import { resetDataRepository } from "../../domain/repositories/resetDataRepository";

export const useResetData = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    ticketsSupprimés: 0,
    usersSupprimés: 0,
    assetsSupprimés: 0,
    errors: []
  });

  const addLog = (message, type = 'info') => {
    setLogs((prev) => [...prev, {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      message: message,
      type: type // 'info', 'success', 'error', 'warning'
    }]);
  };

  const resetData = async () => {
    setLoading(true);
    setLogs([]);
    setStats({ ticketsSupprimés: 0, usersSupprimés: 0, assetsSupprimés: 0, errors: [] });
    
    addLog("🚀 Début de la réinitialisation...", 'info');
    
    try {
      const response = await resetDataRepository.resetAllData();
      
      if (response.success) {
        // Mettre à jour les statistiques avec les données retournées
        setStats({
          ticketsSupprimés: response.data?.ticketsSupprimés || 0,
          usersSupprimés: response.data?.usersSupprimés || 0,
          assetsSupprimés: response.data?.assetsSupprimés || 0,
          errors: response.data?.errors || []
        });
        
        addLog(`✅ Réinitialisation terminée avec succès !`, 'success');
        addLog(`   📊 Tickets supprimés : ${response.data?.ticketsSupprimés || 0}`, 'info');
        addLog(`   👥 Utilisateurs supprimés : ${response.data?.usersSupprimés || 0}`, 'info');
        addLog(`   💻 Matériels supprimés : ${response.data?.assetsSupprimés || 0}`, 'info');
      } else {
        addLog(`❌ Échec de la réinitialisation : ${response.error || 'Erreur inconnue'}`, 'error');
      }
      
      return response;
    } catch (error) {
      const errorMsg = error.message || "Erreur lors de la réinitialisation";
      addLog(`❌ ${errorMsg}`, 'error');
      setStats(prev => ({
        ...prev,
        errors: [...prev.errors, errorMsg]
      }));
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return { resetData, loading, logs, stats, clearLogs };
};