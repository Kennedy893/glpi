import { TicketRow } from './TicketRow';

export const TicketList = ({ tickets, onRefresh }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12v8H4v-8M12 2v10m0 0l-3-3m3 3l3-3" strokeLinecap="round"/>
            <rect x="2" y="12" width="20" height="2" rx="1"/>
          </svg>
        </div>
        <h3 className="empty-state-title">Aucun ticket trouvé</h3>
        <p className="empty-state-description">Il n'y a actuellement aucun ticket dans la liste.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <div className="header-left">
          <h3 className="table-title">Tickets</h3>
          <span className="ticket-count-badge">{tickets.length}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="ticket-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-name">Nom</th>
              <th className="col-type">Type</th>
              <th className="col-description">Description</th>
              <th className="col-status">Statut</th>
              <th className="col-date">Date de création</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <TicketRow key={ticket.id} ticket={ticket} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};