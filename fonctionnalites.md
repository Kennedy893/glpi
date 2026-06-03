🔄 Gestion complète du cycle de vie d'un ticket
Au-delà du CRUD basique :
- Escalade automatique — si un ticket dépasse un délai sans réponse, changer automatiquement sa priorité et réassigner via un polling régulier
- Fusion de tickets — détecter des tickets similaires (même titre, même asset) et les lier comme tickets dupliqués via /_link
- Tickets récurrents — créer automatiquement des tickets à intervalles réguliers (maintenance hebdomadaire, sauvegarde...)
- Arbre de tâches — créer des sous-tâches (ITILTask) avec suivi du temps passé par technicien, et calculer le temps total consommé
- Validation workflow — soumettre un ticket à validation (TicketValidation), gérer les états approuvé/refusé avec notifications

Ticket créé
  └── Validation demandée (TicketValidation)
        ├── Approuvée → assignation technicien
        └── Refusée → retour demandeur avec motif


📋 Gestion des problèmes et changements
- Lier des tickets à un Problème — regrouper N tickets qui ont la même cause racine, afficher le problème parent sur chaque ticket
- Créer un Changement depuis un Problème — workflow ITIL complet (Incident → Problème → Changement → Résolution)
- Suivi des impacts — pour un asset donné, lister tous les tickets/problèmes/changements qui lui sont liés

5 tickets "réseau lent"
  └── Problème "Switch défaillant salle B"
        └── Changement "Remplacement switch planifié le 15/06"
              └── Tous les tickets fermés automatiquement


🖥️ Parc informatique avancé
- Dashboard d'inventaire dynamique — filtrer les assets par localisation, état, utilisateur avec une carte interactive
- Détection d'assets sans ticket depuis X jours — croiser parc et tickets pour repérer le matériel "fantôme"
- Cycle de vie hardware — calculer l'âge des équipements depuis leur date d'achat, alerter sur les assets en fin de garantie (croiser Computer + Contract)
- Logiciels et licences — lister les logiciels installés sur un poste (SoftwareVersion), détecter les postes avec licences expirées ou logiciels non autorisés
- Réservation d'équipements — interface calendrier pour réserver un asset (vidéoprojecteur, PC portable) via Reservation + ReservationItem


👥 Gestion avancée des utilisateurs et droits
- Annuaire avec organigramme — reconstruire la hiérarchie des groupes/entités pour visualiser qui supervise qui
- Rapport d'activité par technicien — tickets traités, temps moyen, taux de résolution au premier contact
- Gestion des astreintes — associer des plages horaires à des techniciens, router les tickets selon l'heure de création
- Tableau de charge — visualiser en temps réel combien de tickets ouverts chaque technicien a en cours


📊 Reporting et analytics
- SLA breaches en temps réel — lister tous les tickets qui ont dépassé ou vont dépasser leur délai SLA dans les 2h
- Heatmap d'incidents — par jour/heure sur les 30 derniers jours, visualiser les pics de création de tickets
- Coût des incidents — croiser le temps passé (ITILTask duration) × taux horaire du technicien pour estimer le coût réel
- Taux de réouverture — tickets fermés puis réouverts dans les 48h (signe d'une mauvaise résolution)


🔍 Recherche et filtrage avancés
L'API GLPI supporte des critères de recherche puissants (/search) souvent sous-exploités :
- Recherche multi-critères — tickets ouverts + priorité haute + assignés à un groupe + créés cette semaine, en une seule requête
- Recherche full-text — dans les titres, descriptions et suivis simultanément
- Export intelligent — générer des exports CSV/Excel filtrés et formatés depuis les résultats de recherche

// Exemple : tickets critiques non assignés depuis plus de 24h
GET /search/Ticket?
  criteria[0][field]=10&criteria[0][value]=1        // statut = nouveau
  &criteria[1][field]=3&criteria[1][value]=5         // priorité = très haute
  &criteria[2][field]=5&criteria[2][value]=^$        // assigné = vide