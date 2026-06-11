// components/asset/AssetList.jsx
import { useState } from 'react';
import { AssetRow } from './AssetRow';
import { AssetFilters } from './AssetFilters';
import { useAssetFilters } from '../../hooks/asset/useAssetFilters';

export const AssetList = ({ assets, onRefresh, onAssetClick }) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filters,
    filteredAssets,
    updateFilter,
    resetFilters,
    updateSort,
    sortConfig,
    hasActiveFilters,
    getActiveFiltersCount,
    totalCount,
    filteredCount
  } = useAssetFilters(assets);

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
      </div>
    );
  }

  return (
    <div className="asset-list-container">
      {/* En-tête avec compteurs et bouton filtres */}
      <div className="asset-list-header">
        <div className="header-left">
          <span className="asset-count-badge">
            Total = {totalCount}
            {hasActiveFilters() && (
              <span className="filtered-count"> (Filtrés: {filteredCount})</span>
            )}
          </span>
        </div>
        <div className="header-right">
          <button 
            className={`btn-filters ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/>
            </svg>
            Filtres
            {hasActiveFilters() && (
              <span className="filter-badge">{getActiveFiltersCount()}</span>
            )}
          </button>
          {/* <button className="btn-refresh" onClick={onRefresh}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Rafraîchir
          </button> */}
        </div>
      </div>

      {/* Panneau des filtres (affichage conditionnel) */}
      {showFilters && (
        <AssetFilters 
          assets={assets}
          filters={filters}
          onFilterChange={updateFilter}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Barre de tri rapide (optionnelle) */}
      {hasActiveFilters() && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Filtres actifs :</span>
          {filters.search && (
            <span className="filter-tag" onClick={() => updateFilter('search', '')}>
              🔍 {filters.search} ✕
            </span>
          )}
          {filters.type && (
            <span className="filter-tag" onClick={() => updateFilter('type', '')}>
              📦 {filters.type} ✕
            </span>
          )}
          {filters.manufacturer && (
            <span className="filter-tag" onClick={() => updateFilter('manufacturer', '')}>
              🏭 {filters.manufacturer} ✕
            </span>
          )}
          {filters.model && (
            <span className="filter-tag" onClick={() => updateFilter('model', '')}>
              📟 {filters.model} ✕
            </span>
          )}
          {filters.location && (
            <span className="filter-tag" onClick={() => updateFilter('location', '')}>
              📍 {filters.location} ✕
            </span>
          )}
          {filters.state && (
            <span className="filter-tag" onClick={() => updateFilter('state', '')}>
              ⚡ {filters.state} ✕
            </span>
          )}
          {filters.user && (
            <span className="filter-tag" onClick={() => updateFilter('user', '')}>
              👤 {filters.user} ✕
            </span>
          )}
          <button className="clear-all-filters" onClick={resetFilters}>
            Tout effacer
          </button>
        </div>
      )}

      {/* Tableau des résultats */}
      <div className="table-wrapper">
        <table className="asset-table">
          <thead>
            <tr>
              <th className="col-id image">
                Image
              </th>
              <th className="col-name sortable" onClick={() => updateSort('name')}>
                Nom {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-type sortable" onClick={() => updateSort('type')}>
                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-manufacturer sortable" onClick={() => updateSort('manufacturer')}>
                Marque {sortConfig.key === 'manufacturer' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-model sortable" onClick={() => updateSort('model')}>
                Modèle {sortConfig.key === 'model' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-location sortable" onClick={() => updateSort('location')}>
                Localisation {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-status sortable" onClick={() => updateSort('state')}>
                État {sortConfig.key === 'state' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="col-user sortable" onClick={() => updateSort('user')}>
                Utilisateur {sortConfig.key === 'user' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  <div className="no-results-content">
                    <span className="no-results-icon">🔍</span>
                    <p>Aucun résultat ne correspond à vos filtres</p>
                    <button className="reset-filters-link" onClick={resetFilters}>
                      Réinitialiser les filtres
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => (
                <AssetRow 
                  key={`${asset.type}-${asset.id}`} 
                  asset={asset}
                  onClick={onAssetClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Informations de pagination (optionnelle) */}
      {filteredAssets.length > 0 && (
        <div className="asset-list-footer">
          <span className="results-info">
            Affichage de {filteredAssets.length} équipement{filteredAssets.length > 1 ? 's' : ''}
            {hasActiveFilters() && ` sur ${totalCount} total`}
          </span>
        </div>
      )}
    </div>
  );
};