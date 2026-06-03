import { useTickets } from '../../hooks/ticket/useTickets';
import { TicketList } from '../../components/ticket/TicketList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const TicketsPage = () => {
  const { tickets, loading, error, refresh } = useTickets();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="mb-4">
            <h1>📋 Gestion des Tickets GLPI</h1>
            <p className="text-muted">
              Liste des tickets depuis votre instance GLPI
            </p>
            <hr />
          </div>
          
          <TicketList tickets={tickets} onRefresh={refresh} />
        </div>
      </div>
    </div>
  );
};