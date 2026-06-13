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

            // Retourner TOUS les costs 
            return response.map(cost => ({
                id: cost.id,
                actiontime: cost.actiontime,
                cost_time: cost.cost_time,
                cost_fixed: cost.cost_fixed,
                cost_material: cost.cost_material,
                total_cost: (cost.cost_time || 0) + (cost.cost_fixed || 0) + (cost.cost_material || 0)
            }));

        } catch (error) {
            console.error('[getCostTicket] Erreur:', error.message);
            throw new Error(error.message || 'Erreur getCostTicket');
        }
    },

    // ✅ Récupérer tous les coûts pour un item via ses tickets
    async getCostsByItemId(itemId) {
        try {
            // 1. Récupérer tous les tickets liés à cet item
            const itemTickets = await apiClient.get(`Item_Ticket?items_id=${itemId}`);
            
            if (!itemTickets || itemTickets.length === 0) return [];

            // 2. Récupérer les coûts pour chaque ticket
            let allCosts = [];
            for (const link of itemTickets) {
                const costs = await this.getCostTicket(link.tickets_id);
                allCosts = [...allCosts, ...costs];
            }

            return allCosts;

        } catch (error) {
            console.error('[getCostsByItemId] Erreur:', error.message);
            return [];
        }
    },

    // domain/repositories/TicketCostRepository.js
async getCostsByItemId(itemId) {
    try {
        // 1. Récupérer tous les tickets liés à cet item
        const itemTickets = await apiClient.get(`Item_Ticket?items_id=${itemId}`);
        
        if (!itemTickets || itemTickets.length === 0) return [];

        // 2. Récupérer les coûts pour chaque ticket
        let allCosts = [];
        for (const link of itemTickets) {
            try {
                const costs = await this.getCostTicket(link.tickets_id);
                allCosts = [...allCosts, ...costs];
            } catch (err) {
                console.error(`Erreur récupération coûts ticket ${link.tickets_id}:`, err);
            }
        }

        return allCosts;
    } catch (error) {
        console.error('[getCostsByItemId] Erreur:', error.message);
        return [];
    }
}
};