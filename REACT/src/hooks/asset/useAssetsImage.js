import { useState, useEffect, useCallback } from 'react';
import { AssetRepository } from '../../domain/repositories/AssetRepository';

export const useAssetsImage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les types d'équipements
      const [computers, printers, monitors, networkEquipments, phones, peripherals] = await Promise.all([
        AssetRepository.getAllAsset('Computer'),
        AssetRepository.getAllAsset('Printer'),
        AssetRepository.getAllAsset('Monitor'),
        AssetRepository.getAllAsset('NetworkEquipment'),
        AssetRepository.getAllAsset('Phone'),
        AssetRepository.getAllAsset('Peripheral')
      ]);
      
      // Fusionner tous les assets bruts avec leur type
      const rawAssets = [
        ...(computers || []).map(item => ({ ...item, type: 'Computer' })),
        ...(printers || []).map(item => ({ ...item, type: 'Printer' })),
        ...(monitors || []).map(item => ({ ...item, type: 'Monitor' })),
        ...(networkEquipments || []).map(item => ({ ...item, type: 'NetworkEquipment' })),
        ...(phones || []).map(item => ({ ...item, type: 'Phone' })),
        ...(peripherals || []).map(item => ({ ...item, type: 'Peripheral' }))
      ];
      
      setAssets(rawAssets);
      console.log('[useAssets] Assets chargés:', rawAssets.length);
      
      // ✅ Retourner les assets pour les appels programmatiques
      return rawAssets;
      
    } catch (err) {
      console.error('Erreur chargement assets:', err);
      setError(err.message || 'Erreur lors du chargement du parc');
      return []; // Retourner un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fonction refresh qui retourne les données
  const refresh = useCallback(async () => {
    return await loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return { 
    assets, 
    loading, 
    error, 
    refresh  // ✅ refresh retourne maintenant une Promise
  };

};



// Plus lisible
// // Créer un tableau vide pour rassembler tous les assets
// const rawAssets = [];

// // Ajouter les computers
// for (let i = 0; i < computers.length; i++) {
//   const computer = computers[i];
//   rawAssets.push({
//     id: computer.id,
//     name: computer.name,
//     type: 'Computer'
//   });
// }

// // Ajouter les printers
// for (let i = 0; i < printers.length; i++) {
//   const printer = printers[i];
//   rawAssets.push({
//     id: printer.id,
