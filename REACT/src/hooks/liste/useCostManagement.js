// hooks/liste/useCostManagement.js
import { useState } from 'react';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';
import { TicketRepository } from '../../domain/repositories/TicketRepository';

export const useCostManagement = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Récupérer les données nécessaires pour le calcul
    const getCalculationData = async (ticketId) => {
        try {
            const [superCost, firstSuperCost, sumSP, averageSP] = await Promise.all([
                SuperCostRepository.getLastSuperCost(ticketId),
                SuperCostRepository.getFirstSuperCost(ticketId),
                SuperCostRepository.getSumSuperCost(ticketId),
                SuperCostRepository.getAvgSuperCost(ticketId)
            ]);

            let coutSomme = 0;
            if (Array.isArray(sumSP) && sumSP.length > 0) {
                coutSomme = sumSP[0]?.[3] || sumSP[0] || 0;
            }

            let coutAvg = 0;
            if (Array.isArray(averageSP) && averageSP.length > 0) {
                coutAvg = averageSP[0]?.[3] || averageSP[0] || 0;
            }

            return {
                lastCost: Array.isArray(superCost) && superCost.length > 0 ? superCost[0].cout || 0 : 0,
                firstCost: Array.isArray(firstSuperCost) && firstSuperCost.length > 0 ? firstSuperCost[0].cout || 0 : 0,
                sumCost: coutSomme,
                avgCost: coutAvg
            };
        } catch (error) {
            console.error('[useCostManagement] Erreur récupération données:', error);
            return null;
        }
    };

    // Calculer le coût selon le mode
    const calculateCost = (mode, data, pourcentage) => {
        const p = parseFloat(pourcentage) || 0;
        
        switch (parseInt(mode)) {
            case 1: // Dernier cout
                return data.lastCost * p / 100;
            case 2: // Premier cout
                return data.firstCost * p / 100;
            case 3: // Moyenne
                return data.avgCost * p / 100;
            case 4: // Somme
                return data.sumCost * p / 100;
            default:
                return 0;
        }
    };

    // Mettre à jour un SuperCost
    const updateSuperCost = async (id, newCost) => {
        setLoading(true);
        setError('');
        
        try {
            const result = await SuperCostRepository.updateSuper(id, parseFloat(newCost));
            console.log('✅ SuperCost mis à jour:', result);
            return result;
        } catch (error) {
            console.error('❌ Erreur mise à jour SuperCost:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour un ReouvertureCost et recalculer
    const updateReouvertureCost = async (id, newCost, newMode, ticketId) => {
        setLoading(true);
        setError('');
        
        try {
            // 1. Récupérer les données pour le calcul
            const data = await getCalculationData(ticketId);
            if (!data) {
                throw new Error('Impossible de récupérer les données de calcul');
            }

            // 2. Calculer le nouveau coût selon le mode
            const calculatedCost = calculateCost(newMode, data, 100); // 100% du coût de base
            
            // 3. Mettre à jour le ReouvertureCost avec le nouveau mode et coût
            const result = await SuperCostRepository.updateReouv(id, calculatedCost, parseInt(newMode));
            
            console.log('✅ ReouvertureCost mis à jour:', {
                id,
                newCost: calculatedCost,
                mode: newMode,
                calculatedFrom: data
            });
            
            return result;
            
        } catch (error) {
            console.error('❌ Erreur mise à jour ReouvertureCost:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Recalculer tous les ReouvertureCosts d'un ticket
    const recalculerAllReouverture = async (ticketId, pourcentage, mode) => {
        setLoading(true);
        setError('');
        
        try {
            // 1. Récupérer les données
            const data = await getCalculationData(ticketId);
            if (!data) {
                throw new Error('Impossible de récupérer les données de calcul');
            }

            // 2. Calculer le coût
            const cost = calculateCost(mode, data, pourcentage);
            
            // 3. Récupérer les items du ticket
            const items = await TicketRepository.getItemsByTicket(ticketId);
            
            if (items.length === 0) {
                throw new Error('Aucun item trouvé pour ce ticket');
            }

            // 4. Créer les nouveaux ReouvertureCosts
            const results = [];
            for (const item of items) {
                const result = await SuperCostRepository.createReouvertureCost({
                    ticketId: ticketId,
                    itemId: item.id,
                    cost: cost,
                    categorie: item.itemType || item.type || 'Asset',
                    mode: parseInt(mode)
                });
                results.push(result);
            }
            
            console.log(`✅ ${results.length} ReouvertureCosts recalculés`);
            return results;
            
        } catch (error) {
            console.error('❌ Erreur recalcul:', error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateSuperCost,
        updateReouvertureCost,
        recalculerAllReouverture,
        getCalculationData,
        calculateCost,
        loading,
        error
    };
};