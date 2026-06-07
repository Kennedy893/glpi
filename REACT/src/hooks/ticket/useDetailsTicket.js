import { useEffect, useState } from "react"
import { Item_TicketRepository } from "../../domain/repositories/Item_TicketRepository";

export const useDetailsTicket = (ticketId) => {
    const [assets, setAssets] = useState([]); // Changement: tableau au lieu d'une string
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!ticketId) return;
            
            try {
                setLoading(true);
                const assetsList = await Item_TicketRepository.getDetailsItem(ticketId);
                setAssets(assetsList); // Stocker tous les assets
                setError(null);
            } catch (error) {
                setError(error.message);
                setAssets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [ticketId]);

    return { assets, error, loading }; // Retourner assets au lieu de nomItem
};