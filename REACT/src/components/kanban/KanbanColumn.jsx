import { useNavigate } from 'react-router-dom';
import '../../assets/css/kanban/kanban.css'

export const KanbanColumn = ({ title, tickets, onTicketClick, status }) => {
    const navigate = useNavigate();
    const onAddTicket = () => {
        navigate('/frontoffice/create-ticket');
    }

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 kanban-column-wrapper">
            <div className="card kanban-column-card h-100 shadow-sm">
                {/* Header de la colonne avec compteur */}
                <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-2 py-3">
                    <h5 className="card-title mb-0 text-dark fw-bold">{title}</h5>
                    <span className="badge bg-primary rounded-pill px-2.5">{tickets.length}</span>
                </div>
                
                {/* Corps de la colonne (Scrollable si trop de tickets) */}
                <div className="card-body kanban-column-body overflow-auto p-2">
                    {tickets.length === 0 ? (
                        <div className="text-center text-muted my-4 font-italic small">Aucun ticket</div>
                    ) : (
                        tickets.map((ticket) => (
                            <div 
                                key={ticket.id} 
                                onClick={() => onTicketClick(ticket)} 
                                className="kanban-ticket-row d-flex align-items-center"
                            >
                                <span className="ticket-name-text text-truncate" title={ticket.name}>
                                    {ticket.name}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Bouton Ajouter un ticket - en dehors de la zone scrollable */}
                {status === 'Nouveau' && (
                    <div className="card-footer bg-white border-top-0 p-2">
                        <button 
                            className="add-ticket-in-column-btn"
                            onClick={onAddTicket}
                        >
                            Ajouter 1 ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};