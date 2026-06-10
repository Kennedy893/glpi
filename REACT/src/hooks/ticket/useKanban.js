// hooks/ticket/useKanban.js
import { useState } from 'react';
import { TicketRepository } from '../../domain/repositories/TicketRepository';

// ─── Config des dialogues selon la transition ─────────────
// clé : "statusLabel_source -> statusLabel_cible"
const DIALOG_CONFIG = {
  'Nouveau->In progress': {
    title:  "Assigner le ticket",
    fields: ['technicien'],
  },
  'Nouveau->Terminé': {
    title:  "Résoudre le ticket",
    fields: ['technicien', 'solution'],
  },
  'In progress->Terminé': {
    title:  "Saisir la solution",
    fields: ['solution'],
  },
};

// ─── Mapping statusLabel → statusId GLPI ─────────────────
const STATUS_ID = {
  'Nouveau':  1,
  'In progress': 2,
  'Terminé':   5,
};

export const useKanban = (ticketsStatusMap, setTicketsStatusMap) => {

  const [draggedId, setDraggedId] = useState(null);

  const [dialog, setDialog] = useState({
    open:         false,
    ticket:       null,
    newStatus:    null,   // statusLabel cible ex: "Résolu"
    title:        '',
    fields:       [],
  });

  // ── Début du drag ───────────────────────────────────────
  const onDragStart = (ticketId) => {
    setDraggedId(ticketId);
  };

  // ── Drop sur une colonne ────────────────────────────────
  const onDrop = (e, targetStatusLabel) => {
    e.preventDefault();

    // Récupérer l'id stocké dans dataTransfer
    const ticketId = parseInt(e.dataTransfer.getData('ticketId'));
    setDraggedId(null);

    // Trouver le ticket et sa colonne source dans le state
    let ticket       = null;
    let sourceLabel  = null;

    for (const group of ticketsStatusMap) {
      const found = group.tickets.find(t => t.id === ticketId);
      if (found) {
        ticket      = found;
        sourceLabel = group.statusLabel;
        break;
      }
    }

    // Ignorer si même colonne
    if (!ticket || sourceLabel === targetStatusLabel) return;

    // Construire la clé de transition
    const key    = `${sourceLabel}->${targetStatusLabel}`; // ex: "Nouveau->Résolu"
    const config = DIALOG_CONFIG[key];

    if (config) {
      // Ouvrir le dialogue (si necessaire)
      setDialog({
        open:      true,
        ticket,
        newStatus: targetStatusLabel,
        title:     config.title,
        fields:    config.fields,
      });
    } else {
      // Pas de dialogue → mise à jour directe
      applyStatusChange(ticket, targetStatusLabel, {});
    }
  };

  // ── Confirmation du dialogue ────────────────────────────
  const confirmDialog = async ({ technicienId, solution }) => {
    await applyStatusChange(dialog.ticket, dialog.newStatus, { technicienId, solution });
    closeDialog();
  };

  // ── Fermer le dialogue sans action ─────────────────────
  const closeDialog = () => {
    setDialog({ open: false, ticket: null, newStatus: null, title: '', fields: [] });
  };

  // ── Appels API + mise à jour locale ────────────────────
  const applyStatusChange = async (ticket, targetStatusLabel, extraData) => {
    const newStatusId = STATUS_ID[targetStatusLabel];
    if (!newStatusId) {
      console.error('[useKanban] statusId introuvable pour', targetStatusLabel);
      return;
    }

    try {
      // 1 — Créer la solution si résolu
      if (newStatusId === 5 && extraData.solution?.trim()) {
        await TicketRepository.createSolution({
          itemtype: 'Ticket',
          items_id: ticket.id,
          content:  extraData.solution.trim(),
          status:   1,
        });
      }

      // 2 — Mettre à jour le statut (+ technicien si fourni)
      const updatePayload = { 
        status: newStatusId 
      };
      if (extraData.technicienId) {
        updatePayload.users_id_assign = extraData.technicienId;
      }
      await TicketRepository.updateTicket(ticket.id, updatePayload);

      // 3 — Mise à jour locale sans refetch
      setTicketsStatusMap(prev => {
        // Retirer le ticket de sa colonne source
        const withoutTicket = prev.map(group => ({
          ...group,
          tickets: group.tickets.filter(t => t.id !== ticket.id),
        }));

        // L'ajouter dans la colonne cible avec le nouveau statut
        return withoutTicket.map(group => {
          if (group.statusLabel === targetStatusLabel) {
            return {
              ...group,
              tickets: [...group.tickets, { ...ticket, status: newStatusId }],
            };
          }
          return group;
        });
      });

      console.log(`[useKanban] ✅ Ticket ${ticket.id} déplacé vers "${targetStatusLabel}"`);

    } catch (error) {
      console.error('[useKanban] ❌ Erreur mise à jour statut:', error.message);
    }
  };

  return {
    draggedId,
    onDragStart,
    onDrop,
    dialog,
    closeDialog,
    confirmDialog,
  };
};
