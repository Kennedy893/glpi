// config/routes.config.js
import { LoginPage } from '../pages/login/LoginPage';
import { TicketsPage } from '../pages/ticket/TicketsPage';
import { ImportPage } from '../pages/ImportPage';
import { ResetPage } from '../pages/ResetPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CreateTicketPage } from '../pages/ticket/CreateTicketPage';

// Configuration du menu (barre de navigation)
export const menuConfig = [
  {
    label: 'Import',
    path: '/import'
  },
  {
    label: 'Reset Données',
    path: '/reset',
  },
  {
    label: 'Dashboard',
    path: '/',
  },
  {
    label: 'Tickets',
    path: '/tickets',
  },
  {
    label: 'Creer Ticket',
    path: '/frontoffice/create-ticket',
  },
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
    path: '/import',
    component: ImportPage,
    protected: true,
    title: 'Import'
  },
  {
    path: '/reset',
    component: ResetPage,
    protected: true,
    title: 'Réinitialisation'
  },
  {
    path: '/',
    component: DashboardPage,
    protected: true,
    title: 'Réinitialisation'
  },
  {
    path: '/tickets',
    component: TicketsPage,
    protected: true,
    title: 'Gestion des tickets'
  },
  {
    path: '/frontoffice/create-ticket',
    component: CreateTicketPage,
    protected: false,
    title: 'Creation de ticket'
  },
];

// Fonction utilitaire pour obtenir le titre d'une page
export const getPageTitle = (pathname) => {
  const route = routesConfig.find(route => route.path === pathname);
  return route?.title || 'GLPI Backoffice';
};