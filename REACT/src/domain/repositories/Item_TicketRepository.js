import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const Item_TicketRepository = {

    // Retourne le map des items d'un ticket
    async getItem_Ticket(ticketId) {
        try {
            console.log('[getItem_Ticket] avec ID ticket =', ticketId);

            const response = await apiClient.get(`Ticket/${ticketId}/Item_Ticket`);
            console.log('[getItem_Ticket] response =', response);

            if (!Array.isArray(response) || response.length === 0) return [];

            // Retourner TOUS les items avec itemtype + items_id
            return response.map(item => ({
                itemtype: item.itemtype,   // "Computer", "Monitor"...
                items_id: item.items_id,   // id de l'asset
            }));

        } catch (error) {
            console.error('[getItem_Ticket] Erreur:', error.message);
            throw new Error(error.message || 'Erreur getItem_Ticket');
        }
    },

    // Details asset d'un ticket (d'un computer par exemple)
    async getDetailsItem(ticketId) {
        try {
            const itemsMap = await this.getItem_Ticket(ticketId);
            console.log('[getDetailsItem] itemsMap =', itemsMap);

            if (!Array.isArray(itemsMap) || itemsMap.length === 0) {
                console.log('[getDetailsItem] Aucun item trouvé');
                return []; // Retourner un tableau vide
            }

            // Tableau pour stocker tous les assets
            const allAssets = [];

            for (const item of itemsMap) {
                try {
                    const asset = await apiClient.get(`${item.itemtype}/${item.items_id}`);
                    console.log('Asset trouvé:', asset.name);
                    allAssets.push(asset); // Ajouter chaque asset au tableau
                } catch (err) {
                    console.error(`Erreur pour ${item.itemtype}/${item.items_id}:`, err.message);
                    // Continuer avec l'item suivant
                }
            }
            
            console.log('[getDetailsItem] Total assets trouvés:', allAssets.length);
            return allAssets; // Retourner tous les assets

        } catch (error) {
            console.error('[getDetailsItem] Erreur:', error.message);
            return []; // Retourner un tableau vide en cas d'erreur
        }
    },

}


// Retourner TOUS les items avec itemtype + items_id
// const result = [];
// for (const item of response) {
//     result.push({
//         itemtype: item.itemtype,
//         items_id: item.items_id
//     });
// }
// return result;