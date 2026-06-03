import { TicketCard } from './TicketCard';

export const TicketList = ({ tickets, onRefresh }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="alert alert-info text-center">
        <p>Aucun ticket trouvé.</p>
        <button className="btn btn-primary btn-sm" onClick={onRefresh}>
          Rafraîchir
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Liste des tickets ({tickets.length})</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={onRefresh}>
          🔄 Rafraîchir
        </button>
      </div>
      <div className="row">
        {tickets.map(ticket => (
          <div key={ticket.id} className="col-md-6 col-lg-4 mb-3">
            <TicketCard ticket={ticket} />
          </div>
        ))}
      </div>
    </div>
  );
};