import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const ImportTicketRepository = {

    async createTicket(ticketData) {
        console.log('[CreateTicket] ticketData = ', ticketData);

        try {
            const payload = { 
                input : [ticketData]
            };

            console.log('[CreateTicket] Payload envoyé = ', JSON.stringify(payload, null, 2));

            const response = await apiClient.post('Ticket', payload);

            let ticketId = null;
            if (response && response.id) {
                ticketId = response.id
            } else if (response && response[0] && response[0].id) {
                ticketId = response[0].id;
            } else if (response && response.data && response.data.id) {
                ticketId = response.data.id;
            }

            return ticketId;
            
        } catch (error) {
            console.error('[CreateTicket] Erreur détaillée:', error);
            
            // Afficher plus de détails sur l'erreur API
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                
                // Message d'erreur plus explicite
                if (error.response.data && error.response.data.message) {
                    throw new Error(`GLPI: ${error.response.data.message}`);
                } else if (error.response.data && error.response.data[0]) {
                    throw new Error(`GLPI: ${error.response.data[0].message}`);
                } else {
                    throw new Error(`Erreur GLPI (${error.response.status}): ${JSON.stringify(error.response.data)}`);
                }
            }
            
            throw error;
        }
        
    },

    async createItemTicket(data) {
        console.log(`[createItemTicket] data = `, data);
        
        try {
            const response = await apiClient.post('Item_Ticket', { input: data});
            return response?.id ?? response?.[0]?.id ?? null;
        } catch (error) {
            console.error('[createItemTicket] Erreur détaillée:', error);
            
            // Afficher plus de détails sur l'erreur API
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
                
                // Message d'erreur plus explicite
                if (error.response.data && error.response.data.message) {
                    throw new Error(`GLPI: ${error.response.data.message}`);
                } else if (error.response.data && error.response.data[0]) {
                    throw new Error(`GLPI: ${error.response.data[0].message}`);
                } else {
                    throw new Error(`Erreur GLPI (${error.response.status}): ${JSON.stringify(error.response.data)}`);
                }
            }
            
            throw error;
        }
    }
}