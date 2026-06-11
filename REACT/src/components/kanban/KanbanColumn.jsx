import { useNavigate } from 'react-router-dom';
import '../../assets/css/kanban/kanban.css'
import { useState } from 'react';

export const KanbanColumn = ({ title, tickets, onTicketClick, status, onDrop, onDragStart, draggedId }) => {
    const navigate = useNavigate();

    const [isDragOver, setIsDragOver] = useState(false);

    const onAddTicket = () => {
        navigate('/frontoffice/create-ticket');
    };

    return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 kanban-column-wrapper">
      <div className={`card kanban-column-card h-100 shadow-sm ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { 
          e.preventDefault(); // ← sans ça, onDrop ne se déclenche jamais
          setIsDragOver(true);  // ← effet visuel sur la colonne
        }}
        onDragLeave={() => 
          setIsDragOver(false)
        }
        onDrop={(e) => { 
          setIsDragOver(false); 
          onDrop(e, status); // ← déclenché quand l'utilisateur lâche
        }} // zone de drop
      >

        {/* Header de la colonne avec compteur */}
        <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-2 py-3">
            <h5 className="card-title mb-0 text-dark fw-bold">{title}</h5><br />
            <span className="badge bg-primary rounded-pill px-2.5">{tickets.length}</span>
        </div>

        <div className="card-body kanban-column-body overflow-auto p-2">
          {tickets.length === 0 ? (
            <div className="text-center text-muted my-4 small">Aucun ticket</div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                draggable                                              
                onDragStart={(e) => {
                  e.dataTransfer.setData('ticketId', String(ticket.id)); // stocke l'id dans le "presse-papier du drag"
                  onDragStart(ticket.id); // notifie React pour griser la carte
                }}
                onClick={() => onTicketClick(ticket)}
                className={`kanban-ticket-row d-flex align-items-center ${draggedId === ticket.id ? 'dragging' : ''}`}
              >
                <span className="ticket-name-text text-truncate" title={ticket.name}>
                  {ticket.name}
                </span>
              </div>
            ))
          )}
        </div>

        {status === 'New' && (
          <div className="card-footer bg-white border-top-0 p-2">
            <button className="add-ticket-in-column-btn" onClick={onAddTicket}>
              Ajouter 1 ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
};