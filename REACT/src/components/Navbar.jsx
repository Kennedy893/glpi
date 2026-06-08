// components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { menuConfig } from '../config/routes.config';
import '../assets/css/navbar.css';

export const Navbar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <div className="navbar-brand">
          <Link to="/">
            <span className="brand-text">GLPI Manager</span>
          </Link>
        </div>

        {/* Menu principal */}
        <div className="navbar-menu">
          {menuConfig.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Actions droite */}
        <div className="navbar-actions">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-label">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};