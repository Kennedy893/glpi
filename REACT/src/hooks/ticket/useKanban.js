// hooks/ticket/useKanban.js
import { useState } from 'react';
import { TicketRepository } from '../../domain/repositories/TicketRepository';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';
import { TicketCostRepository } from '../../domain/repositories/TicketCostRepository';

// ─── Config des dialogues selon la transition ─────────────
// clé : "statusLabel_source -> statusLabel_cible"
const DIALOG_CONFIG = {
  'New->In progress': {
    title:  "Assigner le ticket",
    fields: ['technicien'],
  },
  'New->Closed': {
    title:  "Résoudre le ticket",
    fields: ['technicien', 'solution', 'superCost'],
  },
  'In progress->Closed': {
    title:  "Saisir la solution",
    fields: ['solution', 'superCost'],
  },
  'Closed->New': {
    title:  "Saisir la cause",
    fields: ['cause'],
  },
  'Closed->In progress': {
    title:  "Reouverture/Annuler",
    fields: ['pourcentageReouverture'],
  },
};

// ─── Transitions interdites ─────────────────────────────
const FORBIDDEN_TRANSITIONS = [
  'Closed->In progress',  // Interdire Closed → In progress
];

// ─── Mapping statusLabel → statusId GLPI ─────────────────
const STATUS_ID = {
  'New':  1,
  'In progress': 2,
  'Closed':   6,
};

// ─── Mapping statusId → statusLabel ─────────────────
const STATUS_LABEL = {
  1: 'New',
  2: 'In progress',
  6: 'Closed',
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
    // if (FORBIDDEN_TRANSITIONS.includes(key)) {
    //   console.warn(`🚫 Transition interdite: ${key}`);
    //   // Optionnel: Afficher une notification à l'utilisateur
    //   alert(`Impossible de déplacer un ticket de "${sourceLabel}" vers "${targetStatusLabel}"`);
    //   return;
    // }
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
  const confirmDialog = async ({ technicienId, solution, cause, superCost, pourcentageReouverture }) => {
    await applyStatusChange(dialog.ticket, dialog.newStatus, { technicienId, solution, cause, superCost, pourcentageReouverture });
    closeDialog();
  };

  // ── Fermer le dialogue sans action ─────────────────────
  const closeDialog = () => {
    setDialog({ open: false, ticket: null, newStatus: null, title: '', fields: [] });
  };

  // ── Appels API + mise à jour locale ────────────────────
  const applyStatusChange = async (ticket, targetStatusLabel, extraData) => {
    const newStatusId = STATUS_ID[targetStatusLabel];
    const currentStatusId = ticket.status;
    const currentStatusLabel = STATUS_LABEL[currentStatusId];

    if (!newStatusId) {
      console.error('[useKanban] statusId introuvable pour', targetStatusLabel);
      return;
    }

    console.log('EXTRAAAAAA', extraData.cause);
    

    try {
      // 1 — Créer la solution si résolu
      if (newStatusId === 6 && extraData.solution?.trim()) {
        await TicketRepository.createSolution({
          itemtype: 'Ticket',
          items_id: ticket.id,
          content: extraData.solution.trim(),
          status: 1,
        });

        // Récupérer les items du ticket
        const items = await TicketRepository.getItemsByTicket(ticket.id);
        const nbItems = items.length;

        if (nbItems > 0 && extraData.superCost && parseFloat(extraData.superCost) > 0) 
        {
          const costPerItem = parseFloat(extraData.superCost) / nbItems;
          
          // Créer un supercost pour chaque item
          for (const item of items) {
              try {
                  // Récupérer le coût GLPI pour cet item
                  const glpiCosts = await TicketCostRepository.getCostByTicketAndItem(ticket.id, item.id);
                  
                  // Créer le SuperCost
                  await SuperCostRepository.createSuperCost({
                      ticketId: ticket.id,
                      itemId: item.id,
                      cost: costPerItem || 0,
                      categorie: item.itemType || item.type
                      // coutglpi: glpiCosts.total_cost || 0
                  });

                  // Créer le Cout glpi
                  await SuperCostRepository.createGlpiCost({
                      ticketId: ticket.id,
                      itemId: item.id,
                      cost: glpiCosts.total_cost || 0,
                      categorie: item.itemType || item.type
                  });
              } catch (error) {
                  console.error(`Erreur pour l'item ${item.id}:`, error);
              }
          }
          
          console.log(`💰 ${nbItems} SuperCost(s) créé(s) pour le ticket ${ticket.id}`);
      } else if (nbItems === 0) {
          console.warn(`⚠️ Aucun item trouvé pour le ticket ${ticket.id}`);
        }
      }

      // 2 — Créer la cause si réouverture (Closed -> New)
      if (newStatusId === 1 &&  currentStatusId === 6 && extraData.cause?.trim()) {
        
        await TicketRepository.createCause({
          itemtype: 'Ticket',
          items_id: ticket.id,
          content:  extraData.cause.trim()
        });
      }

      // 3 — Ajouter le technicien dans Ticket_User si passage à "En cours" (status 2)
      if (newStatusId === 2 && extraData.technicienId) {
        console.log('👤 Ajout du technicien au ticket (Ticket_User)');
        
        await TicketRepository.addUserToTicket(
          ticket.id, 
          extraData.technicienId, 
          2  // type 2 = technicien assigné (assigned)
        );
      }

      // 4 — Mettre à jour le statut (+ technicien si fourni)
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
