import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const DashboardRepository = {

    // async nbTotalAsset(endpoint) {
    //     try {
    //         // Récupérer avec range=0-0 pour avoir le header Content-Range
    //         const response = await apiClient.get(`${endpoint}?range=0-0`);
            
    //         // Extraire le total du header Content-Range
    //         // Format attendu: "0-0/342" → total = 342
    //         const contentRange = response.headers?.['content-range'];
            
    //         if (!contentRange) {
    //             console.warn(`[Dashboard] Pas de header Content-Range pour ${endpoint}`);
    //             // Fallback: compter la longueur du tableau
    //             return Array.isArray(response) ? response.length : 0;
    //         }
            
    //         const match = contentRange.match(/\/(\d+)/);
    //         const total = match ? parseInt(match[1], 10) : 0;
            
    //         console.log(`[Nb total de ${endpoint} = ${total}]`);
    //         return total;
            
    //     } catch (error) {
    //         console.error(`[Dashboard] Erreur pour ${endpoint}:`, error);
    //         return 0;
    //     }
    // },

    async nbTotalAsset(endpoint) {
        try {
            const { contentRange } = await apiClient.getWithHeaders(`${endpoint}?range=0-0`);

            if (!contentRange) {
            console.warn(`[Dashboard] Pas de header Content-Range pour ${endpoint}`);
            return 0;
            }

            // "0-0/47" → 47
            const match = contentRange.match(/\/(\d+)/);
            const total = match ? parseInt(match[1], 10) : 0;

            console.log(`[Dashboard] Nb total de ${endpoint} = ${total}`);
            return total;

        } catch (error) {
            console.error(`[Dashboard] Erreur pour ${endpoint}:`, error);
            return 0;
        }
    }


}