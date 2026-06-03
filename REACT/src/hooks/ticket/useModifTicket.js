import { useState, useEffect, useCallback } from 'react';
import { TicketRepository } from "../../domain/repositories/TicketRepository";

export const useModifTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [repository] = useState(() => new TicketRepository);

    const modifTicket = async (id, ticketData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await repository.modifierTicket(id, ticketData);
            if (!response.success) {
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
        modifTicket,
        loading,
        error
    };
}