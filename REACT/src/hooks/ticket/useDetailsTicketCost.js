import { useEffect, useState } from "react"
import { Item_TicketRepository } from "../../domain/repositories/Item_TicketRepository";
import { TicketCostRepository } from "../../domain/repositories/TicketCostRepository";

export const useDetailsTicketCost = (ticketId) => {
    const [costs, setCosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!ticketId) return;
            
            try {
                setLoading(true);
                const costsList = await TicketCostRepository.getCostTicket(ticketId);
                setCosts(costsList); // Stocker tous les costs
                setError(null);
            } catch (error) {
                setError(error.message);
                setCosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [ticketId]);

    return { costs, error, loading }; // Retourner costs au lieu de nomItem
};