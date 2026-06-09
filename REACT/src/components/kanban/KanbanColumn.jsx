import { useNavigate } from 'react-router-dom';
import '../../assets/css/kanban/kanban.css'

export const KanbanColumn = ({ title, tickets, onTicketClick, status }) => {
    const navigate = useNavigate();

    const onAddTicket = () => {
        navigate('/frontoffice/create-ticket');
    };

    const handleDragStart = (e, ticket) => {
        // Stocker les données du ticket dans le drag event
        e.dataTransfer.setData('application/json', JSON.stringify({
            ticket: ticket,
            sourceStatus: status
        }));
        e.dataTransfer.effectAllowed = 'move';
        
        // Ajouter une classe pour le style pendant le drag
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        // Enlever la classe de style
        e.target.classList.remove('dragging');
    };

    const handleDragOver = (e) => {
        // Permettre le drop
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Ajouter un effet visuel sur la colonne
        const column = e.currentTarget;
        column.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        // Enlever l'effet visuel
        const column = e.currentTarget;
        column.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        // Empêcher le comportement par défaut
        e.preventDefault();
        
        // Enlever l'effet visuel
        const column = e.currentTarget;
        column.classList.remove('drag-over');
        
        // Récupérer les données du ticket
        const dragData = e.dataTransfer.getData('application/json');
        if (!dragData) return;
        
        const { ticket, sourceStatus } = JSON.parse(dragData);
        
        // Ne rien faire si le ticket est déposé dans la même colonne
        if (sourceStatus === status) return;
        
        // Appeler la fonction de callback avec les informations
        onTicketDrop(ticket, sourceStatus, status);
    };

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
                                draggable="true"
                                onDragStart={(e) => handleDragStart(e, ticket)}
                                onDragEnd={handleDragEnd}
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