import { useState } from 'react';
import '../../assets/css/kanban/kanban.css';

export const ConfirmationDialog = ({ ticket, targetStatus, onConfirm, onCancel }) => {
    const [comment, setComment] = useState('');
    const [resolution, setResolution] = useState('');

    const handleSubmit = () => {
        onConfirm({
            comment: comment,
            resolution: resolution,
            date: new Date().toISOString()
        });
    };

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <div className="confirmation-dialog-header">
                    <h4>Changement de statut</h4>
                </div>
                <div className="confirmation-dialog-body">
                    <p>
                        Vous êtes sur le point de changer le statut du ticket 
                        <strong> "{ticket.name}" </strong> 
                        vers <strong>{targetStatus}</strong>.
                    </p>
                    
                    {targetStatus === 'Résolu' && (
                        <>
                            <div className="form-group">
                                <label>Commentaire de résolution :</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Décrivez comment le ticket a été résolu..."
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Solution apportée :</label>
                                <input
                                    type="text"
                                    value={resolution}
                                    onChange={(e) => setResolution(e.target.value)}
                                    placeholder="Solution mise en place"
                                />
                            </div>
                        </>
                    )}
                </div>
                <div className="confirmation-dialog-footer">
                    <button className="btn-cancel" onClick={onCancel}>
                        Annuler
                    </button>
                    <button className="btn-confirm" onClick={handleSubmit}>
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};