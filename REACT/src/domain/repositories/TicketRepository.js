import { getApiClient } from './ApiClientRepository';
import { Ticket } from '../models/Ticket';
import { ApiResponse } from '../models/utils/ApiResponse';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

// Repository pour les opérations liées aux tickets
export const TicketRepository = {

  // Récupérer tous les tickets
  async getAllTickets(limit = 50, expand = true) {
    try {
      const endpoint = expand ? `Ticket?expand=1&limit=${limit}` : `Ticket?limit=${limit}`;
      const data = await apiClient.get(endpoint);
      
      // Transformation des données API en modèles Ticket
      const tickets = Array.isArray(data) 
        ? data.map(ticketData => Ticket.fromApi(ticketData))
        : [];
      
      return ApiResponse.success(tickets);
    } catch (error) {
      console.error('Erreur getAllTickets:', error);
      return ApiResponse.error(error.message);
    }
  },

  // Récupérer un ticket spécifique
  async getTicketById(id) {
    try {
      const data = await this.apiClient.get(`Ticket/${id}?expand=1`);
      const ticket = Ticket.fromApi(data);
      return ApiResponse.success(ticket);
    } catch (error) {
      console.error(`Erreur getTicketById ${id}:`, error);
      return ApiResponse.error(error.message);
    }
  },

  // Créer un nouveau ticket
  async createTicket(ticketData) {
    try {
      const data = await this.apiClient.post('Ticket', {
        // input: [{
        //   name: ticketData.name,
        //   content: ticketData.content,
        //   status: ticketData.status || 1
        // }]
        input: [{
          ticketData
        }]
      });
      return ApiResponse.success(data);
    } catch (error) {
      console.error('Erreur createTicket:', error);
      return ApiResponse.error(error.message);
    }
  },

  // Supprimer un ticket
  async supprimerTicket(id) {
    try {
      // L'API GLPI pour la suppression ne nécessite pas le paramètre expand
      const data = await this.apiClient.delete(`Ticket/${id}`);
      
      // Retourner une réponse de succès avec les données de l'API
      return ApiResponse.success({
        message: `Ticket ${id} supprimé avec succès`,
        deleted: true,
        id: id,
        response: data
      });
    } catch (error) {
      console.error(`Erreur deleteTicket ${id}:`, error);
      return ApiResponse.error(`Impossible de supprimer le ticket ${id}: ${error.message}`);
    }
  },

  // Supprimer plusieurs tickets à la fois
  async supprimerMultipleTickets(ids) {
    try {
      // GLPI accepte les IDs séparés par des virgules
      const idsString = ids.join(',');
      const data = await this.apiClient.delete(`Ticket/${idsString}`);
      
      return ApiResponse.success({
        message: `${ids.length} ticket(s) supprimé(s) avec succès`,
        deleted: true,
        ids: ids,
        response: data
      });
    } catch (error) {
      console.error('Erreur deleteMultipleTickets:', error);
      return ApiResponse.error(`Impossible de supprimer les tickets: ${error.message}`);
    }
  },

  // Modifier un Ticket
  async modifierTicket(id, ticketData) {
    try {
        const updateData = {
            input: {}
        };

        // Ajouter uniquement les champs fournis
        if (ticketData.name !== undefined) {
            updateData.input.name = ticketData.name;
        }
        if (ticketData.content !== undefined) {
            updateData.input.content = ticketData.content;
        }
        if (ticketData.status !== undefined) {
            updateData.input.status = ticketData.status;
        }
        if (ticketData.priority !== undefined) {
            updateData.input.priority = ticketData.priority;
        }
        if (ticketData.type !== undefined) {
            updateData.input.type = ticketData.type;
        }

        // Vérifier qu'au moins un champ est à modifier
        if (Object.keys(updateData.input).length === 0) {
            return ApiResponse.error('Aucune donnée à modifier');
        }

        // Utilisation de PUT ou PATCH pour la modification
        const data = await this.apiClient.put(`Ticket/${id}`, updateData);

        return ApiResponse.success({
            message: `Ticket ${id} modifié avec succès`,
            updated: true,
            id: id,
            response: data
        });
    } catch (error) {
        console.error(`Erreur modifierTicket ${id}:`, error);
        return ApiResponse.error(`Impossible de modifier le ticket ${id}: ${error.message}`);
    }
  },

  // Recuperer les tickets selon par status
  async getTicketsByStatus(status) {
    try {
        // On récupère tout le catalogue de tickets d'un coup
        const response = await apiClient.get('Ticket?range=0-2000');
        
        let allTickets = Array.isArray(response) 
            ? response 
            : response?.data || response?.['hydra:member'] || [];

        // 💡 C'est JavaScript qui applique le filtre sur le statut reçu !
        // Attention : GLPI renvoie parfois le statut sous forme de string ou number, on compare avec ==
        const filteredTickets = allTickets.filter(ticket => ticket.status == status);

        console.log(`[getTicketsByStatus] ${filteredTickets.length} ticket(s) filtré(s) pour le statut ${status}`);
        return filteredTickets;

    } catch (error) {
        console.error('[getTicketsByStatus] Erreur:', error);
        return [];
    }
  },

  async updateTicket(ticketId, data) {
    const response = await apiClient.put(`Ticket/${ticketId}`, { input: data });
    return response?.id ?? null;
  },

  async createSolution(data) {
    const response = await apiClient.post('ITILSolution', { input: data });
    return response?.id ?? null;
  },

  async createCause(data) {
    const response = await apiClient.post('ITILFollowup', { input: data });
    return response?.id ?? null;
  },

  async addUserToTicket(ticketId, userId, type = 2) {
    // type : 1 = demandeur (requester), 2 = technicien assigné (assigned), 3 = observateur (observer)
    const data = {
      tickets_id: ticketId,
      users_id: userId,
      type: type
    };
    
    const response = await apiClient.post('Ticket_User', { input: data });
    return response?.id ?? null;
  },
}