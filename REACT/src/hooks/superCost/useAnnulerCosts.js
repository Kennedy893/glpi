import { useState } from "react";
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository";

export const useAnnulerCosts = (ticketId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nombre_modifies, setNombre_modifies] = useState(0);
    const [message, setMessage] = useState('');
    const [messagefinal, setMessageFinal] = useState('');

    const annuler = async () => {
        setLoading(true);  // ← Activer loading pendant l'appel
        setError('');      // ← Réinitialiser l'erreur

        try {
            const response = await SuperCostRepository.annulerLastSuperCosts(ticketId);

            setNombre_modifies(response?.nombre_modifies);
            setMessage(response?.message);
            setMessageFinal(`${response?.message} = ${response?.nombre_modifies || 0}`);
            
        } catch (error) {
            console.log(error);
            setError(error.message);
            setMessageFinal('Erreur lors de l annulation');
        } finally {
            setLoading(false);  // ← Désactiver loading
        }
    }

    // Retourner annuler ainsi que les autres valeurs
    return {
        annuler,
        messagefinal, 
        loading, 
        error,
        nombre_modifies,
        message
    }
}