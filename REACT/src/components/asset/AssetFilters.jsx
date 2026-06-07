// components/asset/AssetFilters.jsx
import { useState, useEffect } from 'react';
import '../../assets/css/asset/asset-filters.css'

export const AssetFilters = ({ assets, filters, onFilterChange, onClose }) => {
  const [availableValues, setAvailableValues] = useState({
    types: [],
    manufacturers: [],
    models: [],
    locations: [],
    states: [],
    users: []
  });

  useEffect(() => {
    if (assets && assets.length > 0) {
      setAvailableValues({
        types: [...new Set(assets.map(a => a.type).filter(Boolean))],
        manufacturers: [...new Set(assets.map(a => a.manufacturer).filter(Boolean))],
        models: [...new Set(assets.map(a => a.model).filter(Boolean))],
        locations: [...new Set(assets.map(a => a.location).filter(Boolean))],
        states: [...new Set(assets.map(a => a.state).filter(Boolean))],
        users: [...new Set(assets.map(a => a.user).filter(Boolean))]
      });
    }
  }, [assets]);

  const handleChange = (key, value) => {
    onFilterChange(key, value);
  };

  return (
    <div className="asset-filters-panel">
      <div className="filters-header">
        <h3>
          <span className="filter-icon">🔍</span>
          Filtres avancés
        </h3>
        <button className="close-filters" onClick={onClose}>✕</button>
      </div>

      <div className="filters-grid">
        {/* <div className="filter-group filter-group-full">
          <label>Recherche textuelle</label>
          <input
            type="text"
            placeholder="Nom, référence, numéro de série..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div> */}

        <div className="filter-group">
          <label>Type d'équipement</label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="">Tous</option>
            {availableValues.types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Marque</label>
          <select
            value={filters.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value)}
          >
            <option value="">Toutes</option>
            {availableValues.manufacturers.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Modèle</label>
          <select
            value={filters.model}
            onChange={(e) => handleChange('model', e.target.value)}
          >
            <option value="">Tous</option>
            {availableValues.models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Localisation</label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
          >
            <option value="">Toutes</option>
            {availableValues.locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>État</label>
          <select
            value={filters.state}
            onChange={(e) => handleChange('state', e.target.value)}
          >
            <option value="">Tous</option>
            {availableValues.states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Utilisateur</label>
          <select
            value={filters.user}
            onChange={(e) => handleChange('user', e.target.value)}
          >
            <option value="">Tous</option>
            {availableValues.users.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};