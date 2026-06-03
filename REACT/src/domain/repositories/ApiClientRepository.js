let baseUrl_ = import.meta.env.VITE_GLPI_API_URL;
let appToken_ = import.meta.env.VITE_GLPI_APP_TOKEN;
let userToken_ = import.meta.env.VITE_GLPI_USER_TOKEN;

// Client bas niveau pour communiquer avec l'API GLPI
class ApiClientRepository {
  constructor(baseUrl, appToken, userToken) {
    this.baseUrl = baseUrl;
    this.appToken = appToken;
    this.userToken = userToken;
    this.sessionToken = null;
  }

  // Initialiser la session
  async initSession() {
    try {
      const response = await fetch(`${this.baseUrl}/initSession`, {
        method: 'GET',
        headers: {
          'App-Token': this.appToken,
          'Authorization': `user_token ${this.userToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      this.sessionToken = data.session_token;
      return data;
    } catch (error) {
      console.error('Erreur initSession:', error);
      throw error;
    }
  }

  // Requête GET générique
  async get(endpoint) {
    if (!this.sessionToken) {
      await this.initSession();
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'GET',
        headers: {
          'App-Token': this.appToken,
          'Session-Token': this.sessionToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur GET ${endpoint}:`, error);
      throw error;
    }
  }

  // Requête POST générique
  async post(endpoint, data) {
    if (!this.sessionToken) {
      await this.initSession();
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'App-Token': this.appToken,
          'Session-Token': this.sessionToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur POST ${endpoint}:`, error);
      throw error;
    }
  }

  // Requête PUT générique (modification complète)
  async put(endpoint, data) {
    if (!this.sessionToken) {
      await this.initSession();
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'App-Token': this.appToken,
          'Session-Token': this.sessionToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur PUT ${endpoint}:`, error);
      throw error;
    }
  }

  // Requête DELETE générique
  async delete(endpoint) {
    if (!this.sessionToken) {
      await this.initSession();
    }

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'DELETE',
        headers: {
          'App-Token': this.appToken,
          'Session-Token': this.sessionToken,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur DELETE ${endpoint}:`, error);
      throw error;
    }
  }

}

// Instance unique (singleton)
let apiClientInstance = null;

export const getApiClient = () => {
  if (!apiClientInstance) {
    // Configuration - à mettre dans un fichier .env plus tard
    const baseUrl = baseUrl_ || '/api/api.php';
    const appToken = appToken_;
    const userToken = userToken_;

    if (!appToken || !userToken) {
      throw new Error('Tokens API manquants. Vérifiez vos variables d\'environnement.');
    }

    apiClientInstance = new ApiClientRepository(baseUrl, appToken, userToken);
  }
  return apiClientInstance;
};