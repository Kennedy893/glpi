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