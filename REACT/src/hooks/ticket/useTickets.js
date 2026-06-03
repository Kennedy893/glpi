import { useState, useEffect, useCallback } from 'react';
import { TicketRepository } from '../../domain/repositories/TicketRepository';

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [repository] = useState(() => new TicketRepository());

  // Fonction pour charger les tickets
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await repository.getAllTickets();
    
    if (response.success) {
      setTickets(response.data);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  }, [repository]);

  // Chargement automatique au montage du composant
  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  // Rafraîchir manuellement
  const refresh = () => {
    loadTickets();
  };

  return {
    tickets,
    loading,
    error,
    refresh
  };
};