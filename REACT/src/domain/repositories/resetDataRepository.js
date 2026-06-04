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
    // ==================== 1. ASSOCIATIONS (liens entre équipements et composants) ====================
    'Item_DeviceMemory',        // Association RAM - Ordinateur
    'Item_DeviceHardDrive',     // Association Disque dur - Ordinateur
    'Item_DeviceProcessor',     // Association Processeur - Ordinateur
    'Item_DeviceGraphicCard',   // Association Carte graphique - Ordinateur
    'Item_DeviceNetworkCard',   // Association Carte réseau - Ordinateur
    'Item_DeviceSoundCard',     // Association Carte son - Ordinateur
    'Item_DeviceMotherboard',   // Association Carte mère - Ordinateur
    'Item_DevicePowerSupply',   // Association Alimentation - Ordinateur
    'Item_DeviceDrive',         // Association Lecteur CD/DVD - Ordinateur
    'Item_DeviceControl',       // Association Contrôleur - Ordinateur
    'Item_DeviceSensor',        // Association Capteur - Ordinateur
    'Item_DeviceCase',          // Association Boîtier - Ordinateur
    'Item_OperatingSystem',     // Association OS - Ordinateur
    'Infocom',                  // Informations financières
    
    // ==================== 2. COMPOSANTS TECHNIQUES (le référentiel) ====================
    'DeviceMemory',             // Référentiel des mémoires (RAM)
    'DeviceHardDrive',          // Référentiel des disques durs
    'DeviceProcessor',          // Référentiel des processeurs
    'DeviceGraphicCard',        // Référentiel des cartes graphiques
    'DeviceNetworkCard',        // Référentiel des cartes réseau
    'DeviceSoundCard',          // Référentiel des cartes son
    'DeviceMotherboard',        // Référentiel des cartes mères
    'DevicePowerSupply',        // Référentiel des alimentations
    'DeviceDrive',              // Référentiel des lecteurs
    'DeviceControl',            // Référentiel des contrôleurs
    'DeviceSensor',             // Référentiel des capteurs
    'DeviceCase',               // Référentiel des boîtiers
    'DeviceBattery',            // Référentiel des batteries
    'DeviceFirmware',           // Référentiel des firmwares
    
    // ==================== 3. SYSTÈMES D'EXPLOITATION ====================
    'OperatingSystem',          // Référentiel des OS (version)
    'OperatingSystemVersion',   // Versions des OS
    'OperatingSystemEdition',   // Éditions des OS
    'OperatingSystemKernel',    // Noyaux des OS
    'OperatingSystemServicePack',// Service packs des OS
    
    // ==================== 4. ÉQUIPEMENTS PRINCIPAUX ====================
    'Computer',                 // Ordinateurs
    'Printer',                  // Imprimantes
    'Monitor',                  // Écrans
    'NetworkEquipment',         // Équipements réseau (switchs, routeurs)
    'Phone',                    // Téléphones
    'Peripheral',               // Périphériques (souris, claviers)
    'Software',                 // Logiciels installés
    'SoftwareLicense',          // Licences logicielles
    'SoftwareVersion',          // Versions des logiciels
    
    // ==================== 5. ÉQUIPEMENTS DIVERS ====================
    'CartridgeItem',            // Cartouches
    'ConsumableItem',           // Consommables
    'Contract',                 // Contrats
    'Certificate',              // Certificats
    'Appliance',                // Appliances
    
    // ==================== 6. GESTION DES TICKETS ====================
    'Ticket',                   // Tickets
    'Ticket_User',              // Association Ticket - Utilisateur
    'Ticket_Validation',        // Validations de tickets
    'Followup',                 // Suivis de tickets
    'Solution',                 // Solutions de tickets
    'Task',                     // Tâches
    'TaskCategory',             // Catégories de tâches
    
    // ==================== 7. GESTION DES PROJETS ====================
    'Project',                  // Projets
    'ProjectTask',              // Tâches de projet
    'Project_Team',             // Équipes de projet
    
    // ==================== 8. GESTION DES RESSOURCES ====================
    'Budget',                   // Budgets
    'Supplier',                 // Fournisseurs
    'Contact',                  // Contacts
    'Contact_Supplier',         // Association Contact - Fournisseur
    
    // ==================== 9. MODÈLES ET FABRICANTS (référentiel à conserver partiellement) ====================
    // 'ComputerModel',          // Commenté car à conserver (référentiel)
    // 'PrinterModel',           // Commenté car à conserver (référentiel)
    // 'MonitorModel',           // Commenté car à conserver (référentiel)
    // 'NetworkEquipmentModel',  // Commenté car à conserver (référentiel)
    // 'PhoneModel',             // Commenté car à conserver (référentiel)
    // 'PeripheralModel',        // Commenté car à conserver (référentiel)
    // 'Manufacturer',           // Commenté car à conserver (référentiel)
    
    // ==================== 10. ÉTATS ET LOCALISATIONS (référentiel à conserver) ====================
    // 'State',                  // Commenté car à conserver (référentiel)
    // 'Location',               // Commenté car à conserver (référentiel)
    
    // ==================== 11. RELATIONS UTILISATEURS ====================
    'Group_User',               // Association Groupe - Utilisateur
    'Profile_User',             // Association Profil - Utilisateur
    'Group',                    // Groupes d'utilisateurs
    'User_Validation',          // Validations des utilisateurs
    'User_Email',               // Emails des utilisateurs
    
    // ==================== 12. DONNÉES CRITIQUES (suppression avec précautions) ====================
    'User',                     // Utilisateurs (sauf 'glpi')
    'Profile',                  // Profils (sauf 'Super-Admin')
    'Entity'                    // Entités (sauf racine id=0)
];

/**
 * Découpe un tableau en plusieurs paquets (chunks) d'une taille maximale donnée
 */
const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const resetDataRepository = {
    /**
     * Supprime TOUTES les données de GLPI (mode radical)
     * ⚠️ ATTENTION : Cette action est irréversible !
     * @param {boolean} keepReferentials - Si true, conserve les référentiels (fabricants, modèles, états, localisations)
     */
    async resetAllData(keepReferentials = true) {
        console.log('[ResetData] 🚨 DÉBUT DE LA RÉINITIALISATION COMPLÈTE RAPIDE 🚨');
        
        const results = { success: [], errors: [], skipped: [] };
        
        for (const endpoint of ENDPOINTS_TO_PURGE) {
            if (keepReferentials && this.isReferentialEndpoint(endpoint)) {
                console.log(`[ResetData] ⏭️ Skipped (référentiel conservé): ${endpoint}`);
                results.skipped.push(endpoint);
                continue;
            }
            
            try {
                console.log(`[ResetData] 📡 Récupération de: ${endpoint}`);
                // Astuce : expand=0 charge beaucoup moins le serveur GLPI que expand=1 si on veut juste l'ID !
                const response = await apiClient.get(`${endpoint}?range=0-2000&expand=0`);
                
                let items = Array.isArray(response) 
                    ? response 
                    : (response?.data && Array.isArray(response.data)) 
                        ? response.data 
                        : response?.['hydra:member'] || [];
                
                if (items.length === 0) {
                    results.success.push(`${endpoint}: 0 élément`);
                    continue;
                }
                
                // Filtrer immédiatement les éléments protégés pour ne pas perdre de temps
                const itemsToDelete = items.filter(item => {
                    if (this.isProtectedItem(endpoint, item)) {
                        results.skipped.push(`${endpoint}/${item.id}`);
                        return false;
                    }
                    return true;
                });

                console.log(`[ResetData] 📊 ${itemsToDelete.length} élément(s) à purger en parallèle pour ${endpoint}`);
                
                let deletedCount = 0;
                // On sépare notre liste en paquets de 20 suppressions simultanées
                const batches = chunkArray(itemsToDelete, 20); 

                for (const batch of batches) {
                    // On prépare les promesses HTTP du paquet courant
                    const deletePromises = batch.map(async (item) => {
                        try {
                            await apiClient.delete(`${endpoint}/${item.id}?force_purge=1`);
                            deletedCount++;
                        } catch (deleteError) {
                            results.errors.push(`${endpoint}/${item.id}: ${deleteError.message}`);
                        }
                    });

                    // On déclenche le paquet complet en PARALLÈLE et on attend qu'il finisse
                    await Promise.all(deletePromises);
                }
                
                console.log(`[ResetData] 📊 ${endpoint}: ${deletedCount} élément(s) supprimé(s)`);
                results.success.push(`${endpoint}: ${deletedCount} élément(s)`);
                
            } catch (error) {
                console.error(`[ResetData] ❌ Erreur globale sur ${endpoint}:`, error.message);
                results.errors.push(`${endpoint}: ${error.message}`);
            }
        }
        
        console.log('\n🏁 RÉINITIALISATION TERMINÉE 🏁');
        return results;
    },


    /**
     * Vérifie si un endpoint est un référentiel à conserver
     * @param {string} endpoint - Nom de l'endpoint
     * @returns {boolean}
     */
    isReferentialEndpoint(endpoint) {
        const referentials = [
            'ComputerModel', 'PrinterModel', 'MonitorModel', 'NetworkEquipmentModel', 'PhoneModel', 'PeripheralModel',
            'Manufacturer', 'State', 'Location', 'Entity', 'Profile', 'User'
        ];
        return referentials.includes(endpoint);
    },
    
    /**
     * Vérifie si un élément est protégé (ne doit pas être supprimé)
     * @param {string} endpoint - Nom de l'endpoint
     * @param {object} item - L'élément à vérifier
     * @returns {boolean}
     */
    isProtectedItem(endpoint, item) {
        // Protection de l'entité racine
        if (endpoint === 'Entity' && (item.id === 0 || item.completename === 'Root entity')) {
            return true;
        }
        
        // Protection de l'utilisateur GLPI par défaut
        if (endpoint === 'User' && (item.name === 'glpi' || item.name === 'admin' || item.id === 1)) {
            return true;
        }
        
        // Protection du profil Super-Admin
        if (endpoint === 'Profile' && (item.name === 'Super-Admin' || item.id === 1)) {
            return true;
        }
        
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