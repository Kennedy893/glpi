import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

// Mapping type CSV → itemtype GLPI
const TYPE_MAP = {
    'Ordinateur': 'Computer',
    'Serveur':    'Computer',
    'Imprimante': 'Printer',
    'Ecran':      'Monitor',
    'Téléphone':  'Phone',
};

export const ImportAssetRepository = {
// --- COMPUTERS --- 
  async createComputer(computerData) {
    console.log('[createComputer] computerData =', computerData);

    try {
        // 3. Préparer le payload avec toutes les données nécessaires
        const payload = {
            input: [computerData]  // ← IMPORTANT: tableau avec un objet
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

  // ImportAssetRepository.js
  async createInfocom(infocomData, id_item) {
    try {
        // Les données sont déjà formatées par le modèle !
        const payload = {
            input: [{
                itemtype: infocomData.glpiType,  // Déjà "Computer", "Printer", etc.
                items_id: parseInt(id_item),
                value: infocomData.prixAchat,    // Déjà un nombre (850.00)
                buy_date: infocomData.dateAchat  // Déjà "2024-01-01"
            }]
        };
        
        // Ajouter les champs optionnels seulement s'ils existent
        if (infocomData.dateFinGarantie) {
            payload.input[0].warranty_date = infocomData.dateFinGarantie;
        }
        
        if (infocomData.fournisseur) {
            payload.input[0].supplier = infocomData.fournisseur;
        }
        
        console.log('[createInfocom] Payload:', JSON.stringify(payload, null, 2));
        
        const response = await apiClient.post('Infocom', payload);
        return response?.[0]?.id || null;
        
    } catch (error) {
        console.error('[createInfocom] Erreur:', error);
        return null;
    }
  },

  async createItemDeviceMemory(itemDeviceMemoryData, id_item, id_ram) {
    try {
        // Vérification stricte des IDs
        console.log('[createItemDeviceMemory] Paramètres:', {
            id_item: id_item,
            id_ram: id_ram,
            type: typeof id_ram,
            itemDeviceMemoryData: itemDeviceMemoryData
        });
        
        // Valider que les IDs sont présents et valides
        if (!id_item || id_item <= 0) {
            console.error('[createItemDeviceMemory] id_item invalide:', id_item);
            return null;
        }
        
        if (!id_ram || id_ram <= 0) {
            console.error('[createItemDeviceMemory] id_ram invalide:', id_ram);
            return null;
        }
        
        // Construire le payload avec le bon format (TABLEAU)
        const payload = {
            input: [{  // ← IMPORTANT: tableau, pas objet
                itemtype: 'Computer',  // ← 'Computer' avec C majuscule
                items_id: parseInt(id_item),
                devicememories_id: parseInt(id_ram)  // ← doit être un nombre valide
            }]
        };
        
        // Optionnel: ajouter la date seulement si elle existe
        if (itemDeviceMemoryData?.date_achat) {
            const formatDate = (dateStr) => {
                if (!dateStr) return null;
                if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
                return null;
            };
            const buyDate = formatDate(itemDeviceMemoryData.date_achat);
            if (buyDate) {
                payload.input[0].buy_date = buyDate;
            }
        }
        
        console.log('[createItemDeviceMemory] Payload final:', JSON.stringify(payload, null, 2));
        
        const response = await apiClient.post('Item_DeviceMemory', payload);
        console.log('[createItemDeviceMemory] Réponse:', response);
        
        // Extraire l'ID (la réponse est un tableau)
        let itemId = null;
        if (response && Array.isArray(response) && response[0] && response[0].id) {
            itemId = response[0].id;
        } else if (response && response.id) {
            itemId = response.id;
        } else if (response && response.data && response.data.id) {
            itemId = response.data.id;
        }
        
        if (!itemId) {
            console.warn('[createItemDeviceMemory] ID non trouvé dans la réponse');
            return null;
        }
        
        console.log('[createItemDeviceMemory] Succès, ID:', itemId);
        return itemId;
        
    } catch (error) {
        console.error('[createItemDeviceMemory] Erreur:', error);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        // Non bloquant - on continue l'import
        return null;
    }
  },

  async createItemDeviceHardDrive(itemDeviceHardDriveData, id_item, id_hdd) {
    try {
        if (!id_item || !id_hdd) {
            console.warn('[createItemDeviceHardDrive] IDs manquants, liaison ignorée.');
            return null;
        }

        const payload = {
        input: [{
            itemtype:             'Computer',        //  PascalCase, fixe
            items_id:             parseInt(id_item),
            deviceharddrives_id:  parseInt(id_hdd), //  pluriel, sans underscore avant _id
            capacity:             itemDeviceHardDriveData.stockage || 0 // déjà en Mo
        }]
        };

        console.log('[createItemDeviceHardDrive] Payload:', JSON.stringify(payload, null, 2));

        const response = await apiClient.post('Item_DeviceHardDrive', payload);

        let itemId = null;
        if (Array.isArray(response) && response[0]?.id) {
            itemId = response[0].id;
        } else if (response?.id) {
            itemId = response.id;
        }

        if (!itemId) {
            console.warn('[createItemDeviceHardDrive] ID non trouvé dans la réponse:', response);
            return null;
        }

        console.log('[createItemDeviceHardDrive] Succès, ID:', itemId);
        return itemId;

    } catch (error) {
        console.error('[createItemDeviceHardDrive] Erreur:', error);
        return null; // non bloquant
    }
  },

  async createItemOS(itemOSData, id_item, id_os) {
    try {
        const payload = {
            input: [{
                "itemtype":  itemOSData.type || 'computer',
                "items_id":  id_item || 0, // <id_computer>
                "operatingsystems_id":    id_os || 0
            }]
        };
        console.log(payload);

        const response = await apiClient.post('Item_OperatingSystem', payload);
        console.log("[createItemOS] Reponse creation Item_OperatingSystem = " + response);
        
        let infocomId = null;
        if (response && response.id) {
            infocomId = response.id;
        } else if (response && response[0] && response[0].id) {
            infocomId = response[0].id;
        } else if (response && response.data && response.data.id) {
            infocomId = response.data.id;
        }

        if (!infocomId) {
            console.error('Format de réponse inattendu:', response);
            throw new Error('Impossible de récupérer l\'ID de l\'Infocom créé');
        }

        return infocomId;
    } catch (error) {
        console.error('[createItemOS] Erreur détaillée:', error);
        
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

// --- PRINTERS --- 
  async createPrinter(printerData) {
    console.log('[createPrinter] computerData =', printerData);

    try {
        // 1. Préparer le payload avec toutes les données nécessaires
        const payload = {
            input: [printerData]  // ← IMPORTANT: tableau avec un objet
        };

        console.log('[createPrinter] Payload envoyé =', JSON.stringify(payload, null, 2));

        // 2. Envoyer la requête (sans slash devant Printer)
        const response = await apiClient.post('Printer', payload);

        console.log('[createPrinter] Réponse création computer =', response);

        // 3. Extraire l'ID créé (gérer différents formats de réponse)
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

        console.log('[createPrinter] Utilisateur créé avec succès, ID =', computerId);
        return computerId;

    } catch (error) {
        console.error('[createPrinter] Erreur détaillée:', error);
        
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