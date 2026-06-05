import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

/**
 * Ordre de suppression logique pour éviter les erreurs de clés étrangères :
 * 1. Supprimer d'abord toutes les associations (Item_*)
 * 2. Supprimer les informations financières (Infocom)
 * 3. Supprimer les composants techniques (Device*)
 * 4. Supprimer les équipements (Computer, Printer, Monitor, etc.)
 * 5. Supprimer les systèmes d'exploitation (OperatingSystem)
 * 6. Supprimer les données référentielles (State, Location, Manufacturer, etc.)
 * 7. Supprimer les relations utilisateurs (Group_User, Profile_User)
 * 8. En dernier, les données critiques (User, Entity) avec protections
 */

const ENDPOINTS_TO_PURGE = [
    // ==================== 1. ÉCOSYSTÈME DES TICKETS (À VIRER AVANT LE TICKET LUI-MÊME) ====================
    'TicketCost',       
    'ITILSolution',
    'ITILFollowup',             // Suivis de tickets (parfois 'Followup' selon les plugins, mettons le standard GLPI)
    'TicketTask',               // Tâches des tickets
    'TicketValidation',         // Validations de tickets
    'Ticket_User',              // Liens Acteurs <-> Tickets
    'Item_Ticket',              // Liens Équipements <-> Tickets
    
    // ==================== 2. LES TICKETS ====================
    'Ticket',                   // Maintenant qu'il est isolé, le ticket peut être purgé
    'TaskCategory',             // Catégories de tâches
    
    // ==================== 3. ASSOCIATIONS DU PARC ====================
    'Item_DeviceMemory', 'Item_DeviceHardDrive', 'Item_DeviceProcessor', 
    'Item_DeviceGraphicCard', 'Item_DeviceNetworkCard', 'Item_DeviceSoundCard', 
    'Item_DeviceMotherboard', 'Item_DevicePowerSupply', 'Item_DeviceDrive', 
    'Item_DeviceControl', 'Item_DeviceSensor', 'Item_DeviceCase', 
    'Item_OperatingSystem', 'Infocom', 
    
    // ==================== 4. COMPOSANTS TECHNIQUES ====================
    'DeviceMemory', 'DeviceHardDrive', 'DeviceProcessor', 'DeviceGraphicCard', 
    'DeviceNetworkCard', 'DeviceSoundCard', 'DeviceMotherboard', 'DevicePowerSupply', 
    'DeviceDrive', 'DeviceControl', 'DeviceSensor', 'DeviceCase', 'DeviceBattery', 'DeviceFirmware', 
    
    // ==================== 5. SYSTÈMES D'EXPLOITATION ====================
    'OperatingSystem', 'OperatingSystemVersion', 'OperatingSystemEdition', 
    'OperatingSystemKernel', 'OperatingSystemServicePack', 
    
    // ==================== 6. ÉQUIPEMENTS PRINCIPAUX ====================
    'Computer', 'Printer', 'Monitor', 'NetworkEquipment', 'Phone', 'Peripheral', 
    'Software', 'SoftwareLicense', 'SoftwareVersion', 'CartridgeItem', 'ConsumableItem', 
    'Contract', 'Certificate', 'Appliance', 
    
    // ==================== 7. PROJETS & RESSOURCES ====================
    'ProjectTask', 'Project', 'Budget', 'Supplier', 'Contact_Supplier', 'Contact', 
    
    // ==================== 8. RELATIONS UTILISATEURS ====================
    'Group_User', 
    // 'Profile_User', 
    'Group', 
    'UserEmail',                // Adresses emails distantes (souvent liées à glpi_useremails)
    
    // ==================== 9. DONNÉES CRITIQUES (EN TOUT DERNIER) ====================
    'User',                     // Les utilisateurs (sans les tickets rattachés, ils sautent enfin)
    'Profile', 
    'Entity'
];

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const resetDataRepository = {
    
    async resetAllData(keepReferentials = false) { // 💡 Changé à FALSE par défaut pour que l'action par défaut nettoie tout
        console.log('[ResetData] 🚨 DÉBUT DE LA RÉINITIALISATION COMPLÈTE OPTIMISÉE 🚨');
        
        let ticketsSupprimés = 0;
        let usersSupprimés = 0;
        let assetsSupprimés = 0;
        const errors = [];
        
        const results = { 
            success: [], errors: [], skipped: [],
            ticketsSupprimés: 0, usersSupprimés: 0, assetsSupprimés: 0, errorsList: []
        };
        
        for (const endpoint of ENDPOINTS_TO_PURGE) {
            // Sécurité : Si keepReferentials est actif, on protège les tables de structure
            if (keepReferentials && this.isReferentialEndpoint(endpoint)) {
                console.log(`[ResetData] ⏭️ Skipped (référentiel conservé): ${endpoint}`);
                results.skipped.push(endpoint);
                continue;
            }
            
            try {
                console.log(`[ResetData] 📡 Récupération de: ${endpoint}`);
                
                // 💡 AJOUT : range=0-2000 supprime les 2000 premiers. Si tu as énormément de data, 
                // on met une sécurité pour vider les tables d'associations d'un seul coup.
                const response = await apiClient.get(`${endpoint}?range=0-2000&expand=0`);
                
                let items = Array.isArray(response) 
                    ? response 
                    : (response?.data && Array.isArray(response.data)) 
                        ? response.data 
                        : response?.['hydra:member'] || [];
                
                if (items.length === 0) {
                    continue;
                }
                
                // Filtrer les éléments protégés du cœur (comme l'user 'glpi')
                const itemsToDelete = items.filter(item => !this.isProtectedItem(endpoint, item));

                if (itemsToDelete.length === 0) continue;

                console.log(`[ResetData] 📊 ${itemsToDelete.length} élément(s) à purger pour ${endpoint}`);
                
                const batches = chunkArray(itemsToDelete, 20);

                for (const batch of batches) {
                    const deletePromises = batch.map(async (item) => {
                    try {
                        if (endpoint === 'Ticket') {
                            try {
                                // Tentative 1 : Purge directe (méthode radicale)
                                await apiClient.delete(`${endpoint}/${item.id}?force_purge=true`);
                            } catch (firstAnomalie) {
                                console.log(`[ResetData] ⚠️ Purge directe du ticket ${item.id} refusée. Tentative via mise à la corbeille...`);
                                
                                // Tentative 2 : Envoi à la corbeille d'abord (DELETE standard)
                                await apiClient.delete(`${endpoint}/${item.id}`);
                                
                                // Suivi immédiatement de la purge de la corbeille
                                await apiClient.delete(`${endpoint}/${item.id}?force_purge=true`);
                            }
                            ticketsSupprimés++;
                        } else {
                            // Comportement normal pour tous les autres endpoints
                            await apiClient.delete(`${endpoint}/${item.id}?force_purge=true`);
                            
                            if (endpoint === 'User') {
                                usersSupprimés++;
                            } else if (['Computer', 'Printer', 'Monitor', 'NetworkEquipment', 'Phone', 'Peripheral'].includes(endpoint)) {
                                assetsSupprimés++;
                            }
                        }
                    } catch (deleteError) {
                        const errMsg = deleteError.response?.data?.[1] || deleteError.response?.data?.message || deleteError.message;
                        console.error(`[ResetData] ❌ Échec persistant sur ${endpoint} ID ${item.id}:`, errMsg);
                        errors.push(`${endpoint} (ID: ${item.id}): ${errMsg}`);
                    }
                });

                    await Promise.all(deletePromises);
                }
                
                results.success.push(`${endpoint}: ${itemsToDelete.length} traité(s)`);
                
            } catch (error) {
                const globalErrMsg = error.response?.data?.[1] || error.message;
                console.error(`[ResetData] ❌ Erreur sur ${endpoint}:`, globalErrMsg);
                errors.push(`${endpoint}: ${globalErrMsg}`);
            }
        }
        
        // Hydratation des compteurs finaux
        results.ticketsSupprimés = ticketsSupprimés;
        results.usersSupprimés = usersSupprimés;
        results.assetsSupprimés = assetsSupprimés;
        results.errorsList = errors;
        
        console.log('\n===== FIN DU TRAITEMENT =====');
        console.log(`📊 Résumé -> Tickets purgés: ${ticketsSupprimés}, Users purgés: ${usersSupprimés}, Matériels: ${assetsSupprimés}`);
        
        return {
            success: errors.length === 0 || ticketsSupprimés > 0 || usersSupprimés > 0 || assetsSupprimés > 0,
            data: { ticketsSupprimés, usersSupprimés, assetsSupprimés, errors: errors },
            error: errors.length > 0 ? `${errors.length} requêtes ont échoué.` : null,
            rawResults: results
        };
    },

    isReferentialEndpoint(endpoint) {
        const referentials = [
            'ComputerModel', 'PrinterModel', 'MonitorModel', 'NetworkEquipmentModel', 'PhoneModel', 'PeripheralModel',
            'Manufacturer', 'State', 'Location', 'Entity', 'Profile', 'User'
        ];
        return referentials.includes(endpoint);
    },
    
    isProtectedItem(endpoint, item) {
        if (endpoint === 'Entity' && (item.id === 0 || item.id === '0' || item.completename === 'Root entity')) return true;
        if (endpoint === 'User' && (item.name === 'glpi' || item.name === 'glpi-system' || item.id === 1 || item.id === '1')) return true;
        if (endpoint === 'Profile' && (item.name === 'Super-Admin' || item.id === 1 || item.id === '1')) return true;
        return false;
    },
    
    /**
     * Supprime uniquement les équipements (computers, printers, monitors, etc.)
     * Conserve les référentiels et les associations
     */
    async resetOnlyAssets() {
        const assetEndpoints = ['Computer', 'Printer', 'Monitor', 'NetworkEquipment', 'Phone', 'Peripheral'];
        
        for (const endpoint of assetEndpoints) {
            try {
                const response = await apiClient.get(`${endpoint}?range=0-2000`);
                let items = Array.isArray(response) ? response : (response.data || []);
                
                for (const item of items) {
                    await apiClient.delete(`${endpoint}/${item.id}?force_purge=1`);
                    console.log(`[ResetAssets] ✅ Supprimé: ${endpoint} ${item.name}`);
                }
            } catch (error) {
                console.error(`[ResetAssets] ❌ Erreur ${endpoint}:`, error.message);
            }
        }
    },
    
    /**
     * Supprime uniquement les associations et composants
     * Utile pour repartir à zéro sur les liaisons sans toucher aux équipements
     */
    async resetOnlyComponents() {
        const componentEndpoints = [
            'Item_DeviceMemory', 'Item_DeviceHardDrive', 'Item_DeviceProcessor',
            'Item_DeviceGraphicCard', 'Item_OperatingSystem', 'Infocom',
            'DeviceMemory', 'DeviceHardDrive', 'DeviceProcessor'
        ];
        
        for (const endpoint of componentEndpoints) {
            try {
                const response = await apiClient.get(`${endpoint}?range=0-2000`);
                let items = Array.isArray(response) ? response : (response.data || []);
                
                for (const item of items) {
                    await apiClient.delete(`${endpoint}/${item.id}?force_purge=1`);
                }
                console.log(`[ResetComponents] ✅ ${endpoint} nettoyé`);
            } catch (error) {
                console.error(`[ResetComponents] ❌ Erreur ${endpoint}:`, error.message);
            }
        }
    },
    
    /**
     * Supprime uniquement les tickets et leur historique
     */
    async resetOnlyTickets() {
        const ticketEndpoints = ['Ticket', 'Ticket_User', 'Ticket_Validation', 'Followup', 'Solution', 'Task'];
        
        for (const endpoint of ticketEndpoints) {
            try {
                const response = await apiClient.get(`${endpoint}?range=0-2000`);
                let items = Array.isArray(response) ? response : (response.data || []);
                
                for (const item of items) {
                    await apiClient.delete(`${endpoint}/${item.id}?force_purge=1`);
                }
                console.log(`[ResetTickets] ✅ ${endpoint} nettoyé`);
            } catch (error) {
                console.error(`[ResetTickets] ❌ Erreur ${endpoint}:`, error.message);
            }
        }
    }
};