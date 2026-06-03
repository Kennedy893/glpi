import { TicketRow } from './TicketRow';

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
    <div className="ticket-list-container container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="table-title">Liste des tickets ({tickets.length})</h3>
      </div>

      {/* Conteneur responsive pour éviter que le tableau déborde sur mobile */}
      <div className="table-responsive custom-table-shadow">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-custom-header">
            <tr>
              <th scope="col" style={{ width: '8%' }}>ID</th>
              <th scope="col" style={{ width: '15%' }}>Nom</th>
              <th scope="col" style={{ width: '30%' }}>Description</th>
              <th scope="col" style={{ width: '12%' }}>Statut</th>
              <th scope="col" style={{ width: '15%' }}>Date de création</th>
              <th scope="col" style={{ width: '30%' }}>Actions</th>
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