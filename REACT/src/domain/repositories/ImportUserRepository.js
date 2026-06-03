import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const ImportUserRepository = {
  // --- GESTION DES LOCALISATIONS ---
  async getOrCreateLocation(name) {
    console.log('[getOrCreateLocation] name =', name);

    if (!name || name.trim() === '') {
        console.log('[getOrCreateLocation] Pas de nom, retour null');
        return null;
    }

    try {
        // 1. Rechercher la localisation existante
        console.log('[getOrCreateLocation] Recherche localisation...');
        const response = await apiClient.get(`Location?searchText=${encodeURIComponent(name)}&expand=1`);
        
        console.log('[getOrCreateLocation] Résultat recherche =', response);

        // Vérifier si des résultats existent et faire une correspondance EXACTE
        if (response && Array.isArray(response) && response.length > 0) {
        // Chercher une correspondance exacte (pas seulement partielle)
        const exactMatch = response.find(location => location.name === name);
        
        if (exactMatch) {
            console.log('[getOrCreateLocation] Localisation trouvée (exacte), id =', exactMatch.id);
            return exactMatch.id;
        } else {
            console.log('[getOrCreateLocation] Pas de correspondance exacte trouvée parmi', response.length, 'résultats');
        }
        }

        // 2. Créer la localisation si non trouvée
        console.log('[getOrCreateLocation] Création localisation...');
        
        const createResponse = await apiClient.post('Location', {
        input: {
            name: name,
            is_recursive: 0,
            locations_id: 0,
            comment: 'Créé automatiquement depuis l\'import CSV'
        }
        });

        console.log('[getOrCreateLocation] Réponse création =', createResponse);

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
        console.log('[getOrCreateLocation] Localisation créée avec succès, id =', createdId);
        return createdId;
        } else {
        console.error('[getOrCreateLocation] Format de réponse inattendu:', createResponse);
        return null;
        }

    } catch (error) {
        console.error('[getOrCreateLocation] Erreur détaillée:', error);
        
        if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        }
        
        return null;
    }
  },

  // --- GESTION DES GROUPES ---
  async getOrCreateGroup(name) {
    console.log('[getOrCreateGroup] name =', name);

    // Si pas de nom, retourner 0 (pas de groupe)
    if (!name || name.trim() === '') {
        console.log('[getOrCreateGroup] Pas de nom, retour 0');
        return 0;
    }

    try {
        // 1. Rechercher le groupe avec searchText (standard GLPI)
        console.log('[getOrCreateGroup] Recherche groupe...');
        const response = await apiClient.get(`Group?searchText=${encodeURIComponent(name)}&expand=1`);

        console.log('[getOrCreateGroup] Résultat recherche =', response);

        // Vérifier si un groupe existe avec le nom EXACT
        if (response && Array.isArray(response) && response.length > 0) {
        // Chercher une correspondance exacte
        const exactMatch = response.find(group => group.name === name);
        
        if (exactMatch) {
            const groupId = exactMatch.id;
            console.log('[getOrCreateGroup] Groupe trouvé, id =', groupId);
            return groupId;
        }
        }

        // 2. Créer le groupe si non trouvé
        console.log('[getOrCreateGroup] Création du groupe...');
        
        const createResponse = await apiClient.post('Group', {
        input: {
            name: name,
            is_recursive: 0,
            is_active: 1
        }
        });

        console.log('[getOrCreateGroup] Réponse création =', createResponse);

        // Extraire l'ID créé (gérer différents formats de réponse)
        let createdId = null;
        if (createResponse && createResponse.id) {
        createdId = createResponse.id;
        } else if (createResponse && createResponse[0] && createResponse[0].id) {
        createdId = createResponse[0].id;
        } else if (createResponse && createResponse.data && createResponse.data.id) {
        createdId = createResponse.data.id;
        }

        if (createdId) {
        console.log('[getOrCreateGroup] Groupe créé avec succès, id =', createdId);
        return createdId;
        } else {
        console.error('Format de réponse inattendu pour la création du groupe:', createResponse);
        return 0;
        }

    } catch (error) {
        console.error('[getOrCreateGroup] Erreur:', error);
        
        if (error.response) {
        console.error('Détails erreur:', {
            status: error.response.status,
            data: error.response.data
        });
        }
        
        return 0; // Retourner 0 en cas d'erreur
    }
  },

  // --- RECHERCHE PROFIL ET ENTITÉ ---
  async getProfileIdByName(name) {
    console.log('[getProfileIdByName] name =', name);

    if (!name || name.trim() === '') return null;

    try {
        // 1. Rechercher le profil avec searchText (standard GLPI)
        console.log('[getProfileIdByName] Recherche profil...');
        const response = await apiClient.get(`Profile?searchText=${encodeURIComponent(name)}&expand=1`);

        console.log('[getProfileIdByName] Résultat recherche =', response);

        // Vérifier si un profil existe avec le nom EXACT
        if (response && Array.isArray(response) && response.length > 0) {
            // Chercher une correspondance exacte (pas seulement partielle)
            const exactMatch = response.find(profile => profile.name === name);
            
            if (exactMatch) {
                const profileId = exactMatch.id;
                console.log('[getProfileIdByName] Profil trouvé, id =', profileId);
                return profileId;
            }
        }

        // 2. Créer le profil si non trouvé
        console.log('[getProfileIdByName] Création du profil...');
        
        const createResponse = await apiClient.post('Profile', {
        input: {
            name: name,
            interface: 'central',
            is_default: 0,
            is_active: 1
        }
        });

        console.log('[getProfileIdByName] Réponse création =', createResponse);

        // Extraire l'ID créé
        let createdId = null;
        if (createResponse && createResponse.id) {
        createdId = createResponse.id;
        } else if (createResponse && createResponse[0] && createResponse[0].id) {
        createdId = createResponse[0].id;
        }

        if (createdId) {
        console.log('[getProfileIdByName] Profil créé avec succès, id =', createdId);
        return createdId;
        } else {
        console.error('Format de réponse inattendu pour la création du profil');
        return null;
        }

    } catch (error) {
        console.error('[getProfileIdByName] Erreur:', error);
        
        if (error.response) {
        console.error('Détails erreur:', {
            status: error.response.status,
            data: error.response.data
        });
        }
        
        return null;
    }
  },

  async getEntityIdByName(name) {
    console.log('[getEntityIdByName] name =', name);

    if (!name || name.trim() === '') {
        console.log('[getEntityIdByName] Pas de nom fourni, retour de l\'entité par défaut');
        return 0; // Entité racine par défaut
    }

    try {
        // 1. Rechercher l'entité existante
        console.log('[getEntityIdByName] Recherche entité...');
        const response = await apiClient.get(`Entity?searchText=${encodeURIComponent(name)}&expand=1`);

        console.log('[getEntityIdByName] Résultat recherche =', response);

        // Vérifier si une entité existe
        if (response && Array.isArray(response) && response.length > 0) {
            // const entityId = response[0].id;
            // console.log('[getEntityIdByName] Entité trouvée, id =', entityId);
            // return entityId;

            const exactMatch = response.find(entity => entity.name === name);
            
            if (exactMatch) {
                const entityId = exactMatch.id;
                console.log('[getEntityIdByName] Entité trouvé, id =', entityId);
                return entityId;
            }
        }

        // 2. Créer l'entité si non trouvée
        console.log('[getEntityIdByName] Création de l\'entité...');
        
        const createResponse = await apiClient.post('Entity', {
        input: {
            name: name,
            entities_id: 0,  // Entité parente (0 = racine)
            is_recursive: 0,
            completename: name
        }
        });

        console.log('[getEntityIdByName] Réponse création =', createResponse);

        // Extraire l'ID créé
        let createdId = null;
        if (createResponse && createResponse.id) {
        createdId = createResponse.id;
        } else if (createResponse && createResponse[0] && createResponse[0].id) {
        createdId = createResponse[0].id;
        }

        if (createdId) {
        console.log('[getEntityIdByName] Entité créée avec succès, id =', createdId);
        return createdId;
        } else {
        console.error('Format de réponse inattendu pour la création de l\'entité');
        return 0; // Retourner l'entité par défaut en cas d'erreur
        }

    } catch (error) {
        console.error('[getEntityIdByName] Erreur:', error);
        
        if (error.response) {
        console.error('Détails erreur:', {
            status: error.response.status,
            data: error.response.data
        });
        }
        
        return 0; // Retourner l'entité par défaut en cas d'erreur
    }
  },

  // --- CRÉATION UTILISATEUR ---
    async createUser(userData) {
    console.log('[createUser] userData =', userData);

    // 1. Validation des données obligatoires
    if (!userData.login || userData.login.trim() === '') {
        throw new Error('Le login est obligatoire');
    }

    if (!userData.pwd || userData.pwd.trim() === '') {
        throw new Error('Le mot de passe est obligatoire');
    }

    try {
        // 2. Vérifier si l'utilisateur existe déjà
        const existingUser = await this.findUserByLogin(userData.login);
        if (existingUser) {
        console.log('[createUser] Utilisateur déjà existant, ID =', existingUser.id);
        return existingUser.id;
        }

        // 3. Préparer le payload avec toutes les données nécessaires
        const payload = {
        input: {
            name: userData.login.toLowerCase().trim(),  // Login en minuscules
            firstname: userData.prenom || '',
            realname: userData.nom || '',
            password: userData.pwd,
            password2: userData.pwd,  // GLPI demande confirmation du mot de passe
            email: userData.email || '',
            locations_id: userData.locationId && !isNaN(userData.locationId) ? parseInt(userData.locationId) : 0,
            is_active: 1,  // Activer le compte
            is_deleted: 0,  // Non supprimé
            begin_date: null,
            end_date: null,
            language: 'fr_FR',  // Langue par défaut
        }
        };

        console.log('[createUser] Payload envoyé =', JSON.stringify(payload, null, 2));

        // 4. Envoyer la requête (sans slash devant User)
        const response = await apiClient.post('User', payload);

        console.log('[createUser] Réponse création utilisateur =', response);

        // 5. Extraire l'ID créé (gérer différents formats de réponse)
        let userId = null;
        if (response && response.id) {
        userId = response.id;
        } else if (response && response[0] && response[0].id) {
        userId = response[0].id;
        } else if (response && response.data && response.data.id) {
        userId = response.data.id;
        }

        if (!userId) {
        console.error('Format de réponse inattendu:', response);
        throw new Error('Impossible de récupérer l\'ID de l\'utilisateur créé');
        }

        console.log('[createUser] Utilisateur créé avec succès, ID =', userId);
        return userId;

    } catch (error) {
        console.error('[createUser] Erreur détaillée:', error);
        
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

    // Fonction utilitaire pour vérifier l'existence d'un utilisateur
    async findUserByLogin(login) {
    try {
        console.log('[findUserByLogin] Recherche utilisateur:', login);
        const response = await apiClient.get(`User?searchText=${encodeURIComponent(login)}&expand=1`);
        
        console.log('[findUserByLogin] Résultat:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
        // Vérifier si le login correspond exactement
        const foundUser = response.find(u => u.name === login);
        if (foundUser) {
            console.log('[findUserByLogin] Utilisateur trouvé:', foundUser);
            return foundUser;
        }
        }
        
        return null;
    } catch (error) {
        console.error('[findUserByLogin] Erreur:', error);
        return null;
    }
    },

  // --- LIENS (Profils / Groupes) ---
  async linkProfileToUser(userId, profileId, entityId) {
    console.log('[linkProfileToUser] userId =', userId);
    console.log('[linkProfileToUser] profileId =', profileId);
    console.log('[linkProfileToUser] entityId =', entityId);

    // Validation des paramètres
    if (!userId) {
        console.error('[linkProfileToUser] userId manquant');
        throw new Error('userId est requis');
    }
    
    if (!profileId) {
        console.error('[linkProfileToUser] profileId manquant');
        throw new Error('profileId est requis');
    }

    // S'assurer que entityId est un nombre valide
    const validEntityId = (entityId && typeof entityId === 'number' && entityId >= 0) ? entityId : 0;
    
    try {
        // Vérifier si la liaison existe déjà
        const existingLink = await this.checkProfileLinkExists(userId, profileId, validEntityId);
        if (existingLink) {
        console.log('[linkProfileToUser] Liaison déjà existante, ID =', existingLink);
        return existingLink;
        }

        // Préparer le payload (sans slash devant Profile_User)
        const payload = {
        input: {
            users_id: parseInt(userId),
            profiles_id: parseInt(profileId),
            entities_id: parseInt(validEntityId),
            is_recursive: 0,  // Ajouter ce champ (souvent requis)
            is_dynamic: 0     // 0 = manuel, 1 = dynamique
        }
        };

        console.log('[linkProfileToUser] Payload envoyé =', JSON.stringify(payload, null, 2));

        // Appel API (sans slash au début)
        const response = await apiClient.post('Profile_User', payload);

        console.log('[linkProfileToUser] Réponse =', response);

        // Extraire l'ID créé
        const linkId = response?.id || response?.data?.id || response?.[0]?.id;
        
        if (linkId) {
        console.log('[linkProfileToUser] Liaison créée avec succès, ID =', linkId);
        return linkId;
        } else {
        console.log('[linkProfileToUser] Liaison créée (sans ID retourné)');
        return true;
        }

    } catch (error) {
        console.error('[linkProfileToUser] Erreur détaillée:', error);
        
        if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        // Message d'erreur plus explicite
        if (error.response.data && error.response.data.message) {
            throw new Error(`GLPI: ${error.response.data.message}`);
        } else if (typeof error.response.data === 'string') {
            throw new Error(`GLPI: ${error.response.data}`);
        } else {
            throw new Error(`Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        }
        
        throw error;
    }
   },

    // Fonction utilitaire pour vérifier si la liaison existe déjà
   async checkProfileLinkExists(userId, profileId, entityId) {
    try {
        console.log('[checkProfileLinkExists] Vérification liaison existante...');
        
        const response = await apiClient.get(`Profile_User?searchText=${userId}&expand=1`);
        
        console.log('[checkProfileLinkExists] Résultat =', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
        const existingLink = response.find(link => 
            link.users_id === parseInt(userId) && 
            link.profiles_id === parseInt(profileId) &&
            link.entities_id === parseInt(entityId)
        );
        
        if (existingLink) {
            console.log('[checkProfileLinkExists] Liaison trouvée:', existingLink.id);
            return existingLink.id;
        }
        }
        
        return null;
    } catch (error) {
        console.error('[checkProfileLinkExists] Erreur:', error);
        return null;
    }
  },

  async linkGroupToUser(userId, groupId) {
    console.log('[linkGroupToUser] userId =', userId);
    console.log('[linkGroupToUser] groupId =', groupId);

    // Validation des paramètres
    if (!userId) {
        console.error('[linkGroupToUser] userId manquant');
        throw new Error('userId est requis');
    }

    if (!groupId) {
        console.log('[linkGroupToUser] Pas de groupId, liaison ignorée');
        return null;
    }

    try {
        // Vérifier si la liaison existe déjà
        const existingLink = await this.checkGroupLinkExists(userId, groupId);
        if (existingLink) {
        console.log('[linkGroupToUser] Liaison groupe déjà existante, ID =', existingLink);
        return existingLink;
        }

        // Préparer le payload (sans slash devant Group_User)
        const payload = {
        input: {
            users_id: parseInt(userId),
            groups_id: parseInt(groupId),
            is_dynamic: 0  // 0 = manuel, 1 = dynamique (ajouté par règles)
        }
        };

        console.log('[linkGroupToUser] Payload envoyé =', JSON.stringify(payload, null, 2));

        // Appel API (sans slash au début)
        const response = await apiClient.post('Group_User', payload);

        console.log('[linkGroupToUser] Réponse =', response);

        // Extraire l'ID créé
        const linkId = response?.id || response?.data?.id || response?.[0]?.id;
        
        if (linkId) {
        console.log('[linkGroupToUser] Liaison groupe créée avec succès, ID =', linkId);
        return linkId;
        } else {
        console.log('[linkGroupToUser] Liaison groupe créée (sans ID retourné)');
        return true;
        }

    } catch (error) {
        console.error('[linkGroupToUser] Erreur détaillée:', error);
        
        if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        
        // Message d'erreur plus explicite
        if (error.response.data && error.response.data.message) {
            throw new Error(`GLPI: ${error.response.data.message}`);
        } else if (typeof error.response.data === 'string') {
            throw new Error(`GLPI: ${error.response.data}`);
        } else {
            throw new Error(`Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        }
        }
        
        throw error;
    }
  },

  // Fonction utilitaire pour vérifier si la liaison groupe existe déjà
  async checkGroupLinkExists(userId, groupId) {
    try {
        console.log('[checkGroupLinkExists] Vérification liaison groupe existante...');
        
        const response = await apiClient.get(`Group_User?searchText=${encodeURIComponent(userId)}&expand=1`);
        
        console.log('[checkGroupLinkExists] Résultat =', response);
        
        if (response && Array.isArray(response) && response.length > 0) {
        const existingLink = response.find(link => 
            link.users_id === parseInt(userId) && 
            link.groups_id === parseInt(groupId)
        );
        
        if (existingLink) {
            console.log('[checkGroupLinkExists] Liaison groupe trouvée:', existingLink.id);
            return existingLink.id;
        }
        }
        
        return null;
    } catch (error) {
        console.error('[checkGroupLinkExists] Erreur:', error);
        return null;
    }
  }
};