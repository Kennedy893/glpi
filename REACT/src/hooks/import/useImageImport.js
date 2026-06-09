// hooks/import/useImageImport.js
import { useState } from 'react';
import { ImageRepository } from '../../domain/repositories/ImageRepository';

export const useImageImport = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const importZip = async (zipFile, assetMap) => {
    setLoading(true);
    setLogs([]);
    setProgress(0);

    try {
      addLog(`📦 Lecture du fichier ZIP: ${zipFile.name}`);
      setProgress(10);

      const results = await ImageRepository.importImagesZip(zipFile, assetMap);
      
      setProgress(100);
      addLog(`✅ Import ZIP terminé: ${results.attached}/${results.total} images attachées`);
      
      if (results.failed > 0) {
        addLog(`⚠️ ${results.failed} échec(s) d'attachement`);
        results.details
          .filter(d => d.status === 'skipped' || d.status === 'failed')
          .forEach(d => addLog(`   ❌ ${d.image}: ${d.reason || d.error}`));
      }
      
      return results;
    } catch (error) {
      addLog(`❌ Erreur lors de l'import ZIP: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { importZip, loading, logs, progress };
};