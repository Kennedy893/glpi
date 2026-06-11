import { useState, useEffect } from "react";
import { useKanbanSettings } from "../../hooks/kanban/useKanbanSettings";
import "../../assets/css/kanban/kanban-settings.css";

export const KanbanSettingsPage = () => {
    // États pour les champs de formulaire (valeurs actuelles)
    const [couleurNouveau, setCouleurNouveau] = useState('');
    const [tradNouveau, setTradNouveau] = useState('');
    const [couleurProgress, setCouleurProgress] = useState('');
    const [tradProgress, setTradProgress] = useState('');
    const [couleurTermine, setCouleurTermine] = useState('');
    const [tradTermine, setTradTermine] = useState('');

    const { settings, update, loading, error } = useKanbanSettings();
    const [successMessage, setSuccessMessage] = useState('');

    // Charger les valeurs actuelles quand settings est disponible
    useEffect(() => {
        if (settings && settings.columns) {
            const nouveau = settings.columns.find(col => col.statusId === 1);
            const progress = settings.columns.find(col => col.statusId === 2);
            const termine = settings.columns.find(col => col.statusId === 6);
            
            if (nouveau) {
                setCouleurNouveau(nouveau.color || '');
                setTradNouveau(nouveau.labelMg || nouveau.statusLabel || '');
            }
            if (progress) {
                setCouleurProgress(progress.color || '');
                setTradProgress(progress.labelMg || progress.statusLabel || '');
            }
            if (termine) {
                setCouleurTermine(termine.color || '');
                setTradTermine(termine.labelMg || termine.statusLabel || '');
            }
        }
    }, [settings]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        // Construire l'objet de mise à jour avec seulement les champs modifiés
        const updates = {};
        
        // Ajouter seulement les champs qui ont été modifiés
        if (couleurNouveau || tradNouveau) {
            updates.nouveau = {};
            if (couleurNouveau) updates.nouveau.couleur = couleurNouveau;
            if (tradNouveau) updates.nouveau.trad = tradNouveau;
        }
        
        if (couleurProgress || tradProgress) {
            updates.progress = {};
            if (couleurProgress) updates.progress.couleur = couleurProgress;
            if (tradProgress) updates.progress.trad = tradProgress;
        }
        
        if (couleurTermine || tradTermine) {
            updates.termine = {};
            if (couleurTermine) updates.termine.couleur = couleurTermine;
            if (tradTermine) updates.termine.trad = tradTermine;
        }

        // Vérifier si au moins un champ a été modifié
        if (Object.keys(updates).length === 0) {
            setSuccessMessage('Aucune modification à enregistrer.');
            return;
        }

        try {
            await update(updates);
            setSuccessMessage('Paramètres mis à jour avec succès.');
            
            // Optionnel : Ne pas vider les champs pour voir les nouvelles valeurs
            // Les useEffect va automatiquement mettre à jour les valeurs
        } catch (err) {
            console.error(err);
            setSuccessMessage('');
        }
    };

    // Annuler les modifications
    const handleReset = () => {
        if (settings && settings.columns) {
            const nouveau = settings.columns.find(col => col.statusId === 1);
            const progress = settings.columns.find(col => col.statusId === 2);
            const termine = settings.columns.find(col => col.statusId === 6);
            
            if (nouveau) {
                setCouleurNouveau(nouveau.color || '');
                setTradNouveau(nouveau.labelMg || nouveau.statusLabel || '');
            }
            if (progress) {
                setCouleurProgress(progress.color || '');
                setTradProgress(progress.labelMg || progress.statusLabel || '');
            }
            if (termine) {
                setCouleurTermine(termine.color || '');
                setTradTermine(termine.labelMg || termine.statusLabel || '');
            }
        }
        setSuccessMessage('');
    };

    if (loading && !settings) {
        return (
            <div className="kanban-settings-container">
                <div className="loading-message">Chargement des paramètres...</div>
            </div>
        );
    }

    return (
        <div className="kanban-settings-container">
            <form onSubmit={handleUpdate} className="settings-form">
                <div className="message-container">
                    {successMessage && (
                        <div className="success-message">
                            ✅ {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}
                </div>

                <div className="settings-grid">
                    <div className="status-card">
                        <h3>New</h3>
                        <div className="form-group">
                            <label>Couleur</label>
                            <input 
                                type="color" 
                                className="form-control color-input"
                                value={couleurNouveau} 
                                onChange={(e) => setCouleurNouveau(e.target.value)}
                            />
                            <small className="color-preview" style={{ backgroundColor: couleurNouveau || '#e5484d' }}>
                                Aperçu
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Traduction Malagasy</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: Vaovao"
                                value={tradNouveau} 
                                onChange={(e) => setTradNouveau(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="status-card">
                        <h3>In progress</h3>
                        <div className="form-group">
                            <label>Couleur</label>
                            <input 
                                type="color" 
                                className="form-control color-input"
                                value={couleurProgress} 
                                onChange={e => setCouleurProgress(e.target.value)}
                            />
                            <small className="color-preview" style={{ backgroundColor: couleurProgress || '#3e63dd' }}>
                                Aperçu
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Traduction Malagasy</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: Vao manao"
                                value={tradProgress} 
                                onChange={e => setTradProgress(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="status-card">
                        <h3>Closed</h3>
                        <div className="form-group">
                            <label>Couleur</label>
                            <input 
                                type="color" 
                                className="form-control color-input"
                                value={couleurTermine} 
                                onChange={e => setCouleurTermine(e.target.value)}
                            />
                            <small className="color-preview" style={{ backgroundColor: couleurTermine || '#30a46c' }}>
                                Aperçu
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Traduction Malagasy</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: Vita"
                                value={tradTermine} 
                                onChange={e => setTradTermine(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="submit-section">
                    <button 
                        type="button" 
                        className="reset-button"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                    <button 
                        type="submit" 
                        className={`submit-button ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Mise à jour...' : 'Confirmer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
};