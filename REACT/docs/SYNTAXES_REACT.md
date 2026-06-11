# Guide React.js - Toutes les syntaxes utilisees dans ce projet

Ce document est un pense-bete complet pour coder sans IA sur ce projet.
Objectif: te donner les patterns reels deja utilises dans le code, avec explication et exemples pret a reutiliser.

---

## 1) Stack et dependances React du projet

Projet base sur:
- React 19
- Vite
- React Router DOM
- Recharts (graphiques)
- API PrestaShop via fetch

Commandes utiles:

```bash
npm run dev
npm run build
npm run preview
```

---

## 2) Structure React du projet

Points d entree et architecture:
- `src/main.jsx`: monte l application React avec `ReactDOM.createRoot(...)`
- `src/App.jsx`: enveloppe l app avec `Router`, `AuthProvider`, `CartProvider`
- `src/config/RouteConfig.jsx`: genere les routes a partir de `routes.config.js`
- `src/context/*`: gestion etat global (auth, panier)
- `src/hooks/*`: hooks metier reutilisables
- `src/services/*`: appels API et transformation des donnees
- `src/components/*`: composants UI
- `src/pages/*`: pages routees

---

## 3) Syntaxe composant React (fonctionnel)

Pattern principal du projet:

```jsx
import React from 'react';

export default function MonComposant({ title }) {
  return <h1>{title}</h1>;
}
```

Idees cle:
- Un composant est une fonction JS qui retourne du JSX.
- Les props arrivent en parametre.
- Toujours exporter pour reutiliser ailleurs.

---

## 4) JSX: les bases que tu utilises deja

### 4.1 Interpolation de variable

```jsx
<p>{products.length} produits</p>
```

### 4.2 Conditionnel dans le JSX

```jsx
{loading && <Loader />}
{error && <div>{error}</div>}
{!loading && !error && <ProductList products={filteredProducts} />}
```

### 4.3 Ternaire

```jsx
<button>{isLoading ? 'Connexion en cours...' : 'Se connecter'}</button>
```

### 4.4 Classe CSS dynamique simple

```jsx
<div className={isActive ? 'card active' : 'card'}>...</div>
```

---

## 5) useState (etat local)

Utilise partout pour stocker des valeurs d interface:

```jsx
const [email, setEmail] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [products, setProducts] = useState([]);
```

Regles:
- Lecture: `email`
- Ecriture: `setEmail(...)`
- Le setter declenche un re-render.

Mise a jour basee sur l etat precedent (important):

```jsx
setCart((prevCart) => [...prevCart, newItem]);
```

---

## 6) useEffect (effets de bord)

Pattern courant pour charger des donnees au montage:

```jsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      const data = await fetchProductsWithImages(1000);
      if (!cancelled) setProducts(data);
    } catch (err) {
      if (!cancelled) setError(err.message || String(err));
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => {
    cancelled = true;
  };
}, []);
```

Ce que fait ce pattern:
- Evite de `setState` apres un unmount.
- Evite des warnings et bugs asynchrones.

---

## 7) useMemo (memoisation)

Utilise pour eviter de recalculer un filtrage couteux a chaque render.

```jsx
const filteredProducts = useMemo(() => {
  const name = String(qName || '').trim().toLowerCase();
  return products.filter((p) => {
    if (name && !String(p.name || '').toLowerCase().includes(name)) return false;
    return true;
  });
}, [products, qName]);
```

Quand l utiliser:
- Filtre/tri/reduce potentiellement lourd
- Dependances claires

---

## 8) useCallback (memoiser une fonction)

Tres utilise dans `CartContext` et hooks statistiques.

```jsx
const fetchStatistics = useCallback(async () => {
  setLoading(true);
  try {
    const stats = await getSalesStatistics(startDate, endDate);
    setData(stats);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, [startDate, endDate]);
```

Pourquoi:
- Garde la meme reference de fonction
- Evite certains rerenders inutiles
- Pratique quand une fonction est dependance d un `useEffect`

---

## 9) useRef (memoire mutable sans rerender)

Exemple present dans le projet pour detecter transition auth:

```jsx
const prevFrontAuthRef = useRef(frontofficeAuthenticated);

useEffect(() => {
  const prev = prevFrontAuthRef.current;
  if (prev === true && !frontofficeAuthenticated) {
    setCart([]);
  }
  prevFrontAuthRef.current = frontofficeAuthenticated;
}, [frontofficeAuthenticated]);
```

---

## 10) Context API (etat global)

### 10.1 Creer un contexte

```jsx
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 10.2 Hook perso pour consommer le contexte

```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider');
  }
  return context;
};
```

---

## 11) Routing React Router

### 11.1 Router global

`App.jsx` utilise:

```jsx
<Router>
  <AuthProvider>
    <CartProvider>
      <RouteConfig />
    </CartProvider>
  </AuthProvider>
</Router>
```

### 11.2 Routes dynamiques avec config

`RouteConfig.jsx` utilise une boucle `map`:

```jsx
<Routes>
  {routesConfig.map((route, index) => {
    const RouteComponent = route.component;

    if (route.protected) {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute scope={route.scope} redirectTo={route.redirectTo}>
              <RouteComponent />
            </ProtectedRoute>
          }
        />
      );
    }

    return <Route key={index} path={route.path} element={<RouteComponent />} />;
  })}
</Routes>
```

### 11.3 Navigation

- `useNavigate` pour naviguer en JS
- `Link` pour naviguer en JSX
- `Navigate` pour redirection automatique
- `useParams` pour lire `:id`

Exemple:

```jsx
const navigate = useNavigate();
<button onClick={() => navigate('/backoffice/dashboard')}>Go</button>
```

---

## 12) Route protegee

Pattern du projet:

```jsx
export const ProtectedRoute = ({ children, scope = 'backoffice', redirectTo }) => {
  const { isAuthenticated, frontofficeAuthenticated, loading } = useAuth();
  const isAllowed = scope === 'frontoffice' ? frontofficeAuthenticated : isAuthenticated;

  if (loading) return <div>Chargement...</div>;
  if (!isAllowed) return <Navigate to={redirectTo || '/backoffice/login'} replace />;
  return children;
};
```

---

## 13) Formulaires controles

Pattern principal (login):

```jsx
const [email, setEmail] = useState('');

<form onSubmit={handleSubmit}>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</form>
```

Handler submit asynchrone:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const result = await login(email, password);
    if (result.success) navigate('/backoffice/dashboard');
  } finally {
    setIsLoading(false);
  }
};
```

---

## 14) Appels API (fetch + async/await)

Pattern standard du projet:

```jsx
async function fetchData() {
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeader(),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }

  const text = await response.text();
  return text;
}
```

Pattern auth header PrestaShop:

```jsx
function getAuthHeader() {
  const encoded = btoa((WS_KEY || '') + ':');
  return { Authorization: `Basic ${encoded}` };
}
```

---

## 15) Variables d environnement Vite

Syntaxe du projet:

```jsx
const BASE_URL = import.meta.env.VITE_PS_BASE_URL;
const WS_KEY = import.meta.env.VITE_WS_KEY;
```

Regle:
- Les variables exposees au front doivent commencer par `VITE_`.

---

## 16) Storage navigateur

### 16.1 sessionStorage (auth)

```jsx
sessionStorage.setItem('newapp.backoffice.auth', JSON.stringify(user));
const raw = sessionStorage.getItem('newapp.backoffice.auth');
const parsed = raw ? JSON.parse(raw) : null;
sessionStorage.removeItem('newapp.backoffice.auth');
```

### 16.2 localStorage (panier)

```jsx
localStorage.setItem('prestashop_cart', JSON.stringify(cart));
const saved = localStorage.getItem('prestashop_cart');
localStorage.removeItem('prestashop_cart');
```

---

## 17) Boucles et transformations (important)

Tu as plusieurs styles de boucle dans ce projet.

### 17.1 `map` (affichage liste)

```jsx
{categories.map((cat) => (
  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
))}
```

### 17.2 `filter` (filtrer des donnees)

```jsx
const validOrders = orders.filter((order) => VALID_ORDER_STATES.has(Number(order.current_state)));
```

### 17.3 `reduce` (agregation)

```jsx
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

### 17.4 `for` classique

```jsx
for (let i = 0; i < rows.length; i++) {
  // traitement
}
```

### 17.5 `for...of`

```jsx
for (const row of rows) {
  // traitement
}
```

### 17.6 `while`

```jsx
let keepReading = true;
while (keepReading) {
  const page = await fetchPage(offset, pageSize);
  if (page.length < pageSize) keepReading = false;
  else offset += pageSize;
}
```

### 17.7 `forEach`

```jsx
stockRows.forEach((row) => {
  // traitement
});
```

### 17.8 `Promise.all` (paralleliser)

```jsx
const [orders, products, categories] = await Promise.all([
  getOrdersByDateRange(startDate, endDate),
  fetchProductsWithImages(5000),
  fetchAllCategories(),
]);
```

---

## 18) Syntaxes JS modernes presentes dans le projet

### 18.1 Optional chaining

```jsx
const firstError = data?.errors?.[0] || '';
```

### 18.2 Nullish coalescing

```jsx
const safe = value ?? '';
```

### 18.3 Spread operator

```jsx
const payload = {
  id_cart: activeCartId,
  ...(opts.paymentConfirmed ? { current_state: 2 } : {}),
};
```

### 18.4 Template literals

```jsx
const url = `${BASE_URL}/products/${productId}`;
```

### 18.5 Destructuring

```jsx
const { summary, categories, loading, error } = useSalesStatistics(start, end);
```

### 18.6 Set et Map

```jsx
const uniqueIds = new Set(ids);
const productsById = new Map(products.map((p) => [Number(p.id), p]));
```

---

## 19) Construire un graphique de stats (Recharts)

Le projet utilise deja Recharts (`LineChart`, `BarChart`, `ResponsiveContainer`).

### 19.1 Etape 1: preparer les donnees

```jsx
const chartData = data.map((day) => ({
  date: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
  montant: Number(day.totalAmount.toFixed(2)),
  commandes: day.orderCount,
}));
```

### 19.2 Etape 2: creer le composant graphique

```jsx
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export default function StatsChart({ data }) {
  const chartData = data.map((day) => ({
    date: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    montant: Number(day.totalAmount.toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="montant" stroke="#FF9800" name="CA Total" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### 19.3 Variante histogramme (nombre de commandes)

```jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="commandes" fill="#4CAF50" />
  </BarChart>
</ResponsiveContainer>
```

Bonnes pratiques graphiques du projet:
- Toujours transformer les donnees en amont (`map`) avant render.
- Garder un container responsive.
- Utiliser un formatter de tooltip.
- Calculer les totaux via `reduce` hors JSX.

---

## 20) Exemple de hook personnalise complet

```jsx
import { useCallback, useEffect, useState } from 'react';
import { getSalesStatistics } from '../services/statisticsService';

export function useSalesStatistics(startDate, endDate) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({ summary: null, categories: [] });

  const fetchStatistics = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const statistics = await getSalesStatistics(startDate, endDate);
      setData(statistics);
    } catch (err) {
      setError(err.message || 'Erreur chargement stats');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { ...data, loading, error, refresh: fetchStatistics };
}
```

---

## 21) Pattern "page complete" (etat + hook + rendu)

Plan de travail fiable:
1. Definir `useState` pour filtres/date/loading/error.
2. Charger la data via hook custom.
3. Afficher un ecran de chargement.
4. Afficher les erreurs.
5. Afficher le contenu principal (tableaux, cartes, graphiques).

Ce pattern est celui de la page `StatisticsPage`.

---

## 22) Gestion erreurs et robustesse

Patterns importants deja utilises:
- `try/catch/finally` sur tous les appels reseau.
- Validation des donnees numeriques avec `Number.isFinite(...)`.
- Fallbacks defensifs (`||`, `??`).
- Nettoyage `useEffect` au unmount.
- `throw new Error(...)` explicite quand `response.ok` est faux.

---

## 23) Checklist rapide avant commit React

- Hook rules respectees (pas de hook dans les conditions/boucles).
- Chaque element de liste a une `key` stable.
- Les formulaires utilisent `value` + `onChange`.
- Les appels API verifient `response.ok`.
- Les ecrans loading/error sont geres.
- Les tableaux/graphes calculent la data en amont, pas dans un rendu confus.

---

## 24) References de code a relire dans ce projet

Fichiers cle pour apprendre vite:
- `src/App.jsx`
- `src/config/RouteConfig.jsx`
- `src/config/routes.config.js`
- `src/context/AuthContext.jsx`
- `src/context/CartContext.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/pages/frontoffice/ProductsPage.jsx`
- `src/pages/backoffice/BackofficeLogin.jsx`
- `src/pages/backoffice/StatisticsPage.jsx`
- `src/hooks/useSalesStatistics.js`
- `src/hooks/useStockAvailabilityStatistics.js`
- `src/components/dashboard/DailyRevenueChart.jsx`
- `src/components/dashboard/DailyOrdersChart.jsx`
- `src/services/statisticsService.js`

---

## 25) Mini anti-seche (copier-coller)

### Etat + chargement

```jsx
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState([]);
```

### Chargement API

```jsx
try {
  setLoading(true);
  setError(null);
  const result = await myApi();
  setData(result);
} catch (err) {
  setError(err.message || String(err));
} finally {
  setLoading(false);
}
```

### Rendu conditionnel

```jsx
if (loading) return <div>Chargement...</div>;
if (error) return <div>Erreur: {error}</div>;
return <div>OK</div>;
```

### Liste

```jsx
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

### Total

```jsx
const total = items.reduce((sum, item) => sum + item.value, 0);
```

---

## 26) Comment progresser vite sans IA

Routine conseillee:
1. Reprendre un composant existant proche de ton besoin.
2. Copier la structure (state/effect/render).
3. Renommer variables et service.
4. Tester apres chaque petite etape.
5. Ajouter logs temporaires si bug (`console.log`).
6. Supprimer logs avant commit.

Methode simple:
- D abord faire marcher.
- Ensuite nettoyer.
- Ensuite optimiser (`useMemo`, `useCallback`) seulement si necessaire.

---

Fin du guide.
