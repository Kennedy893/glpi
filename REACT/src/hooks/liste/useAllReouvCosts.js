import { useState, useEffect, useCallback } from 'react';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';

export const useAllReouvCosts = () => {
  const [reouvCosts, setReouvCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les reouvCosts
  const loadReouvCosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await SuperCostRepository.getReouvetureCosts();
    
    if (response) {
      setReouvCosts(response);
    } else {
      setError(response.error);
    }
    
    setLoading(false);
  }, [SuperCostRepository]);

  // Chargement automatique au montage du composant
  useEffect(() => {
    loadReouvCosts();
  }, [loadReouvCosts]);

  // Rafraîchir manuellement
  const refresh = () => {
    loadReouvCosts();
  };

  return {
    reouvCosts,
    loading,
    error,
    refresh
  };
};