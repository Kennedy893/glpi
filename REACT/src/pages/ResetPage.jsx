import { useResetData } from "../hooks/reset/useResetData";
import '../assets/css/reset.css';

export const ResetPage = () => {
  const { resetData, loading, logs, stats, clearLogs } = useResetData();

  const handleReset = async () => {
    if (window.confirm(
      "⚠️ ATTENTION : Cette action va supprimer TOUTES les données de démonstration.\n\n" +
      "Les tickets, utilisateurs et matériels importés seront définitivement supprimés.\n\n" +
      "Êtes-vous absolument sûr de vouloir continuer ?"
    )) {
      await resetData();
    }
  };

  const hasErrors = stats.errors && stats.errors.length > 0;
  const hasStats = stats.ticketsSupprimés > 0 || stats.usersSupprimés > 0 || stats.assetsSupprimés > 0;

  return (
    <div className="reset-container">
      {/* En-tête */}
      <div className="reset-header">
        <h1>🔄 Réinitialisation des données</h1>
        <p>Cette action permet de supprimer toutes les données de démonstration (tickets, utilisateurs, matériels importés).</p>
      </div>

      {/* Bouton de réinitialisation */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          className="reset-button" 
          onClick={handleReset} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: '18px', height: '18px' }}></span>
              Réinitialisation en cours...
            </>
          ) : (
            <>
              <span>⚠️</span>
              Réinitialiser toutes les données
            </>
          )}
        </button>
      </div>

      {/* Statistiques (affichées après réinitialisation) */}
      {hasStats && (
        <div className="stats-grid">
          <div className="stat-card tickets">
            <div className="stat-value">{stats.ticketsSupprimés}</div>
            <div className="stat-label">Tickets supprimés</div>
          </div>
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.usersSupprimés}</div>
            <div className="stat-label">Utilisateurs supprimés</div>
          </div>
          <div className="stat-card assets">
            <div className="stat-value">{stats.assetsSupprimés}</div>
            <div className="stat-label">Matériels supprimés</div>
          </div>
        </div>
      )}

      {/* Logs d'exécution */}
      <div className="logs-container">
        <div className="logs-header">
          <h3>
            Journal d'exécution 
            {logs.length > 0 && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#888' }}>({logs.length})</span>}
          </h3>
          {logs.length > 0 && (
            <button className="clear-logs-btn" onClick={clearLogs}>
              🗑️ Effacer
            </button>
          )}
        </div>
        
        <div className="logs-list">
          {logs.length === 0 ? (
            <div className="empty-logs">
              <span>Aucune action effectuée</span>
              <p style={{ fontSize: '12px', marginTop: '10px' }}>
                Cliquez sur "Réinitialiser" pour supprimer les données de démonstration
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className={`log-item ${log.type}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Erreurs détaillées */}
      {hasErrors && (
        <div className="errors-list">
          <h3>❌ Erreurs rencontrées ({stats.errors.length})</h3>
          {stats.errors.map((error, index) => (
            <div key={index} className="error-item">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Overlay de chargement */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <span>Réinitialisation en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};