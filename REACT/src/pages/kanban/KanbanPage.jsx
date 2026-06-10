// KanbanPage.js
import { useState } from "react";
import { usePresentation } from "../../hooks/ticket/usePresentation";
import { KanbanColumn } from "../../components/kanban/KanbanColumn";
import { TicketDetailsModal } from "../../components/ticket/TicketDetailsModal";
import { Ticket } from "../../domain/models/Ticket"; // Importez votre classe Ticket
import '../../assets/css/kanban/kanban.css';
import { useKanban }          from "../../hooks/ticket/useKanban";
import { StatusDialog } from "../../components/kanban/StatusDialog";

export const KanbanPage = () => {
    // const { ticketsStatusMap, loading, error, addNewTicket } = usePresentation();
    const { ticketsStatusMap, loading, error, setTicketsStatusMap } = usePresentation();
    const [selectedTicket, setSelectedTicket] = useState(null);

    // hook kanban — drag + dialogue
    const {
        draggedId,
        onDragStart,
        onDrop,
        dialog,
        closeDialog,
        confirmDialog,
    } = useKanban(ticketsStatusMap, setTicketsStatusMap);

    const handleTicketClick = (ticketData) => {
        // Convertir l'objet brut en instance de Ticket
        const ticketInstance = Ticket.fromApi(ticketData);
        setSelectedTicket(ticketInstance);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Date invalide';
        
        return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
        });
    };

    const handleAddTicket = (status) => {
        console.log("Ajouter un ticket dans la colonne:", status);
    };

    if (loading) return <div className="text-center my-5"><div className="spinner-border"></div></div>;
    if (error) return <div className="alert alert-danger m-3">{error}</div>;

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 text-secondary border-bottom pb-2">Tableau Kanban des Tickets</h2>
            
            <div className="row flex-nowrap overflow-auto pb-3" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {ticketsStatusMap.map((group) => (
                    <KanbanColumn 
                        key={group.statusId} 
                        title={group.statusLabel} 
                        tickets={group.tickets}
                        status={group.statusLabel}
                        onTicketClick={handleTicketClick}  // Utilisez la fonction de conversion
                        onAddTicket={() => handleAddTicket(group.statusLabel)}
                        onDragStart={onDragStart}         // nouveau
                        onDrop={onDrop}                   // nouveau
                        draggedId={draggedId}             // nouveau
                    />
                ))}
            </div>

            {/* Modal avec l'instance de Ticket */}
            {selectedTicket && (
                <TicketDetailsModal 
                    ticket={selectedTicket}  // Maintenant c'est une instance de Ticket
                    onClose={() => setSelectedTicket(null)} 
                    formatDate={formatDate}
                />
            )}

            {/* Dialogue changement de statut */}
            {dialog.open && (
                <StatusDialog
                dialog={dialog}
                onConfirm={confirmDialog}
                onCancel={closeDialog}
                />
            )}
        </div>
    );
};