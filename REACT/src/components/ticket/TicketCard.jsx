import '../../assets/css/ticket/ticket-card.css';

export const TicketCard = ({ ticket }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-0">
            #{ticket.id} - {ticket.name}
          </h5>
          <span className={`badge ${ticket.getStatusBadgeClass()}`}>
            {ticket.getStatusText()}
          </span>
        </div>
        
        <p className="card-text mt-2 text-muted">
          {ticket.content?.substring(0, 150)}
          {ticket.content?.length > 150 && '...'}
        </p>
        
        <div className="text-muted small">
          <i className="bi bi-calendar"></i> Créé le {formatDate(ticket.date)}
        </div>
      </div>
    </div>
  );
};