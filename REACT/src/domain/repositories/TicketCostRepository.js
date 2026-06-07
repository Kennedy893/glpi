import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const TicketCostRepository = {

    async getCostTicket(ticketId) {
        try {
            console.log('[getCostTicket] avec ID ticket =', ticketId);

            const response = await apiClient.get(`Ticket/${ticketId}/TicketCost`);
            console.log('[getCostTicket] response =', response);

            if (!Array.isArray(response) || response.length === 0) return [];

            // Retourner TOUS les costs 
            return response.map(cost => ({
                actiontime: cost.actiontime,
                cost_time: cost.cost_time,
                cost_fixed: cost.cost_fixed,
                cost_material: cost.cost_material
            }));

        } catch (error) {
            console.error('[getCostTicket] Erreur:', error.message);
            throw new Error(error.message || 'Erreur getCostTicket');
        }
    }
}