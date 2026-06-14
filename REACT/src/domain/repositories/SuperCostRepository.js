const BASE_URL = 'http://localhost:8081/api/super-cost';

export const SuperCostRepository = {
    async createSuperCost(data) {
        try {
            const response = await fetch(`${BASE_URL}/create/super`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
            } catch (error) {
            console.error('Erreur POST /api/superCost:', error);
            throw error;
        }
    },

    async createGlpiCost(data) {
        try {
            const response = await fetch(`${BASE_URL}/create/glpi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
            } catch (error) {
            console.error('Erreur POST /api/superCost:', error);
            throw error;
        }
    },

     // ✅ Ajouter cette fonction
    async getAllSuperCosts() {
        try {
            const response = await fetch(`${BASE_URL}/all`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log('[SuperCostRepository] getAllSuperCosts:', data);
            return data;
        } catch (error) {
            console.error('Erreur GET /api/super-cost/all:', error);
            return []; // Retourner un tableau vide en cas d'erreur
        }
    },

    // Optionnel: Récupérer par ticket
    async getSuperCostsByTicket(ticketId) {
        try {
            const response = await fetch(`${BASE_URL}/ticket/${ticketId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur GET /api/super-cost/ticket/${ticketId}:`, error);
            return [];
        }
    },

    // Optionnel: Récupérer par item
    async getSuperCostsByItem(itemId) {
        try {
            const response = await fetch(`${BASE_URL}/item/${itemId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur GET /api/super-cost/item/${itemId}:`, error);
            return [];
        }
    },

    // Annuler derniers superCosts
    async annulerLastSuperCosts() {
        try {
            const response = await fetch(`${BASE_URL}/annuler/last`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur POST /api/super-cost/annuler/last:`, error);
            return;
        }
    }
    
}