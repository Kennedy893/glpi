import { getApiClient } from './ApiClientRepository';
import { Ticket } from '../models/Ticket';
import { ApiResponse } from '../models/ApiResponse';

// Repository pour les opérations liées aux tickets
export class TicketRepository {
  constructor() {
    this.apiClient = getApiClient();
  }

  // Récupérer tous les tickets
  async getAllTickets(limit = 50, expand = true) {
    try {
      const endpoint = expand ? `Ticket?expand=1&limit=${limit}` : `Ticket?limit=${limit}`;
      const data = await this.apiClient.get(endpoint);
      
      // Transformation des données API en modèles Ticket
      const tickets = Array.isArray(data) 
        ? data.map(ticketData => Ticket.fromApi(ticketData))
        : [];
      
      return ApiResponse.success(tickets);
    } catch (error) {
      console.error('Erreur getAllTickets:', error);
      return ApiResponse.error(error.message);
    }
  }

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
  }

  // Créer un nouveau ticket
  async createTicket(ticketData) {
    try {
      const data = await this.apiClient.post('Ticket', {
        input: {
          name: ticketData.name,
          content: ticketData.content,
          status: ticketData.status || 1
        }
      });
      return ApiResponse.success(data);
    } catch (error) {
      console.error('Erreur createTicket:', error);
      return ApiResponse.error(error.message);
    }
  }
}