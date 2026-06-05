import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Code unique par défaut (modifiable dans .env)
const BACKOFFICE_CODE = '123456';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si déjà authentifié
    const stored = localStorage.getItem('backoffice_auth');
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (code) => {
    if (code === BACKOFFICE_CODE) {
      setIsAuthenticated(true);
      localStorage.setItem('backoffice_auth', 'true');
      setError(null);
      return true;
    } else {
      setError('Code incorrect');
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('backoffice_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};