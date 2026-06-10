const BASE_URL = 'http://localhost:8081/api/kanban-settings';

export const KanbanSettingsRepository = {

  async getSettings() {
    try {
      const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur GET /api/kanban-settings:', error);
      throw error;
    }
  },

  async updateSettings(data) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur PUT /api/kanban-settings:', error);
      throw error;
    }
  },
};