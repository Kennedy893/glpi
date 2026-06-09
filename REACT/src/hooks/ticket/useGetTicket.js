import { useState } from 'react';
import { TicketRepository } from '../../domain/repositories/TicketRepository';

export const useGetTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticket, setTicket] = useState(null);
  // const [repository] = useState(() => new TicketRepository());

  const getTicket = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await TicketRepository.getTicketById(id);
      
      if (response.success) {
        setTicket(response.data);
      } else {
        setError(response.error);
      }
      console.log(response);
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    getTicket,  
    ticket, 
    loading, 
    error 
  };
};