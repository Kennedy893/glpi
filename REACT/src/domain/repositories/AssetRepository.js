import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const AssetRepository = {

    // Récupérer TOUS les assets d'un type (ex: 'Computer', 'Monitor')
    async getAllAsset(typeAsset) {
        try {
            console.log('[getAllAsset] avec typeAsset = ', typeAsset);

            // Requête avec pagination pour éviter trop de données
            const response = await apiClient.get(`${typeAsset}?range=0-999&expand=1`);
            
            // Vérifier que response est un tableau
            if (!Array.isArray(response)) {
                console.warn('[getAllAsset] La réponse n\'est pas un tableau:', response);
                return [];
            }
            
            console.log(`[getAllAsset] ${response.length} éléments trouvés pour ${typeAsset}`);
            
            // Retourner le tableau complet
            return response;
            
        } catch (error) {
            console.error('[getAllAsset] Erreur pour', typeAsset, ':', error.message);
            
            // Retourner un tableau vide en cas d'erreur (pas null ou undefined)
            return [];
        }
    },

    // Récupérer un asset par son ID (pour les détails)
    async getAssetById(typeAsset, id) {
        try {
            console.log(`[getAssetById] ${typeAsset}/${id}`);
            
            const response = await apiClient.get(`${typeAsset}/${id}?expand=1`);
            
            return response || null;
            
        } catch (error) {
            console.error(`[getAssetById] Erreur ${typeAsset}/${id}:`, error.message);
            return null;
        }
    },

    // Detail = manufacturer, location, state, modele(if if...), user
    // async getDetailAsset(typeAsset, assetId, nomDetail) {
    //     try {
    //         const response = await apiClient.get(`${typeAsset}/${assetId}/${nomDetail}/name`);
    //         return response;
    //     } catch (error) {
    //         console.error('[getDetailAsset] Erreur pour', typeAsset, ':', error.message);
    //     }
    // }

    // AssetRepository.js

    // Récupérer un asset complet avec tous ses détails
    async getAssetWithDetails(typeAsset, assetId) {
        try {
            // 1. Récupérer l'asset principal
            const asset = await apiClient.get(`${typeAsset}/${assetId}?expand=1`);
            
            if (!asset) return null;
            
            // 2. Récupérer les détails en parallèle
            const details = {};
            
            // Fabricant
            if (asset.manufacturers_id) {
                try {
                    const manufacturer = await apiClient.get(`Manufacturer/${asset.manufacturers_id}`);
                    details.manufacturer = manufacturer?.name || null;
                } catch (e) {
                    details.manufacturer = null;
                }
            }
            
            // Localisation
            if (asset.locations_id) {
                try {
                    const location = await apiClient.get(`Location/${asset.locations_id}`);
                    details.location = location?.name || null;
                } catch (e) {
                    details.location = null;
                }
            }
            
            // État
            if (asset.states_id) {
                try {
                    const state = await apiClient.get(`State/${asset.states_id}`);
                    details.state = state?.name || null;
                } catch (e) {
                    details.state = null;
                }
            }
            
            // Modèle (selon le type d'asset)
            const modelField = this.getModelField(typeAsset);
            if (asset[modelField]) {
                try {
                    const model = await apiClient.get(`${this.getModelEndpoint(typeAsset)}/${asset[modelField]}`);
                    details.model = model?.name || null;
                } catch (e) {
                    details.model = null;
                }
            }
            
            // Utilisateur (pour Computer uniquement)
            if (asset.users_id) {
                try {
                    const user = await apiClient.get(`User/${asset.users_id}`);
                    details.user = user?.name || null;
                } catch (e) {
                    details.user = null;
                }
            }
            
            // 3. Fusionner l'asset avec ses détails
            return {
                ...asset,
                manufacturer: details.manufacturer,
                location: details.location,
                state: details.state,
                model: details.model,
                user: details.user,
                type: typeAsset
            };
            
        } catch (error) {
            console.error(`[getAssetWithDetails] Erreur ${typeAsset}/${assetId}:`, error.message);
            return null;
        }
    },

    // Helper : champ du modèle selon le type
    getModelField(typeAsset) {
        const fields = {
            Computer: 'computermodels_id',
            Printer: 'printermodels_id',
            Monitor: 'monitormodels_id',
            NetworkEquipment: 'networkequipmentmodels_id',
            Phone: 'phonemodels_id',
            Peripheral: 'peripheralmodels_id'
        };
        return fields[typeAsset] || null;
    },

    // Helper : endpoint du modèle selon le type
    getModelEndpoint(typeAsset) {
        const endpoints = {
            Computer: 'Computermodel',
            Printer: 'Printermodel',
            Monitor: 'Monitormodel',
            NetworkEquipment: 'Networkequipmentmodel',
            Phone: 'Phonemodel',
            Peripheral: 'Peripheralmodel'
        };
        return endpoints[typeAsset] || null;
    },

    // Récupérer la première image associée à un asset
    // domain/repositories/AssetRepository.js

// Récupérer la première image associée à un asset
// domain/repositories/AssetRepository.js

// Récupérer la première image associée à un asset
async getAssetImage(assetId, assetType = 'Computer') {
    try {
        const sessionToken = apiClient.sessionToken;
        const appToken = apiClient.appToken;
        const baseUrl = apiClient.baseUrl;
        
        // 1. Chercher les documents associés à l'asset
        const response = await apiClient.get(`Document_Item?expand=1&criteria[items_id]=${assetId}&criteria[itemtype]=${assetType}`);
        
        if (!response || response.length === 0) {
            return null;
        }
        
        // 2. Prendre le premier document
        const firstDoc = response[0];
        const documentId = firstDoc.documents_id;
        
        // 3. Récupérer les détails du document
        const document = await apiClient.get(`Document/${documentId}`);
        
        if (!document) {
            return null;
        }
        
        // 4. 🔥 CRITIQUE: Utiliser directement l'API GLPI avec les tokens dans les headers
        // Pas besoin de construire une URL avec paramètres, le session token est déjà dans apiClient
        const downloadUrl = `${baseUrl}/Document/${documentId}/download`;
        
        return {
            id: documentId,
            name: document.name,
            url: downloadUrl,
            // On utilisera fetch directement pour l'image avec les bons headers
            downloadUrl: downloadUrl
        };
        
    } catch (error) {
        console.error('[getAssetImage] Erreur:', error);
        return null;
    }
},
// Récupérer toutes les images d'un asset
async getAssetImages(assetId, assetType = 'Computer') {
    try {
        const sessionToken = apiClient.sessionToken;
        const appToken = apiClient.appToken;
        const baseUrl = apiClient.baseUrl;
        
        const response = await apiClient.get(`Document_Item?expand=1&criteria[items_id]=${assetId}&criteria[itemtype]=${assetType}`);
        
        if (!response || response.length === 0) {
            return [];
        }
        
        const images = [];
        for (const docItem of response) {
            const document = await apiClient.get(`Document/${docItem.documents_id}`);
            if (document && document.filepath) {
                // 🔥 Ajouter les tokens dans l'URL
                images.push({
                    id: document.id,
                    name: document.name,
                    url: `${baseUrl}/Document/${document.id}/download?app_token=${appToken}&session_token=${sessionToken}`,
                    filepath: document.filepath
                });
            }
        }
        
        return images;
        
    } catch (error) {
        console.error('[getAssetImages] Erreur:', error);
        return [];
    }
}
}