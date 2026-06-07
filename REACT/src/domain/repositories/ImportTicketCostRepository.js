import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const ImportTicketCostRepository = {

    async createTicketCost(data) {
        console.log('[CreateTicketCost] ticketCostData = ', data);

        try {
            const payload = {
                input: data
            };

            console.log('[CreateTicketCost] Payload envoyé = ', JSON.stringify(payload, null, 2));

            const response = await apiClient.post('TicketCost', payload);
            return response?.id ?? response?.[0]?.id ?? null;
        } catch (error) {
            console.error('[CreateTicketCost] Erreur détaillée:', error);
            
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