# 1. utilisateurs.csv
### Vérifier si le groupe existe
GET  /Group?searchText=DSI

### Créer le groupe si absent
POST /Group
{ "name": "DSI" }

### Vérifier si la localisation existe
GET  /Location?searchText=Salle A

### Créer la localisation si absente
POST /Location
{ "name": "Salle A" }

### Créer l'utilisateur
POST /User
{
  "name": "jdupont",
  "firstname": "Jean",
  "realname": "Dupont",
  "email": "jean.dupont@entreprise.fr",
  "password": "Azerty1234!",
  "locations_id": <id_location>
}

### Lier le profil à l'utilisateur
POST /Profile_User
{
  "users_id": <id_user>,
  "profiles_id": <id_profil>,
  "entities_id": <id_entite>
}


# 2. materiels.csv
### Résoudre les IDs nécessaires avant insertion
GET /Location?searchText=Salle A       → id_location
GET /User?searchText=jdupont           → id_user
GET /State?searchText=En service       → id_state
GET /Manufacturer?searchText=Dell      → id_manufacturer  (créer si absent)

### Créer selon le type de la ligne
POST /Computer          # pour les ordinateurs
{
  "name": "PC-DELL-001",
  "serial": "SN-123456",
  "otherserial": "REF-PC-001",
  "manufacturers_id": <id_manufacturer>,
  "computermodels_id": <id_model>,
  "ram": "16Go",
  "locations_id": <id_location>,
  "states_id": <id_state>,
  "users_id_tech": <id_user>
}

POST /Printer           # pour les imprimantes
POST /NetworkEquipment  # pour les switches/routeurs
POST /Monitor           # pour les écrans


# 3. tickets.csv
### Résoudre les IDs avant insertion
GET /User?searchText=jdupont           → id_demandeur
GET /User?searchText=ldurand           → id_technicien
GET /Computer?searchText=REF-PC-001   → id_asset
GET /ITILCategory?searchText=Matériel → id_categorie

### Créer le ticket
POST /Ticket
{
  "name": "Écran noir au démarrage",
  "content": "Le PC ne démarre plus depuis ce matin",
  "type": 1,               // 1=Incident, 2=Demande
  "priority": 4,           // 1=Très basse → 6=Très haute
  "status": 6,             // 1=Nouveau, 4=En cours, 6=Résolu...
  "itilcategories_id": <id_categorie>,
  "date": "2024-01-09 08:00:00"
}

### Lier le demandeur au ticket
POST /Ticket_User
{
  "tickets_id": <id_ticket>,
  "users_id": <id_demandeur>,
  "type": 1               // 1=Demandeur, 2=Assigné, 3=Observateur
}

### Lier le technicien au ticket
POST /Ticket_User
{
  "tickets_id": <id_ticket>,
  "users_id": <id_technicien>,
  "type": 2               // 2=Assigné
}

### Lier l'asset au ticket
POST /Item_Ticket
{
  "tickets_id": <id_ticket>,
  "itemtype": "Computer",
  "items_id": <id_asset>
}