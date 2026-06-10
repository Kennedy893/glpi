import { useState } from "react";
import { useKanbanSettings } from "../../hooks/kanban/useKanbanSettings";
import "../../assets/css/kanban/kanban-settings.css";

export const KanbanSettingsPage = () => {
    const [couleurNouveau, setCouleurNouveau] = useState('');
    const [tradNouveau, setTradNouveau] = useState('');
    const [couleurProgress, setCouleurProgress] = useState('');
    const [tradProgress, setTradProgress] = useState('');
    const [couleurTermine, setCouleurTermine] = useState('');
    const [tradTermine, setTradTermine] = useState('');

    const {settings, update, loading, error} = useKanbanSettings();
    const [successMessage, setSuccessMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        try {
            await update(
                couleurNouveau,
                tradNouveau,
                couleurProgress,
                tradProgress,
                couleurTermine,
                tradTermine
            );

            setSuccessMessage('Paramètres mis à jour avec succès.');
            setCouleurNouveau('');
            setTradNouveau('');
            setCouleurProgress('');
            setTradProgress('');
            setCouleurTermine('');
            setTradTermine('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="kanban-settings-container">
            <form onSubmit={handleUpdate} className="settings-form">
                <div className="message-container">
                    {loading && (
                        <div className="loading-message">
                            Chargement des paramètres...
                        </div>
                    )}

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
                        <h3>Nouveau</h3>
                        <div className="form-group">
                            <label>Couleur</label>
                            <input 
                                type="text" 
                                className="form-control color-input"
                                placeholder="#RRGGBB ou nom de couleur"
                                value={couleurNouveau} 
                                onChange={(e) => setCouleurNouveau(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Traduction</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: À faire"
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
                                type="text" 
                                className="form-control color-input"
                                placeholder="#RRGGBB ou nom de couleur"
                                value={couleurProgress} 
                                onChange={e => setCouleurProgress(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Traduction</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: En cours"
                                value={tradProgress} 
                                onChange={e => setTradProgress(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="status-card">
                        <h3>Terminé</h3>
                        <div className="form-group">
                            <label>Couleur</label>
                            <input 
                                type="text" 
                                className="form-control color-input"
                                placeholder="#RRGGBB ou nom de couleur"
                                value={couleurTermine} 
                                onChange={e => setCouleurTermine(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Traduction</label>
                            <input 
                                type="text" 
                                className="form-control"
                                placeholder="Ex: Fini"
                                value={tradTermine} 
                                onChange={e => setTradTermine(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="submit-section">
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