import { useState } from "react";
import { usePresentation } from "../../hooks/ticket/usePresentation";
import { KanbanColumn } from "../../components/kanban/KanbanColumn";
// import { TicketDetailsModal } from "./components/TicketDetailsModal";
import '../../assets/css/kanban/kanban.css';

export const KanbanPage = () => {
    const { ticketsStatusMap, loading, error } = usePresentation();
    const [selectedTicket, setSelectedTicket] = useState(null);

    if (loading) return <div className="text-center my-5"><div className="spinner-border"></div></div>;
    if (error) return <div className="alert alert-danger m-3">{error}</div>;

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 text-secondary border-bottom pb-2">Tableau Kanban des Tickets</h2>
            
            {/* Layout Horizontal du Kanban */}
            <div className="row flex-nowrap overflow-auto pb-3" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {ticketsStatusMap.map((group) => (
                    <KanbanColumn 
                        key={group.statusId} 
                        title={group.statusLabel} 
                        tickets={group.tickets} 
                        onTicketClick={(ticket) => setSelectedTicket(ticket)}
                    />
                ))}
            </div>

            {/* Modal d'historique et de détails au clic */}
            {/* {selectedTicket && (
                <TicketDetailsModal 
                    ticket={selectedTicket} 
                    onClose={() => setSelectedTicket(null)} 
                />
            )} */}
        </div>
    );
};