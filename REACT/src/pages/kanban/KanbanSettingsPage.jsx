import { useState } from "react";
import { useKanbanSettings } from "../../hooks/kanban/useKanbanSettings";

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

            // Vider les champs
            setCouleurNouveau('');
            setTradNouveau('');

            setCouleurProgress('');
            setTradProgress('');

            setCouleurTermine('');
            setTradTermine('');
        } catch (err) {
            // L'erreur est déjà gérée par le hook
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleUpdate}>
                <div>
                    {loading && <p>Chargement...</p>}

                    {successMessage && (
                        <p style={{ color: "green" }}>
                            {successMessage}
                        </p>
                    )}

                    {error && (
                        <p style={{ color: "red" }}>
                            {error}
                        </p>
                    )}

                    <h3>Nouveau</h3>

                    <label htmlFor="">Couleur</label>
                    <input type="text" value={couleurNouveau} onChange={(e) => setCouleurNouveau(e.target.value)}/>

                    <label htmlFor="">Traduction</label>
                    <input type="text" value={tradNouveau} onChange={(e) => setTradNouveau(e.target.value)}/>
                </div>

                <div>
                    <h3>In progress</h3>

                    <label htmlFor="">Couleur</label>
                    <input type="text" value={couleurProgress} onChange={e => setCouleurProgress(e.target.value)}/>

                    <label htmlFor="">Traduction</label>
                    <input type="text" value={tradProgress} onChange={e => setTradProgress(e.target.value)}/>
                </div>

                <div>
                    <h3>Terminé</h3>

                    <label htmlFor="">Couleur</label>
                    <input type="text" value={couleurTermine} onChange={e => setCouleurTermine(e.target.value)}/>

                    <label htmlFor="">Traduction</label>
                    <input type="text" value={tradTermine} onChange={e => setTradTermine(e.target.value)}/>
                </div>

                <button type="submit">Confirmer</button>
            </form>
        </div>
    );
}