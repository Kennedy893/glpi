const BASE_URL = 'http://localhost:8081/api/super-cost';

export const NewImportRepository = {

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

    // Annuler derniers superCosts
    async annulerLastSuperCosts(ticketId) {
        try {
            const response = await fetch(`${BASE_URL}/annuler/last/${ticketId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Essayer de récupérer le message d'erreur du backend
                let errorMessage = `Erreur HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // Si la réponse n'est pas du JSON
                    errorMessage = `Erreur HTTP: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error(`Erreur POST /api/super-cost/annuler/last:`, error);
            return;
        }
    },

    // Creer un cout de reouverture
    async createReouvertureCost(data) {
        try {
            const response = await fetch(`${BASE_URL}/create/reouverture`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            return await response.json();
            } catch (error) {
            console.error('Erreur POST /api/reouvertureCost:', error);
            throw error;
        }
    },


}