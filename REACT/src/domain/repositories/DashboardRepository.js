import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const DashboardRepository = {

    async nbTotalAsset(endpoint) {
        try {
            const { contentRange } = await apiClient.getWithHeaders(`${endpoint}?range=0-0`);

            if (!contentRange) {
            console.warn(`[Dashboard-Asset] Pas de header Content-Range pour ${endpoint}`);
            return 0;
            }

            // "0-0/47" → 47
            const match = contentRange.match(/\/(\d+)/);
            const total = match ? parseInt(match[1], 10) : 0;

            console.log(`[Dashboard-Asset] Nb total de ${endpoint} = ${total}`);
            return total;

        } catch (error) {
            console.error(`[Dashboard-Asset] Erreur pour ${endpoint}:`, error);
            return 0;
        }
    },

    async nbTotalTicket() {
        try {
            const { contentRange } = await apiClient.getWithHeaders(`Ticket?range=0-0`);

            if (!contentRange) {
            console.warn(`[Dashboard-Ticket] Pas de header Content-Range pour Ticket`);
            return 0;
            }

            // "0-0/47" → 47
            const match = contentRange.match(/\/(\d+)/);
            const total = match ? parseInt(match[1], 10) : 0;

            console.log(`[Dashboard-Ticket] Nb total de Ticket = ${total}`);
            return total;
        } catch (error) {
            console.error(`[Dashboard-Ticket] Erreur pour ${endpoint}:`, error);
            return 0;
        }
    },

    async nbTicketParType(type) {
        try {
            const { contentRange } = await apiClient.getWithHeaders(`Ticket?range=0-0&searchText[type]=${type}`);

            if (!contentRange) {
            console.warn(`[Dashboard-Ticket(type)] Pas de header Content-Range pour Ticket`);
            return 0;
            }

            // "0-0/47" → 47
            const match = contentRange.match(/\/(\d+)/);
            const total = match ? parseInt(match[1], 10) : 0;

            console.log(`[Dashboard-Ticket(type)] Nb total de Ticket = ${total}`);
            return total;
        } catch (error) {
            console.error(`[Dashboard-Ticket(type)] Erreur pour ${endpoint}:`, error);
            return 0;
        }
    }


}