export class Ticket {
  constructor(id, name, content, status, date, requester) {
    this.id = id;
    this.name = name;
    this.content = content;
    this.status = status;
    this.date = date;
    this.requester = requester;
  }

  // Statut en texte lisible
  getStatusText() {
    const statusMap = {
      1: 'Nouveau',
      2: 'En cours',
      3: 'Résolu',
      4: 'Fermé',
      5: 'Annulé'
    };
    return statusMap[this.status] || 'Inconnu';
  }

  // Badge CSS selon le statut
  getStatusBadgeClass() {
    const classMap = {
      1: 'badge-primary',
      2: 'badge-warning',
      3: 'badge-success',
      4: 'badge-secondary',
      5: 'badge-danger'
    };
    return classMap[this.status] || 'badge-light';
  }

  // Factory pour créer un Ticket depuis l'API GLPI
  static fromApi(data) {
    return new Ticket(
      data.id,
      data.name,
      data.content,
      data.status,
      data.date_creation,
      data.users_id_recipient
    );
  }
}