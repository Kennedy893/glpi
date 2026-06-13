// hooks/supercost/useSuperCostList.js
import { useState, useEffect, useCallback } from 'react';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';
import { AssetRepository } from '../../domain/repositories/AssetRepository';

export const useSuperCostList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Déclarer loadItems en dehors du useEffect pour pouvoir le retourner
    const loadItems = useCallback(async () => {
        setLoading(true);
        setError('');
        
        try {
            // 1. Récupérer tous les super costs
            const superCosts = await SuperCostRepository.getAllSuperCosts();
            console.log('SuperCosts reçus:', superCosts);
            
            if (!superCosts || superCosts.length === 0) {
                setItems([]);
                setLoading(false);
                return;
            }
            
            // 2. Grouper par TYPE d'item
            const typeMap = new Map();
            
            for (const cost of superCosts) {
                // Récupérer le type de l'item depuis GLPI
                let itemType = 'Asset';
                try {
                    const asset = await AssetRepository.getAssetById(cost.itemId);
                    // Le type peut être dans itemtype ou type selon l'API
                    itemType = asset?.itemtype || asset?.type || 'Asset';
                } catch (err) {
                    console.error(`Erreur récupération item ${cost.itemId}:`, err);
                }
                
                if (!typeMap.has(itemType)) {
                    typeMap.set(itemType, {
                        type: itemType,
                        glpiCost: 0,
                        superCost: 0,
                        total: 0,
                        count: 0
                    });
                }
                
                const typeData = typeMap.get(itemType);
                typeData.superCost += cost.cout || 0;
                typeData.count += 1;
                typeData.total = typeData.superCost;
            }
            
            const itemsList = Array.from(typeMap.values()).map(item => ({
                ...item,
                glpiCost: 0,
                total: item.superCost
            }));
            
            console.log('Items groupés par type:', itemsList);
            setItems(itemsList);
            
        } catch (err) {
            console.error(err);
            setError('Erreur chargement');
        } finally {
            setLoading(false);
        }
    }, []); // useCallback pour éviter de recréer la fonction à chaque rendu

    // Charger au montage du composant
    useEffect(() => {
        loadItems();
    }, [loadItems]);

    return { 
        items, 
        loading, 
        error, 
        refresh: loadItems  // Maintenant loadItems est accessible
    };
};