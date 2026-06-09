import { useEffect, useState } from "react";
import { TicketRepository } from "../../domain/repositories/TicketRepository";

// Configuration des statuts GLPI avec leurs IDs officiels
const GLPI_STATUS_CONFIG = [
    { id: 1, label: 'Nouveau' },
    { id: 2, label: 'In progress' },
    { id: 5, label: 'Terminé' }, // Ou 6 pour Clos, selon tes besoins
];

export const usePresentation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Initialisation du state avec un tableau vide pour accueillir nos groupes
    const [ticketsStatusMap, setTicketsStatusMap] = useState([]);

    useEffect(() => {
        const fetchAllTicketsGrouped = async () => {
            setLoading(true);
            setError('');

            try {
                // 🚀 Parallélisation des appels API pour chaque statut configuré
                const promises = GLPI_STATUS_CONFIG.map(async (statusObj) => {
                    const tickets = await TicketRepository.getTicketsByStatus(statusObj.id);
                    return {
                        statusId: statusObj.id,
                        statusLabel: statusObj.label,
                        tickets: tickets // Le tableau de tickets renvoyé par ton repository,
                    };
                });

                // On attend que toutes les requêtes API soient terminées
                const groupedResults = await Promise.all(promises);
                
                // Mise à jour de l'état React
                setTicketsStatusMap(groupedResults);

            } catch (err) {
                console.error('[usePresentation] Erreur globale:', err);
                setError('Impossible de charger les données des tickets.');
            } finally {
                setLoading(false);
            }
        };

        fetchAllTicketsGrouped();
    }, []);

    // Update ticket lors du dragging
    const updateTicketStatus = async (ticketId, newStatusId, additionalInfo = null) => {
        try {
            // Appel API pour mettre à jour le statut
            const response = await fetch(`/api/tickets/${ticketId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status_id: newStatusId,
                    additional_info: additionalInfo
                })
            });
            
            if (!response.ok) throw new Error('Erreur lors de la mise à jour');
            
            // Rafraîchir les données
            await fetchTickets();
            
        } catch (err) {
            setError(err.message);
        }
    };

    // 💡 Ne pas oublier de retourner les états et données pour les utiliser dans ton composant UI
    return {
        ticketsStatusMap,
        loading,
        error,
        updateTicketStatus
    };
};