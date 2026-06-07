// hooks/useAssetFilters.js
import { useState, useMemo } from 'react';

export const useAssetFilters = (assets) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    manufacturer: '',
    model: '',
    location: '',
    state: '',
    user: ''
  });

  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'asc'
  });

  // Filtrer les assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Filtre de recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(asset => 
        asset.name?.toLowerCase().includes(searchLower) ||
        asset.reference?.toLowerCase().includes(searchLower) ||
        asset.serial?.toLowerCase().includes(searchLower) ||
        asset.id?.toString().includes(searchLower)
      );
    }

    // Filtre par type
    if (filters.type) {
      result = result.filter(asset => asset.type === filters.type);
    }

    // Filtre par marque
    if (filters.manufacturer) {
      result = result.filter(asset => asset.manufacturer === filters.manufacturer);
    }

    // Filtre par modèle
    if (filters.model) {
      result = result.filter(asset => asset.model === filters.model);
    }

    // Filtre par localisation
    if (filters.location) {
      result = result.filter(asset => asset.location === filters.location);
    }

    // Filtre par état
    if (filters.state) {
      result = result.filter(asset => asset.state === filters.state);
    }

    // Filtre par utilisateur
    if (filters.user) {
      result = result.filter(asset => asset.user === filters.user);
    }

    return result;
  }, [assets, filters]);

  // Trier les assets
  const sortedAndFilteredAssets = useMemo(() => {
    const result = [...filteredAssets];
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [filteredAssets, sortConfig]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      manufacturer: '',
      model: '',
      location: '',
      state: '',
      user: ''
    });
  };

  const updateSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(v => v && v !== '');
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(v => v && v !== '').length;
  };

  return {
    filters,
    filteredAssets: sortedAndFilteredAssets,
    updateFilter,
    resetFilters,
    updateSort,
    sortConfig,
    hasActiveFilters,
    getActiveFiltersCount,
    totalCount: assets.length,
    filteredCount: sortedAndFilteredAssets.length
  };
};