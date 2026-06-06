// pages/DashboardPage.jsx
import { useElement } from "../../hooks/dashboard/useElement";
import '../../assets/css/dashboard.css';

export const DashboardPage = () => {
  const { nbComputers, nbMonitors, nbPrinters, nbNetworkEquipments, nbPhones, nbPeripherals, nbTotalAsset, loading, error } = useElement();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button className="error-retry" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Elements</h1>
    
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-value">{nbComputers}</div>
          <div className="stat-label">Ordinateurs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🖥️</div>
          <div className="stat-value">{nbMonitors}</div>
          <div className="stat-label">Écrans</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🖨️</div>
          <div className="stat-value">{nbPrinters}</div>
          <div className="stat-label">Imprimantes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-value">{nbNetworkEquipments}</div>
          <div className="stat-label">Équipements réseau</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-value">{nbPhones}</div>
          <div className="stat-label">Téléphones</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🖱️</div>
          <div className="stat-value">{nbPeripherals}</div>
          <div className="stat-label">Périphériques</div>
        </div>

        <div className="stat-card total-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">{nbTotalAsset}</div>
          <div className="stat-label">Total équipements</div>
        </div>
      </div>
    </div>
  );
};