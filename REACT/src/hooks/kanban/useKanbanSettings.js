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

  // ── Mettre à jour uniquement les champs fournis ────
  const update = async (updates) => {
    setLoading(true);
    setError('');

    try {
      // Récupérer les settings actuels si on ne les a pas
      const currentSettings = settings || await KanbanSettingsRepository.getSettings();
      
      // Fusionner les mises à jour avec les valeurs existantes
      const updatedColumns = currentSettings.columns.map(col => {
        if (col.statusId === 1 && updates.nouveau) {
          return {
            ...col,
            statusLabel: updates.nouveau.trad !== undefined ? updates.nouveau.trad : col.statusLabel,
            color: updates.nouveau.couleur !== undefined ? updates.nouveau.couleur : col.color, // Remplace par la nouvelle couleur si defined
            labelMg: updates.nouveau.labelMg !== undefined ? updates.nouveau.labelMg : col.labelMg // Remplace par le nouveau labelMg si defined
          };
        }
        if (col.statusId === 2 && updates.progress) {
          return {
            ...col,
            statusLabel: updates.progress.trad !== undefined ? updates.progress.trad : col.statusLabel,
            color: updates.progress.couleur !== undefined ? updates.progress.couleur : col.color,
            labelMg: updates.progress.labelMg !== undefined ? updates.progress.labelMg : col.labelMg
          };
        }
        if (col.statusId === 5 && updates.termine) {
          return {
            ...col,
            statusLabel: updates.termine.trad !== undefined ? updates.termine.trad : col.statusLabel,
            color: updates.termine.couleur !== undefined ? updates.termine.couleur : col.color,
            labelMg: updates.termine.labelMg !== undefined ? updates.termine.labelMg : col.labelMg
          };
        }
        return col;
      });

      // Un seul appel avec les 3 colonnes mises à jour
      const updated = await KanbanSettingsRepository.updateSettings({
        columns: updatedColumns
      });

      setSettings(updated);
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

// EXPLICATION
// // Sans spread operator
// const col = { id: 1, name: "Nouveau", color: "#ff0000" };
// const newCol = {
//     id: col.id,
//     name: col.name,
//     color: col.color,
//     statusLabel: "New"
// };

// // AVEC spread operator (plus simple)
// const newCol = {
//     ...col,  // Copie toutes les propriétés de col
//     statusLabel: "New"  // Ajoute ou remplace une propriété
// };