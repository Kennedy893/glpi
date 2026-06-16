// config/routes.config.js
import { LoginPage } from '../pages/login/LoginPage';
import { TicketsPage } from '../pages/ticket/TicketsPage';
import { ImportPage } from '../pages/ImportPage';
import { ResetPage } from '../pages/ResetPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CreateTicketPage } from '../pages/ticket/CreateTicketPage';
import { AssetsPage } from '../pages/asset/AssetsPage';
import { KanbanPage } from '../pages/kanban/KanbanPage';
import { KanbanSettingsPage } from '../pages/kanban/KanbanSettingsPage';
import { SuperCostListPage } from '../pages/superCost/SuperCostListPage';
import { NewImportPage } from '../pages/NewImportPage';

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
    label: 'Parametrage',
    path: '/kanban-settings',
  },
  {
    label: 'Creer Ticket',
    path: '/frontoffice/create-ticket',
  },
  {
    label: 'Elements',
    path: '/frontoffice/liste-elements',
  },
  {
    label: 'Representation',
    path: '/frontoffice/kanban',
  },
  {
    label: 'Couts',
    path: '/frontoffice/couts',
  },

  {
    label: 'New Import',
    path: '/new-import',
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
    path: '/kanban-settings',
    component: KanbanSettingsPage,
    protected: true,
    title: 'Parametrage de Kanban'
  },
  {
    path: '/frontoffice/create-ticket',
    component: CreateTicketPage,
    protected: false,
    title: 'Creation de ticket'
  },
  {
    path: '/frontoffice/liste-elements',
    component: AssetsPage,
    protected: false,
    title: 'Liste des elements'
  },
  {
    path: '/frontoffice/kanban',
    component: KanbanPage,
    protected: false,
    title: 'Representation des tickets'
  },
  {
    path: '/frontoffice/couts',
    component: SuperCostListPage,
    protected: false,
    title: 'Representation des tickets'
  },
  {
    path: '/new-import',
    component: NewImportPage,
    protected: false,
    title: 'New import'
  },
];

// Fonction utilitaire pour obtenir le titre d'une page
export const getPageTitle = (pathname) => {
  const route = routesConfig.find(route => route.path === pathname);
  return route?.title || 'GLPI Backoffice';
};