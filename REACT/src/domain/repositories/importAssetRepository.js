import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const ImportAssetRepository = {
  async createComputer(computerData) {
    console.log('[createComputer] computerData =', computerData);

    // 1. Validation des données obligatoires

    try {
        // 3. Préparer le payload avec toutes les données nécessaires
        const payload = {
            input: {
                name: computerData.name.trim(), 
                otherserial: computerData.reference || '',
                serial: computerData.numero_serie || ''
            }
        };

        console.log('[createComputer] Payload envoyé =', JSON.stringify(payload, null, 2));

        // 4. Envoyer la requête (sans slash devant Computer)
        const response = await apiClient.post('Computer', payload);

        console.log('[createComputer] Réponse création computer =', response);

        // 5. Extraire l'ID créé (gérer différents formats de réponse)
        let computerId = null;
        if (response && response.id) {
        computerId = response.id;
        } else if (response && response[0] && response[0].id) {
        computerId = response[0].id;
        } else if (response && response.data && response.data.id) {
        computerId = response.data.id;
        }

        if (!computerId) {
        console.error('Format de réponse inattendu:', response);
        throw new Error('Impossible de récupérer l\'ID du computer créé');
        }

        console.log('[createComputer] Utilisateur créé avec succès, ID =', computerId);
        return computerId;

    } catch (error) {
        console.error('[createComputer] Erreur détaillée:', error);
        
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
}