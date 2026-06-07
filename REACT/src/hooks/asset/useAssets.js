import { useState, useEffect, useCallback } from 'react';
import { AssetRepository } from '../../domain/repositories/AssetRepository';

export const useAssets = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer tous les types d'équipements (bruts)
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
      
      // ✅ Utiliser getAssetWithDetails pour chaque asset
      // Cela récupère l'asset ET tous ses détails en UNE requête par asset
      const enrichedAssets = await Promise.all(
        rawAssets.map(asset => 
          AssetRepository.getAssetWithDetails(asset.type, asset.id)
        )
      );
      
      // Filtrer les éventuels null (erreurs)
      const validAssets = enrichedAssets.filter(asset => asset !== null);
      
      setAssets(validAssets);
    } catch (err) {
      console.error('Erreur chargement assets:', err);
      setError(err.message || 'Erreur lors du chargement du parc');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const refresh = () => {
    loadAssets();
  };

  return { assets, loading, error, refresh };
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
//     name: printer.name,
//     type: 'Printer'
//   });
// }

// // Ajouter les monitors
// for (let i = 0; i < monitors.length; i++) {
//   const monitor = monitors[i];
//   rawAssets.push({
//     id: monitor.id,
//     name: monitor.name,
//     type: 'Monitor'
//   });
// }

// // Ajouter les équipements réseau
// for (let i = 0; i < networkEquipments.length; i++) {
//   const networkEquipment = networkEquipments[i];
//   rawAssets.push({
//     id: networkEquipment.id,
//     name: networkEquipment.name,
//     type: 'NetworkEquipment'
//   });
// }

// // Ajouter les téléphones
// for (let i = 0; i < phones.length; i++) {
//   const phone = phones[i];
//   rawAssets.push({
//     id: phone.id,
//     name: phone.name,
//     type: 'Phone'
//   });
// }

// // Ajouter les périphériques
// for (let i = 0; i < peripherals.length; i++) {
//   const peripheral = peripherals[i];
//   rawAssets.push({
//     id: peripheral.id,
//     name: peripheral.name,
//     type: 'Peripheral'
//   });
// }

// // Maintenant, pour chaque asset, récupérer tous les détails
// const enrichedAssets = [];

// for (let i = 0; i < rawAssets.length; i++) {
//   const asset = rawAssets[i];
//   const assetWithDetails = await AssetRepository.getAssetWithDetails(asset.type, asset.id);
//   enrichedAssets.push(assetWithDetails);
// }