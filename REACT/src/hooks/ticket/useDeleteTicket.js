import { useState, useEffect, useCallback } from 'react';
import { TicketRepository } from '../../domain/repositories/TicketRepository';

export const useDeleteTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [repository] = useState(() => new TicketRepository());

    const deleteTicket = async (ticketId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await TicketRepository.supprimerTicket(ticketId);
            if (!response.success) {
                setError(response.error);
            }
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteTicket,
        loading,
        error
    };
}