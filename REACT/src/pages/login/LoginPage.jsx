// pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../assets/css/login.css';

export const LoginPage = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // sert à empêcher la soumission d'un formulaire.
    setIsSubmitting(true);
    
    // Simulation d'un petit délai pour l'effet visuel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (login(code)) {
      navigate('/');
    }
    
    setIsSubmitting(false);
  };

  const handleFrontoffice = async () => {
    navigate('/frontoffice/create-ticket');
  }

  // Remplir automatiquement en développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setCode('123456');
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="lock-icon">🔒</div>
          <h1>Backoffice GLPI</h1>
          <p>Accès sécurisé</p>
        </div>
        
        <div className="login-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Code d'accès
              </label>
              <div className="input-icon">
                <input
                  type="password"
                  placeholder="Entrez le code unique"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  required
                  disabled={isSubmitting}
                />
              </div>
              <span className="form-hint">
                Contactez l'administrateur pour obtenir le code
              </span>   
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Vérification...
                </>
              ) : (
                <>
                  Accéder au backoffice
                </>
              )}
            </button>
          </form>

          <button className="login-button" onClick={handleFrontoffice}>Accéder au frontoffice</button>
        </div>
        
        <div className="login-footer">
          GLPI Management - Accès restreint
        </div>
      </div>
    </div>
  );
};