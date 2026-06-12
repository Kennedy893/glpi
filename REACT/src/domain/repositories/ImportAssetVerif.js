import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const ImportAssetVerif = {
    // Fonction generalisée
    async getOrCreateEntity(name, config = {}) {
        const {
            entityType = 'Manufacturer',           // Type d'entité (Manufacturer, DeviceMemory, etc.)
            searchField = 'name',               // Champ pour la recherche exacte
            createField = 'name',               // Champ pour la création
            searchParams = {},                  // Paramètres de recherche supplémentaires
            createData = {},                    // Données supplémentaires pour la création
            expand = 1                          // Paramètre expand
        } = config;

        console.log(`[getOrCreate${entityType}] ${searchField} =`, name);

        if (!name || name.trim() === '') {
            console.log(`[getOrCreate${entityType}] Pas de valeur, retour null`);
            return null;
        }

        try {
            // 1. Rechercher l'entité existante
            console.log(`[getOrCreate${entityType}] Recherche...`);
            
            // Construire l'URL de recherche dynamiquement
            let searchUrl = `${entityType}?searchText=${encodeURIComponent(name)}`;
            if (expand) searchUrl += `&expand=${expand}`;
            
            // Ajouter des paramètres de recherche supplémentaires
            for (const [key, value] of Object.entries(searchParams)) {
                searchUrl += `&${key}=${encodeURIComponent(value)}`;
            }
            
            const response = await apiClient.get(searchUrl);
            
            console.log(`[getOrCreate${entityType}] Résultat recherche =`, response);

            // Vérifier si des résultats existent et faire une correspondance EXACTE
            if (response && Array.isArray(response) && response.length > 0) {
                // Chercher une correspondance exacte sur le champ spécifié
                const exactMatch = response.find(entity => entity[searchField] === name);
                
                if (exactMatch) {
                    console.log(`[getOrCreate${entityType}] Entité trouvée (exacte), id =`, exactMatch.id);
                    return exactMatch.id;
                } else {
                    console.log(`[getOrCreate${entityType}] Pas de correspondance exacte trouvée parmi`, response.length, 'résultats');
                }
            }

            // 2. Créer l'entité si non trouvée
            console.log(`[getOrCreate${entityType}] Création...`);
            
            // Construire l'objet de création
            const creationInput = {
                [createField]: name,
                is_recursive: 0,
                comment: `Créé automatiquement depuis l'import CSV`,
                ...createData
            };
            
            const createResponse = await apiClient.post(entityType, {
                input: creationInput
            });

            console.log(`[getOrCreate${entityType}] Réponse création =`, createResponse);

            // Extraire l'ID créé (gérer différents formats)
            let createdId = null;
            if (createResponse && createResponse.id) {
                createdId = createResponse.id;
            } else if (createResponse && createResponse[0] && createResponse[0].id) {
                createdId = createResponse[0].id;
            } else if (createResponse && createResponse.data && createResponse.data.id) {
                createdId = createResponse.data.id;
            }

            if (createdId) {
                console.log(`[getOrCreate${entityType}] Entité créée avec succès, id =`, createdId);
                return createdId;
            } else {
                console.error(`[getOrCreate${entityType}] Format de réponse inattendu:`, createResponse);
                return null;
            }

        } catch (error) {
            console.error(`[getOrCreate${entityType}] Erreur détaillée:`, error);
            
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            
            return null;
        }
    },

    // Trouver un Computer par son nom
    async findComputerByName(name) {
        try {
            const results = await apiClient.get(`Computer?searchText=${encodeURIComponent(name)}&range=0-1`);
            if (Array.isArray(results) && results.length > 0) { 
                return results[0].id;
            }
            return null;
        } catch (error) {
            console.error(`[findComputerByName]:`, error);
        }
    },

    // Trouver un Monitor par son nom
    async findMonitorByName(name) {
        try {
            const results = await apiClient.get(`Monitor?searchText=${encodeURIComponent(name)}&range=0-1`);
            if (Array.isArray(results) && results.length > 0) { 
                return results[0].id;
            }
            return null;
        } catch (error) {
            console.error(`[findMonitorByName]:`, error);
        }
    },

    // Wrapper pour User (comportement original)
    async getOrCreateUser(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'User',
            searchField: 'name'
        });
    },

    // Wrapper pour Manufacturer (comportement original)
    async getOrCreateManufacturer(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'Manufacturer',
            searchField: 'name'
        });
    },

    // Wrapper pour ComputerModel (comportement original)
    async getOrCreateComputerModel(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'ComputerModel',
            searchField: 'name'
        });
    },

    // Wrapper pour PrinterModel (comportement original)
    async getOrCreatePrinterModel(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'PrinterModel',
            searchField: 'name'
        });
    },

    // Wrapper pour MonitorModel (comportement original)
    async getOrCreateMonitorModel(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'MonitorModel',
            searchField: 'name'
        });
    },

    // Wrapper pour PhoneModel (comportement original)
    async getOrCreatePhoneModel(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'PhoneModel',
            searchField: 'name'
        });
    },

    // Wrapper pour State (comportement original)
    async getOrCreateState(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'State',
            searchField: 'name'
        });
    },

    // Wrapper pour Location (comportement original)
    async getOrCreateLocation(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'Location',
            searchField: 'name'
        });
    },

    // Wrapper pour OperatingSystem (comportement original)
    async getOrCreateOperatingSystem(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'OperatingSystem',
            searchField: 'name'
        });
    },

    // Wrapper pour DeviceMemory
    async getOrCreateDeviceMemory(designation) {
        return this.getOrCreateEntity(designation, {
            entityType: 'DeviceMemory',
            searchField: 'designation',
            createField: 'designation',
            searchParams: { 'expand': 1 }
        });
    },

    // Wrapper pour DeviceHardDrive
    async getOrCreateDeviceHardDrive(designation) {
        return this.getOrCreateEntity(designation, {
            entityType: 'DeviceHardDrive',
            searchField: 'designation',
            createField: 'designation'
        });
    },


    // Vous pourriez aussi ajouter ces wrappers utiles :
    async getOrCreateDeviceProcessor(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'DeviceProcessor',
            searchField: 'designation',
            createField: 'designation'
        });
    },

    async getOrCreateDeviceGraphicCard(name) {
        return this.getOrCreateEntity(name, {
            entityType: 'DeviceGraphicCard',
            searchField: 'designation',
            createField: 'designation'
        });
    }

}