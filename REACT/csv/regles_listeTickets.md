Tableau general :
Référence, Titre, Type, Statut, Priorité, Date création

Fiche detail :
GET /Ticket/{id}/Item_Ticket   → liste des assets liés
GET /Ticket/{id}/TicketCost    → liste des coûts
  └── actiontime, cost_time, cost_fixed, cost_material
GET /Ticket/{id}/ITILFollowup  → historique des commentaires

// Liste
GET /Ticket?range=0-100

// Fiche détail
GET /Ticket/{id}
GET /Ticket/{id}/Item_Ticket
GET /Ticket/{id}/TicketCost
GET /Ticket/{id}/ITILFollowup