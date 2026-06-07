import { useEffect, useState } from "react";
import { DashboardRepository } from "../../domain/repositories/DashboardRepository";

export const useTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [nbTicketIncident, setNbTicketIncident] = useState(0);
    const [nbTicketDemande, setNbTicketDemande] = useState(0);
    const [nbTotalTicket, setNbTotalTicket] = useState(0);

    useEffect(() => {

        const loadData = async () => {
            try {
                setLoading(true);

                const ticketIncident = await DashboardRepository.nbTicketParType(1);
                const ticketDemande = await DashboardRepository.nbTicketParType(2);

                setNbTicketIncident(ticketIncident);
                setNbTicketDemande(ticketDemande);

                setNbTotalTicket(ticketIncident + ticketDemande);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        nbTicketIncident,
        nbTicketDemande,
        nbTotalTicket,
        loading,
        error
    }

}