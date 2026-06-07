// components/AssetList.jsx
import { AssetRow } from './AssetRow';

export const AssetList = ({ assets, onRefresh, onAssetClick }) => {
  if (!assets || assets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" strokeLinecap="round"/>
            <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round"/>
            <line x1="12" y1="8" x2="12" y2="16" strokeLinecap="round"/>
            <path d="M2 8h20M2 16h20" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="empty-state-title">Aucun équipement trouvé</h3>
        <p className="empty-state-description">Il n'y a actuellement aucun matériel dans le parc.</p>
        <button className="btn-refresh-primary" onClick={onRefresh}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Rafraîchir
        </button>
      </div>
    );
  }

  return (
    <div className="asset-list-container">
      <div className="asset-list-header">
        <div className="header-left">
          <span className="asset-count-badge">Total = {assets.length}</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="asset-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-name">Nom</th>
              <th className="col-type">Type</th>
              <th className="col-manufacturer">Marque</th>
              <th className="col-model">Modèle</th>
              <th className="col-location">Localisation</th>
              <th className="col-status">État</th>
              <th className="col-status">User</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <AssetRow 
                key={`${asset.type}-${asset.id}`} 
                asset={asset}
                onClick={onAssetClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};