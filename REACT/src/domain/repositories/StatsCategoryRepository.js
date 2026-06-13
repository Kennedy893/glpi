const BASE_URL = 'http://localhost:8081/api/super-cost';

export const StatsCategoryRepository = {

    async getStatsCategory() {
        try {
            const response = await fetch(`${BASE_URL}/statsByCategorie`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('[statsByCategorie SQLite]', response);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log('[statsByCategorie SQLite] erreur = ', error || error.message);
            console.error(error);
        }
    }
}