// domain/repositories/TicketCostRepository.js
import { getApiClient } from './ApiClientRepository';

const apiClient = getApiClient();

export const TicketCostRepository = {

    // Récupérer les coûts d'un ticket
    async getCostTicket(ticketId) {
        try {
            console.log('[getCostTicket] avec ID ticket =', ticketId);

            const response = await apiClient.get(`Ticket/${ticketId}/TicketCost`);
            console.log('[getCostTicket] response =', response);

            if (!Array.isArray(response) || response.length === 0) return [];

            // Retourner TOUS les costs avec la formule correcte
            return response.map(cost => ({
                id: cost.id,
                actiontime: cost.actiontime,
                cost_time: cost.cost_time,
                cost_fixed: cost.cost_fixed,
                cost_material: cost.cost_material,
                total_cost: parseFloat(
                    (parseFloat(cost.cost_fixed || 0) +
                    (parseFloat(cost.actiontime || 0) / 3600) * parseFloat(cost.cost_time || 0) +
                    parseFloat(cost.cost_material || 0)).toFixed(2)
                )
            }));

        } catch (error) {
            console.error('[getCostTicket] Erreur:', error.message);
            throw new Error(error.message || 'Erreur getCostTicket');
        }
    },

    // Récupérer tous les coûts pour un item via ses tickets
    // async getCostsByItemId(itemId) {
    //     try {
    //         // 1. Récupérer tous les tickets liés à cet item
    //         const itemTickets = await apiClient.get(`Item_Ticket?items_id=${itemId}`);
            
    //         if (!itemTickets || itemTickets.length === 0) return [];

    //         // 2. Récupérer les coûts pour chaque ticket
    //         let allCosts = [];
    //         for (const link of itemTickets) {
    //             const costs = await this.getCostTicket(link.tickets_id);
    //             allCosts = [...allCosts, ...costs];
    //         }

    //         return allCosts;

    //         // Retourne un tableau (array) d'objets
    //         // [
    //         //     {
    //         //         actiontime: 3600,
    //         //         cost_time: 50000,
    //         //         cost_fixed: 10000,
    //         //         cost_material: 5000,
    //         //         total_cost: 65000
    //         //     },
    //         //     {
    //         //         actiontime: 7200,
    //         //         cost_time: 100000,
    //         //         cost_fixed: 20000,
    //         //         cost_material: 10000,
    //         //         total_cost: 130000
    //         //     },
    //         //     {
    //         //         actiontime: 1800,
    //         //         cost_time: 25000,
    //         //         cost_fixed: 5000,
    //         //         cost_material: 2000,
    //         //         total_cost: 32000
    //         //     }
    //         // ]

    //     } catch (error) {
    //         console.error('[getCostsByItemId] Erreur:', error.message);
    //         return [];
    //     }
    // },
    // domain/repositories/TicketCostRepository.js

    async getTotalCostByItemId(itemId) {
        try {
            // 1. Récupérer tous les tickets liés à cet item
            // const itemTickets = await apiClient.get(`Item_Ticket?searchText[items_id]=${itemId}`);
            const allLinks = await apiClient.get(`Item_Ticket?range=0-999`);
            const itemTickets = allLinks.filter(link => link.items_id === itemId);

            if (!itemTickets || itemTickets.length === 0) {
                return {
                    itemId: itemId,
                    cost_time: 0,
                    cost_fixed: 0,
                    cost_material: 0,
                    total_cost: 0
                };
            }

            // 2. Récupérer les coûts pour chaque ticket
            let totalCostTime = 0;
            let totalCostFixed = 0;
            let totalCostMaterial = 0;
            let totalAll = 0;

            for (const link of itemTickets) {
                const costs = await this.getCostTicket(link.tickets_id);
                
                for (const cost of costs) {
                    totalCostTime += cost.cost_time || 0;
                    totalCostFixed += cost.cost_fixed || 0;
                    totalCostMaterial += cost.cost_material || 0;
                    totalAll += cost.total_cost || 0;
                }
            }

            return {
                itemId: itemId,
                cost_time: totalCostTime,
                cost_fixed: totalCostFixed,
                cost_material: totalCostMaterial,
                total_cost: totalAll
            };

        } catch (error) {
            console.error('[getTotalCostByItemId] Erreur:', error.message);
            return {
                itemId: itemId,
                cost_time: 0,
                cost_fixed: 0,
                cost_material: 0,
                total_cost: 0
            };
        }
    },

};