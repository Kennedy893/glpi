import { getApiClient } from './ApiClientRepository';
import { ApiResponse } from '../models/utils/ApiResponse';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

export const UserRepository = {
    async getTechniciens() {
        // Profil technicien = id 4 en général — à adapter selon votre GLPI
        const response = await apiClient.get('User?range=0-100&searchText[profiles_id]=4');
        return Array.isArray(response) ? response : [];
    },
}