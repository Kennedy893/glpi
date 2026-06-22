import { useState, useEffect, useCallback } from 'react';
import { SuperCostRepository } from '../../domain/repositories/SuperCostRepository';

export const useAllSupCosts = () => {
  const [superCosts, setSuperCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les superCosts
  const loadSuperCosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const response = await SuperCostRepository.getSuperCosts();
    console.log('reponnnnse', response);
    
    
    if (response) {
      setSuperCosts(response);
    } else {
      setError(response.error);
    }

    console.log('SUUUUUUUP', superCosts);
    
    
    setLoading(false);
  }, [SuperCostRepository]);

  // Chargement automatique au montage du composant
  useEffect(() => {
    loadSuperCosts();
  }, [loadSuperCosts]);

  // Rafraîchir manuellement
  const refresh = () => {
    loadSuperCosts();
  };

  return {
    superCosts,
    loading,
    error,
    refresh
  };
};