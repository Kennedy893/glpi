Nouveau → En cours ✅Oui  Technicien assigné
Nouveau → Résolu   ✅Oui  Technicien + Solution
En cours → Résolu  ✅Oui  Solution

Endpoint pour mettre à jour le statut
PUT /Ticket/{id}
{
  input: {
    status: <nouveau_statut>,          // obligatoire
    users_id_assign: <id_technicien>,  // si assignation
  }
}

// Si résolu → ajouter une solution via
POST /ITILSolution
{
  input: {
    itemtype:  "Ticket",
    items_id:  <id_ticket>,
    content:   <texte_solution>,
    status:    1
  }
}

1. Utilisateur glisse le ticket vers une colonne

2. handleDrop(ticketId, newStatus) appelé

3. Vérifier si dialogue nécessaire :
   ├── Vers "En cours"  → dialogue "Assigner un technicien"
   ├── Vers "Résolu"    → dialogue "Saisir la solution"
   └── Retour arrière   → pas de dialogue → PUT /Ticket directement

4. Si dialogue :
   └── Afficher modal
         └── Utilisateur valide
               ├── PUT /Ticket/{id} { status, users_id_assign }
               └── POST /ITILSolution (si résolu)

5. Mettre à jour l'état local React (sans refetch)

<!-- DRAG & DROP -->

Utilisateur attrape une carte    → onDragStart
Utilisateur survole une colonne  → onDragOver
Utilisateur lâche la carte       → onDrop

Étape 1 — Marquer la carte comme draggable
<div
  draggable    // ← dit au navigateur "cet élément est déplaçable"
  onDragStart={(e) => {
    e.dataTransfer.setData('ticketId', String(ticket.id)); // ← stocke l'id dans le "presse-papier du drag"
    onDragStart(ticket.id);          // ← notifie React pour griser la carte
  }}
>

Étape 2 — Autoriser le drop sur les colonnes
Par défaut le navigateur interdit de dropper n'importe où. Il faut explicitement l'autoriser :
<div
  onDragOver={(e) => {
    e.preventDefault();        // ← sans ça, onDrop ne se déclenche jamais
    setIsDragOver(true);       // ← effet visuel sur la colonne
  }}
  onDragLeave={() => setIsDragOver(false)}
  onDrop={(e) => {
    setIsDragOver(false);
    onDrop(e, column.statusLabel); // ← déclenché quand l'utilisateur lâche
  }}
>

Étape 3 — Récupérer l'id et décider quoi faire
Dans useKanban, la fonction onDrop :
const onDrop = (e, targetStatusLabel) => {
  e.preventDefault();

  // Récupérer l'id stocké dans dataTransfer
  const ticketId = parseInt(e.dataTransfer.getData('ticketId'));
  setDraggedId(null); // ← arrêter l'effet visuel de drag

  // Trouver le ticket et sa colonne source dans le state
  let ticket      = null;
  let sourceLabel = null;

  for (const group of ticketsStatusMap) {
    const found = group.tickets.find(t => t.id === ticketId);
    if (found) {
      ticket      = found;
      sourceLabel = group.statusLabel; // ex: "Nouveau"
      break;
    }
  }

  // Ignorer si même colonne
  if (!ticket || sourceLabel === targetStatusLabel) return;

  // Construire la clé de transition
  const key    = `${sourceLabel}->${targetStatusLabel}`; // ex: "Nouveau->Résolu"
  const config = DIALOG_CONFIG[key];

  if (config) {
    // Transition nécessite un dialogue → ouvrir la modale
    setDialog({ open: true, ticket, newStatus: targetStatusLabel, ...config });
  } else {
    // Transition directe → mettre à jour sans dialogue
    applyStatusChange(ticket, targetStatusLabel, {});
  }
};

Étape 4 — Appliquer le changement
const applyStatusChange = async (ticket, targetStatusLabel, extraData) => {
  const newStatusId = STATUS_ID[targetStatusLabel]; // "Résolu" → 5

  // Appel API
  await TicketRepository.updateTicket(ticket.id, { status: newStatusId });

  // Mise à jour locale du state React (sans refetch)
  setTicketsStatusMap(prev => {
    // 1. Retirer le ticket de sa colonne source
    const withoutTicket = prev.map(group => ({
      ...group,
      tickets: group.tickets.filter(t => t.id !== ticket.id),
    }));

    // 2. L'ajouter dans la colonne cible
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
};

Schéma complet du flux
[KanbanCard]
  draggable + onDragStart
       │
       │ dataTransfer.setData('ticketId', '42')
       │ setDraggedId(42) → carte grisée
       ▼
[KanbanColumn cible]
  onDragOver → e.preventDefault() → drop autorisé
  onDrop     → e.dataTransfer.getData('ticketId') → "42"
       │
       ▼
[useKanban.onDrop]
  Trouver ticket 42 dans ticketsStatusMap
  Calculer clé "Nouveau->Résolu"
       │
       ├── DIALOG_CONFIG[clé] existe ?
       │     ├── Oui → setDialog({ open: true }) → StatusDialog s'affiche
       │     │           └── onConfirm({ solution }) → applyStatusChange()
       │     └── Non → applyStatusChange() directement
       │
       ▼
[applyStatusChange]
  PUT /Ticket/42 { status: 5 }
  POST /ITILSolution (si résolu)
  setTicketsStatusMap → retire de "Nouveau", ajoute dans "Résolu"
       │
       ▼
[React re-render]
  KanbanColumn "Nouveau" : ticket 42 disparu
  KanbanColumn "Résolu"  : ticket 42 apparu