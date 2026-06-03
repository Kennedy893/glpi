import '../../assets/css/ticket/ticket-table.css'; // On met à jour le chemin du CSS si besoin
import { useDeleteTicket } from '../../hooks/ticket/useDeleteTicket';

export const TicketRow = ({ ticket, onDelete }) => {
  const { deleteTicket, loading } = useDeleteTicket();

  const handleSupprimer = async () => {
    if (window.confirm(`Supprimer le ticket #${ticket.id} ?`)) {
      const response = await deleteTicket(ticket.id);
      if (response.success && onDelete) {
        onDelete(ticket.id);
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <tr className="ticket-row">
      {/* ID en gras */}
      <td className="fw-bold text-secondary">#{ticket.id}</td>
      
      {/* Nom du ticket */}
      <td className="fw-semibold ticket-name">{ticket.name}</td>
      
      {/* Contenu tronqué avec gestion du texte de remplacement */}
      <td className="text-muted ticket-content">
        {ticket.content ? (
          <>
            {ticket.content.substring(0, 100)}
            {ticket.content.length > 100 && '...'}
          </>
        ) : (
          <span className="fst-italic text-light-muted">Pas de description</span>
        )}
      </td>
      
      {/* Badge de statut */}
      <td>
        <span className={`badge rounded-pill ${ticket.getStatusBadgeClass()}`}>
          {ticket.getStatusText()}
        </span>
      </td>
      
      {/* Date avec petite icône */}
      <td className="text-muted small">
        <i className="bi bi-calendar3 me-1"></i> {formatDate(ticket.date)}
      </td>

      <td>
        <button>Modifier</button>
        <button onClick={handleSupprimer}>Supprimer</button>
      </td>
    </tr>
  );
};