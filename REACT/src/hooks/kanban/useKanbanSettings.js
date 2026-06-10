import { useState, useEffect } from "react";
import { KanbanSettingsRepository } from "../../domain/repositories/KanbanSettingsRepository";

export const useKanbanSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // ── Charger les paramètres actuels au montage ─────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await KanbanSettingsRepository.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message || 'Erreur chargement paramètres.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Mettre à jour les 3 colonnes en un seul appel ────
  const update = async (couleurNouveau, tradNouveau, couleurProgress, tradProgress, couleurTermine, tradTermine) => {
    setLoading(true);
    setError('');

    try {
      // Un seul appel avec les 3 colonnes
      const updated = await KanbanSettingsRepository.updateSettings({
        columns: [
          { statusId: 1, statusLabel: "Nouveau",  color: couleurNouveau,  labelMg: tradNouveau  },
          { statusId: 2, statusLabel: "En cours", color: couleurProgress, labelMg: tradProgress },
          { statusId: 5, statusLabel: "Résolu",   color: couleurTermine,  labelMg: tradTermine  },
        ]
      });

      setSettings(updated); // mettre à jour le state local
      return updated;

    } catch (err) {
      console.error('[useKanbanSettings] Erreur:', err);
      setError(err.message || 'Erreur lors de la mise à jour.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { settings, update, loading, error };
};