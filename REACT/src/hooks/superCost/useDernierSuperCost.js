import { useCallback, useEffect, useState } from "react"
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository";

export const useDernierSuperCost = (ticketId) => {
    const [superCosts, setSuperCosts] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Recupere les derniers couts pour un ticket
    const loadCosts = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const listSC = await SuperCostRepository.getSuperCostsByTicket(ticketId);
            setSuperCosts(listSC);
        } catch (err) {
            console.error(err);
            setError('Erreur chargement');
        } finally {
            setLoading(false);
        }
        
    }, []);

    useEffect(() => {
        loadCosts();
    }, [loadCosts]);

    return {
        superCosts,
        loading,
        error
    }
}

// REOUVERTURE =  superCost * 10 /100