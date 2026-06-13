// hooks/ticketcost/useGLPICosts.js
import { useState, useEffect } from 'react';
import { TicketCostRepository } from '../../domain/repositories/TicketCostRepository';
import { AssetRepository } from '../../domain/repositories/AssetRepository';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';

export const useGLPICosts = () => {
    const [costsByType, setCostsByType] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCosts = async () => {
            try {
                // 1. Récupérer tous les super costs (pour avoir les itemId)
                const superCosts = await SuperCostRepository.getAllSuperCosts();
                
                if (!superCosts || superCosts.length === 0) {
                    setCostsByType([]);
                    setLoading(false);
                    return;
                }

                // 2. Grouper par type d'item
                const typeMap = new Map();

                for (const cost of superCosts) {
                    const itemId = cost.itemId;
                    
                    // Récupérer le type de l'item
                    let itemType = 'Asset';
                    try {
                        const asset = await AssetRepository.getAssetById(itemId);
                        itemType = asset?.itemtype || asset?.type || 'Asset';
                    } catch (err) {
                        console.error(`Erreur récupération item ${itemId}:`, err);
                    }

                    // Récupérer les coûts GLPI pour cet item
                    let glpiCost = 0;
                    try {
                        const glpiCosts = await TicketCostRepository.getCostsByItemId(itemId);
                        glpiCost = glpiCosts.reduce((sum, c) => sum + (c.total_cost || 0), 0);
                    } catch (err) {
                        console.error(`Erreur récupération coûts GLPI pour item ${itemId}:`, err);
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
                    typeData.glpiCost += glpiCost;
                    typeData.superCost += cost.cout || 0;
                    typeData.count += 1;
                    typeData.total = typeData.glpiCost + typeData.superCost;
                }

                const result = Array.from(typeMap.values());
                setCostsByType(result);

            } catch (err) {
                console.error(err);
                setError('Erreur chargement');
            } finally {
                setLoading(false);
            }
        };

        loadCosts();
    }, []);

    return { costsByType, loading, error };
};