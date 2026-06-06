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

glpi_computers (table principale)
    ├── glpi_items_devicememories (liens vers les mémoires RAM)
    ├── glpi_items_deviceharddrives (liens vers les disques durs)
    ├── glpi_computers_items_operatingsystems (liens vers les OS)
    ├── glpi_infocoms (informations financières: prix, date achat, garantie)
    ├── glpi_documents_items (documents joints: factures, photos)
    ├── glpi_networks (connexions réseau)
    └── glpi_items_tickets (tickets associés) [citation:1]

POST /Printer           # pour les imprimantes
POST /Infocom          { itemtype: "Printer" }
POST /NetworkPort      { itemtype: "Printer" }
POST /CartridgeItem    → créer le type de cartouche
POST /Cartridge        → créer la cartouche physique
POST /Item_Cartridge   → lier cartouche à l'imprimante (pas d'endpoint direct, géré via Cartridge)

POST /NetworkEquipment  # pour les switches/routeurs
POST /Infocom              { itemtype: "NetworkEquipment" }
POST /NetworkPort          { itemtype: "NetworkEquipment" }
POST /NetworkPort_Vlan     → lier un VLAN à un port
POST /Item_DeviceFirmware  → version firmware

POST /Monitor           # pour les écrans
POST /Infocom    { itemtype: "Monitor" }

POST /Phone
POST /Infocom              { itemtype: "Phone" }
POST /Item_DeviceMemory    { itemtype: "Phone" }   // si smartphone
POST /NetworkPort          { itemtype: "Phone" }   // si VoIP


- Pour un ordinateur/serveur
Ligne : PC-DELL-001, REF-PC-001, Ordinateur, Dell, Latitude 5520, SN-123456,
        16Go, 512Go SSD, Windows 11 Pro, 850.00, 01/01/2024, En service, Salle A

ÉTAPE 1 — Résoudre/créer les entités de référence
──────────────────────────────────────────────────
GET  /Manufacturer?searchText=Dell
  → absent → POST /Manufacturer { "name": "Dell" }
                                  → id_manufacturer

GET  /ComputerModel?searchText=Latitude 5520
  → absent → POST /ComputerModel { "name": "Latitude 5520" }
                                   → id_model

GET  /State?searchText=En service
  → absent → POST /State { "name": "En service" }
                           → id_state

GET  /Location?searchText=Salle A
  → absent → POST /Location { "name": "Salle A" }
                              → id_location

GET  /OperatingSystem?searchText=Windows 11 Pro
  → absent → POST /OperatingSystem { "name": "Windows 11 Pro" }
                                     → id_os

GET  /DeviceMemory?searchText=16Go
  → absent → POST /DeviceMemory { "designation": "RAM 16Go", "size": 16384 }
                                  → id_ram

GET  /DeviceHardDrive?searchText=512Go SSD
  → absent → POST /DeviceHardDrive { "designation": "512Go SSD", "capacity": 524288 }
                                     → id_hdd

ÉTAPE 2 — Créer l'asset principal
──────────────────────────────────
POST /Computer
{
  "name":                "PC-DELL-001",
  "otherserial":         "REF-PC-001",
  "serial":              "SN-123456",
  "manufacturers_id":    <id_manufacturer>,
  "computermodels_id":   <id_model>,
  "states_id":           <id_state>,
  "locations_id":        <id_location>
}
→ id_computer

ÉTAPE 3 — Infocom (prix + date achat)
──────────────────────────────────────
POST /Infocom
{
  "itemtype":  "Computer",
  "items_id":  <id_computer>,
  "value":     850.00,
  "buy_date":  "2024-01-01"
}

ÉTAPE 4 — RAM
─────────────
POST /Item_DeviceMemory
{
  "itemtype":          "Computer",
  "items_id":          <id_computer>,
  "devicememories_id": <id_ram>,
  "size":              16384
}

ÉTAPE 5 — Disque
─────────────────
POST /Item_DeviceHardDrive
{
  "itemtype":              "Computer",
  "items_id":              <id_computer>,
  "deviceharddrives_id":   <id_hdd>,
  "capacity":              524288
}

ÉTAPE 6 — OS
─────────────
POST /Item_OperatingSystem
{
  "itemtype":               "Computer",
  "items_id":               <id_computer>,
  "operatingsystems_id":    <id_os>
}


- Pour une imprimante
Ligne : PRINT-001, REF-PR-001, Imprimante, Canon, LBP6030, SN-345678,
        , , , 210.00, 10/03/2024, En service, Couloir 2

ÉTAPE 1 — Résoudre/créer les entités de référence
──────────────────────────────────────────────────
POST /Manufacturer  { "name": "Canon" }      → id_manufacturer
POST /PrinterModel  { "name": "LBP6030" }    → id_model
GET  /State         En service               → id_state
GET  /Location      Couloir 2                → id_location

ÉTAPE 2 — Créer l'asset principal
──────────────────────────────────
POST /Printer
{
  "name":              "PRINT-001",
  "otherserial":       "REF-PR-001",
  "serial":            "SN-345678",
  "manufacturers_id":  <id_manufacturer>,
  "printermodels_id":  <id_model>,
  "states_id":         <id_state>,
  "locations_id":      <id_location>
}
→ id_printer

ÉTAPE 3 — Infocom uniquement (pas de RAM/stockage/OS)
──────────────────────────────────────────────────────
POST /Infocom
{
  "itemtype":  "Printer",
  "items_id":  <id_printer>,
  "value":     210.00,
  "buy_date":  "2024-03-10"
}



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

<!-- ///////////////////////////////////// -->
FICHIER 1
Pour chaque ligne :

1. Lire Item_Type → choisir endpoint principal (Computer, Monitor...)
Item_Type = "Computer" → POST /Computer
Item_Type = "Monitor"  → POST /Monitor
Item_Type = "Printer"  → POST /Printer
... etc

2. getOrCreate :
   ├── /State        (Status)
   ├── /Location     (Location)
   ├── /Manufacturer (Manufacturer)
   └── /ComputerModel ou /MonitorModel (Model)
GET /Location?searchText=Administration     → id_location
GET /Manufacturer?searchText=Dell           → id_manufacturer
GET /State?searchText=En production         → id_state
GET /User?searchText=Rakoto Jean            → id_user  (peut être null)
GET /ComputerModel?searchText=OptiPlex 7010 → id_model (si Computer)
GET /MonitorModel?searchText=AC1000         → id_model (si Monitor)

3. Résoudre User :
   ├── GET /User?searchText=...   → users_id
   └── sinon GET/POST /Group      → groups_id
"Rakoto Jean"    → chercher dans /User          → users_id
"ITU Labs"       → chercher dans /Group         → groups_id
"Bibliothèque"   → chercher dans /Group         → groups_id
""               → null, champ ignoré

4. POST /Computer ou /Monitor
   avec tous les IDs résolus
   → id_asset
POST /Computer
{
  input: {
    name:               "PC-ADM-001",        // colonne Name
    otherserial:        "ITU-2026-0001",     // colonne Inventory_Number
    manufacturers_id:   <id_manufacturer>,
    computermodels_id:  <id_model>,
    states_id:          <id_state>,
    locations_id:       <id_location>,
    users_id:           <id_user>            // null si vide
  }
}
→ id_computer
POST /Monitor
{
  input: {
    name:              "MN-FORM-002",
    otherserial:       "ITU-2026-0010",
    manufacturers_id:  <id_manufacturer>,
    monitormodels_id:  <id_model>,           // ← différent de computermodels_id
    states_id:         <id_state>,
    locations_id:      <id_location>,
    users_id:          <id_user>
  }
}
→ id_monitor

(pas d'Infocom, pas de composants — colonnes absentes du CSV)


FICHIER 2
POST /Ticket
{
  input: {
    ref:      "1",                       // Ref_Ticket → otherserial si disponible
    date:     "2026-06-03 13:45:00",     // Date + Heure combinées
    type:     1,                         // "Incident" → 1
    name:     "Tsy mandeha",             // Titre
    content:  "hafahafa be",             // Description
    status:   1,                         // "New" → 1
    priority: 3,                         // "Medium" → 3
    entities_id: 0                       // entité racine par défaut
  }
}
→ id_ticket

"Incident" → 1
"Demande"  → 2

"New"         → 1
"Processing"  → 2
"Pending"     → 4
"Solved"      → 5
"Closed"      → 6

"Very Low"  → 1
"Low"       → 2
"Medium"    → 3
"High"      → 4
"Very High" → 5
"Major"     → 6


Pour "PC-ADM-001" :
  GET /Computer?searchText=PC-ADM-001   → { id: X, itemtype: "Computer" }

Pour "MN-FORM-002" :
  GET /Monitor?searchText=MN-FORM-002   → { id: Y, itemtype: "Monitor" }


POST /Item_Ticket
{
  input: {
    tickets_id: <id_ticket>,
    itemtype:   "Computer",
    items_id:   <id_computer>
  }
}

POST /Item_Ticket
{
  input: {
    tickets_id: <id_ticket>,
    itemtype:   "Monitor",
    items_id:   <id_monitor>
  }
}