import { useEffect, useState } from 'react';
import '../../assets/css/ticket/ticket-details-modal.css';
import { useDetailsTicket } from '../../hooks/ticket/useDetailsTicket';

export const TicketDetailsModal = ({ ticket, onClose, formatDate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { assets, loading, error } = useDetailsTicket(ticket.id);

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10);
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleBackdropClick}>
      <div className={`modal-container ${isVisible ? 'visible' : ''}`}>
        <div className="modal-header">
          <h2 className="modal-title">
            Ticket #{ticket.id} - {ticket.name}
          </h2>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-section">
              <div className="detail-row">
                <span className="detail-label">ID :</span>
                <span className="detail-value">#{ticket.id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Nom :</span>
                <span className="detail-value">{ticket.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Type :</span>
                <span className="detail-value">
                  <span className="badge-type">{ticket.getTypeText()}</span>
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Statut :</span>
                <span className="detail-value">
                  <span className={`badge-status ${ticket.getStatusBadgeClass()}`}>
                    {ticket.getStatusText()}
                  </span>
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Date de création :</span>
                <span className="detail-value">{formatDate(ticket.date)}</span>
              </div>
            </div>

            {!loading && !error && assets.length > 0 && (
                <div className="assets-list">
                <span className="detail-label">Assets asscoiés :</span>
                {assets.map((asset, index) => (
                    <div key={index} className="asset-item">
                        <span className="asset-name">{asset.name}</span>
                    </div>
                ))}
                </div>
            )}

            <div className="detail-section full-width">
              <div className="detail-label">Description :</div>
              <div className="detail-description">
                {ticket.content || 'Aucune description fournie.'}
              </div>
            </div>

            <div className="detail-section full-width">
              <div className="detail-label">Informations complémentaires :</div>
              <div className="detail-info-grid">
                {ticket.priority && (
                  <div className="info-item">
                    <span className="info-label">Priorité :</span>
                    <span className="info-value">{ticket.priority}</span>
                  </div>
                )}
                {ticket.assigned_to && (
                  <div className="info-item">
                    <span className="info-label">Assigné à :</span>
                    <span className="info-value">{ticket.assigned_to}</span>
                  </div>
                )}
                {ticket.category && (
                  <div className="info-item">
                    <span className="info-label">Catégorie :</span>
                    <span className="info-value">{ticket.category}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Fermer
          </button>
          <button 
            className="btn-primary" 
            onClick={() => {
              handleClose();
              window.location.href = `/tickets/${ticket.id}/edit`;
            }}
          >
            Modifier le ticket
          </button>
        </div>
      </div>
    </div>
  );
};