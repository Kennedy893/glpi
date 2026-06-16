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
    async getTotalCostByItemId(itemId) {
        try {
            // 1. Récupérer tous les tickets liés à cet item
            const allLinks = await apiClient.get(`Item_Ticket?range=0-999`);
            const itemTickets = allLinks.filter(link => link.items_id === itemId);
            console.log('[ticketsLink]', itemTickets);
            
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

    // Cout d'un item pour UN ticket précis
    async getCostByTicketAndItem(ticketId, itemId) {
        try {
            // Vérifier que cet item est bien lié à ce ticket
            const allLinks = await apiClient.get(`Ticket/${ticketId}/Item_Ticket`);
            const isLinked = allLinks.some(link => link.items_id === itemId);

            // Raha tsisy ticket lié amle item
            if (!isLinked) {
                return { ticketId, itemId, cost_time: 0, cost_fixed: 0, cost_material: 0, total_cost: 0 };
            }

            // Récupérer les coûts de CE ticket uniquement
            const costs = await this.getCostTicket(ticketId);

            if (!costs || costs.length === 0) {
                return { ticketId, itemId, cost_time: 0, cost_fixed: 0, cost_material: 0, total_cost: 0 };
            }

            // Additionner les coûts de ce ticket
            const totalCostTime     = costs.reduce((sum, c) => sum + (c.cost_time     || 0), 0);
            const totalCostFixed    = costs.reduce((sum, c) => sum + (c.cost_fixed    || 0), 0);
            const totalCostMaterial = costs.reduce((sum, c) => sum + (c.cost_material || 0), 0);
            const totalAll          = costs.reduce((sum, c) => sum + (c.total_cost    || 0), 0);

            return {
                ticketId,
                itemId,
                cost_time:     totalCostTime,
                cost_fixed:    totalCostFixed,
                cost_material: totalCostMaterial,
                total_cost:    parseFloat(totalAll.toFixed(2)),
            };

        } catch (error) {
            console.error('[getCostByTicketAndItem] Erreur:', error.message);
            return { ticketId, itemId, cost_time: 0, cost_fixed: 0, cost_material: 0, total_cost: 0 };
        }
    },

};