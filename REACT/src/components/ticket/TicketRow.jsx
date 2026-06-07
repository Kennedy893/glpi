import '../../assets/css/ticket/ticket-table.css'; // On met à jour le chemin du CSS si besoin
import { useDeleteTicket } from '../../hooks/ticket/useDeleteTicket';
import { useNavigate } from 'react-router-dom';
import { useGetTicket } from '../../hooks/ticket/useGetTicket';
import { useState } from 'react';
import { TicketDetailsModal } from './TicketDetailsModal';

export const TicketRow = ({ ticket, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const { deleteTicket, loading } = useDeleteTicket();
  const { getTicket } = useGetTicket(ticket.id);
  const navigate = useNavigate();

  const handleRowClick = (e) => {
    // Éviter d'ouvrir le modal si on clique sur les boutons d'action
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    setShowModal(true);
  };

  const handleSupprimer = async () => {
    if (window.confirm(`Supprimer le ticket #${ticket.id} ?`)) {
      const response = await deleteTicket(ticket.id);
      if (response.success && onDelete) {
        onDelete(ticket.id);
      }
    }
  }

  const handleGetTicket = async () => {
    // const response = await getTicket(ticket.id);

    // Redirection vers la page d'édition avec l'ID du ticket
    navigate(`/tickets/${ticket.id}/edit`);
  }

  // const formatDate = (dateString) => {
  //   if (!dateString) return 'Date inconnue';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR');
  // };

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

  return (
    <>
      <tr className="ticket-row" onClick={handleRowClick} style={{ cursor: 'pointer' }}>
        {/* ID en gras */}
        <td className="fw-bold text-secondary">#{ticket.id}</td>
        
        {/* Nom du ticket */}
        <td className="fw-semibold ticket-name">{ticket.name}</td>

        {/* Type */}
        <td className="fw-semibold ticket-name">{ticket.getTypeText()}</td>
        
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
          {/* <button onClick={handleGetTicket}>Modifier</button> */}
          <button onClick={handleSupprimer}>Supprimer</button>
        </td>
      </tr>

      {showModal && (
        <TicketDetailsModal
          ticket={ticket} 
          onClose={() => setShowModal(false)}
          formatDate={formatDate}
        />
      )}
    </>
  );
};