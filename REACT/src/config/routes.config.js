// config/routes.config.js
import { LoginPage } from '../pages/login/LoginPage';
import { TicketsPage } from '../pages/ticket/TicketsPage';
import { ImportPage } from '../pages/ImportPage';
import { ResetPage } from '../pages/ResetPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

// Configuration du menu (barre de navigation)
export const menuConfig = [
  {
    label: 'Tickets',
    path: '/',
  },
  {
    label: 'Import Utilisateurs',
    path: '/import'
  },
  {
    label: 'Reset Données',
    path: '/reset',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
  }
];

// Configuration des routes
export const routesConfig = [
  // Route publique
  {
    path: '/login',
    component: LoginPage,
    protected: false,
    title: 'Connexion'
  },
  // Routes protégées (backoffice)
  {
    path: '/',
    component: TicketsPage,
    protected: true,
    title: 'Gestion des tickets'
  },
  {
    path: '/import',
    component: ImportPage,
    protected: true,
    title: 'Import des utilisateurs'
  },
  {
    path: '/reset',
    component: ResetPage,
    protected: true,
    title: 'Réinitialisation'
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    protected: true,
    title: 'Réinitialisation'
  }
];

// Fonction utilitaire pour obtenir le titre d'une page
export const getPageTitle = (pathname) => {
  const route = routesConfig.find(route => route.path === pathname);
  return route?.title || 'GLPI Backoffice';
};