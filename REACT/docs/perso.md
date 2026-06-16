# Guide complet des syntaxes React.js

## Sommaire
1. [Sommes (Sum)](#1-sommes-sum)
2. [Boucles (Loops)](#2-boucles-loops)
3. [Filtres (Filters)](#3-filtres-filters)
4. [Opérations combinées](#4-opérations-combinées-filter--map--reduce)
5. [Exemples pratiques complets](#5-exemples-pratiques-complets)
6. [Tableau de référence rapide](#6-tableau-de-référence-rapide)
7. [Bonnes pratiques](#7-bonnes-pratiques)

---

## 1. SOMMES (Sum)

### Somme simple dans un composant
\`\`\`jsx
function CartTotal({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <h3>Total: ${total}</h3>
    </div>
  );
}
\`\`\`

### Somme avec quantité
\`\`\`jsx
function ShoppingCart() {
  const cartItems = [
    { id: 1, name: 'Laptop', price: 999, quantity: 1 },
    { id: 2, name: 'Mouse', price: 29, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 79, quantity: 1 }
  ];
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div>
      <p>Total articles: {totalItems}</p>
      <p>Total à payer: ${total}</p>
    </div>
  );
}
\`\`\`

### Somme conditionnelle
\`\`\`jsx
function FilteredTotal({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0));
  
  return (
    <div>
      <p>Revenus: +{totalIncome}€</p>
      <p>Dépenses: -{totalExpenses}€</p>
      <p>Solde: {totalIncome - totalExpenses}€</p>
    </div>
  );
}
\`\`\`

### Somme avec useMemo (optimisation)
\`\`\`jsx
function ProductList({ products }) {
  const totalValue = useMemo(() => {
    console.log('Calcul du total...');
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);
  
  return <div>Valeur totale du stock: ${totalValue}</div>;
}
\`\`\`

### Somme de propriétés imbriquées
\`\`\`jsx
function NestedSum({ orders }) {
  const total = orders.reduce((sum, order) => {
    const orderTotal = order.items.reduce((itemSum, item) => 
      itemSum + (item.price * item.quantity), 0);
    return sum + orderTotal;
  }, 0);
  
  return <div>Total général: ${total}</div>;
}
\`\`\`

---

## 2. BOUCLES (Loops)

### Boucle avec map (le plus courant)
\`\`\`jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Boucle avec for traditionnelle
\`\`\`jsx
function NumberList({ max }) {
  const numbers = [];
  for (let i = 1; i <= max; i++) {
    numbers.push(i);
  }
  
  return (
    <div>
      {numbers.map(num => (
        <span key={num}>{num} </span>
      ))}
    </div>
  );
}
\`\`\`

### Boucle avec while
\`\`\`jsx
function Fibonacci({ count }) {
  const fibNumbers = [];
  let a = 0, b = 1;
  let i = 0;
  
  while (i < count) {
    fibNumbers.push(a);
    [a, b] = [b, a + b];
    i++;
  }
  
  return (
    <div>
      {fibNumbers.map((num, index) => (
        <span key={index}>{num} </span>
      ))}
    </div>
  );
}
\`\`\`

### Boucle for...of
\`\`\`jsx
function ProcessData({ data }) {
  const processed = [];
  
  for (const item of data) {
    if (item.active) {
      processed.push({
        ...item,
        displayName: item.name.toUpperCase()
      });
    }
  }
  
  return (
    <div>
      {processed.map(item => (
        <div key={item.id}>{item.displayName}</div>
      ))}
    </div>
  );
}
\`\`\`

### Boucle avec index
\`\`\`jsx
function NumberedList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={item.id}>
          {index + 1}. {item.name}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Boucle conditionnelle avec slice
\`\`\`jsx
function PaginatedList({ items, page = 1, itemsPerPage = 10 }) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  return (
    <div>
      {currentItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
\`\`\`

---

## 3. FILTRES (Filters)

### Filtre simple
\`\`\`jsx
function ActiveUsers({ users }) {
  const activeUsers = users.filter(user => user.active === true);
  
  return (
    <div>
      <h3>Utilisateurs actifs ({activeUsers.length})</h3>
      {activeUsers.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
\`\`\`

### Filtre avec état (recherche)
\`\`\`jsx
function SearchableList({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
\`\`\`

### Filtre multiple
\`\`\`jsx
function FilteredProducts({ products }) {
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const filteredProducts = products.filter(product => {
    if (category !== 'all' && product.category !== category) return false;
    if (product.price < minPrice || product.price > maxPrice) return false;
    if (inStockOnly && !product.inStock) return false;
    return true;
  });
  
  return (
    <div>
      {filteredProducts.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Filtre avec recherche sur plusieurs champs
\`\`\`jsx
function GlobalSearch({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  return (
    <div>
      <input
        type="text"
        placeholder="Recherche globale..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredItems.map(item => (
        <div key={item.id}>
          {item.name} - {item.description} - {item.category}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Filtre avec debounce (optimisation)
\`\`\`jsx
import { debounce } from 'lodash';

function DebouncedSearch({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  
  const debouncedSearch = useMemo(
    () => debounce((term) => {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredItems(filtered);
    }, 300),
    [items]
  );
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };
  
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Recherche avec debounce..."
      />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
\`\`\`

---

## 4. OPÉRATIONS COMBINÉES (Filter + Map + Reduce)

### Chaînage d'opérations
\`\`\`jsx
function SalesReport({ transactions }) {
  const stats = useMemo(() => {
    const recentTransactions = transactions.filter(t => 
      new Date(t.date) > new Date('2024-01-01')
    );
    
    const successfulSales = recentTransactions.filter(t => 
      t.status === 'completed'
    );
    
    const total = successfulSales.reduce((sum, t) => sum + t.amount, 0);
    
    const byCategory = successfulSales.reduce((acc, t) => {
      if (!acc[t.category]) acc[t.category] = 0;
      acc[t.category] += t.amount;
      return acc;
    }, {});
    
    const categoryList = Object.entries(byCategory).map(([cat, amount]) => ({
      category: cat,
      amount: amount,
      percentage: (amount / total) * 100
    }));
    
    return { total, categoryList, count: successfulSales.length };
  }, [transactions]);
  
  return (
    <div>
      <p>Total: ${stats.total}</p>
      <p>Nombre de ventes: {stats.count}</p>
      {stats.categoryList.map(cat => (
        <div key={cat.category}>
          {cat.category}: ${cat.amount} ({cat.percentage.toFixed(1)}%)
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Filter + Map pour transformation
\`\`\`jsx
function ActiveProductsList({ products }) {
  const activeProducts = products
    .filter(product => product.active && product.stock > 0)
    .map(product => ({
      ...product,
      displayPrice: `\${product.price.toFixed(2)}`,
      inStock: product.stock > 10 ? 'En stock' : 'Stock limité'
    }));
  
  return (
    <div>
      {activeProducts.map(product => (
        <div key={product.id}>
          {product.name} - {product.displayPrice} - {product.inStock}
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Reduce pour grouper des données
\`\`\`jsx
function GroupedOrders({ orders }) {
  const groupedOrders = orders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString('default', { month: 'long' });
    
    if (!acc[month]) {
      acc[month] = {
        month,
        count: 0,
        total: 0,
        orders: []
      };
    }
    
    acc[month].count++;
    acc[month].total += order.amount;
    acc[month].orders.push(order);
    
    return acc;
  }, {});
  
  return (
    <div>
      {Object.values(groupedOrders).map(group => (
        <div key={group.month}>
          <h3>{group.month}</h3>
          <p>Commandes: {group.count}</p>
          <p>Total: ${group.total}</p>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Map + Sort pour trier avant affichage
\`\`\`jsx
function SortedList({ items }) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;
    if (a[sortBy] < b[sortBy]) comparison = -1;
    if (a[sortBy] > b[sortBy]) comparison = 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return (
    <div>
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Trier {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
      {sortedItems.map(item => (
        <div key={item.id}>
          {item.name} - {item.price}€
        </div>
      ))}
    </div>
  );
}
\`\`\`

### Find + Some + Every pour vérifications
\`\`\`jsx
function OrderValidator({ order }) {
  const hasExpensiveItem = order.items.some(item => item.price > 1000);
  const allItemsInStock = order.items.every(item => item.stock > 0);
  const premiumItem = order.items.find(item => item.isPremium);
  
  return (
    <div>
      {hasExpensiveItem && <p>⚠️ Article de luxe détecté</p>}
      {!allItemsInStock && <p>❌ Certains articles sont en rupture</p>}
      {premiumItem && <p>⭐ Article premium: {premiumItem.name}</p>}
    </div>
  );
}
\`\`\`

---

## 5. EXEMPLES PRATIQUES COMPLETS

### Panier d'achat avec toutes les opérations
\`\`\`jsx
function ShoppingCartComplete() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Produit A', price: 10, quantity: 2 },
    { id: 2, name: 'Produit B', price: 25, quantity: 1 },
    { id: 3, name: 'Produit C', price: 15, quantity: 3 }
  ]);
  
  const [discountCode, setDiscountCode] = useState('');
  const [taxRate] = useState(0.2);
  
  // Calculs avec reduce
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Filtre pour trouver les articles en promotion
  const promoItems = cart.filter(item => item.price > 20);
  
  // Map pour appliquer une réduction
  const discountedCart = cart.map(item => ({
    ...item,
    discountedPrice: item.price * 0.9
  }));
  
  // Find pour trouver un article spécifique
  const expensiveItem = cart.find(item => item.price > 30);
  
  // Some pour vérifier si condition remplie
  const hasExpensiveItem = cart.some(item => item.price > 30);
  
  // Every pour vérifier si tous les articles sont en stock
  const allInStock = cart.every(item => item.quantity > 0);
  
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  
  const updateQuantity = (id, newQuantity) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(item => item.quantity > 0));
  };
  
  return (
    <div>
      <h2>Mon Panier ({totalItems} articles)</h2>
      
      {cart.map(item => (
        <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <h3>{item.name}</h3>
          <p>Prix unitaire: ${item.price}</p>
          <p>Quantité: {item.quantity}</p>
          <p>Sous-total: ${item.price * item.quantity}</p>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>
      ))}
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Récapitulatif</h3>
        <p>Sous-total: ${subtotal.toFixed(2)}</p>
        <p>TVA (20%): ${tax.toFixed(2)}</p>
        <p><strong>Total TTC: ${total.toFixed(2)}</strong></p>
        
        {hasExpensiveItem && (
          <p>🎉 Vous avez un article premium dans votre panier!</p>
        )}
        
        {promoItems.length > 0 && (
          <div>
            <p>Articles éligibles à la promotion:</p>
            {promoItems.map(item => (
              <span key={item.id}>{item.name} </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
\`\`\`

### Dashboard avec statistiques
\`\`\`jsx
function Dashboard({ orders }) {
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
    const averageOrder = totalRevenue / totalOrders;
    
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
    
    const customerSpending = orders.reduce((acc, order) => {
      acc[order.customerId] = (acc[order.customerId] || 0) + order.amount;
      return acc;
    }, {});
    
    const topCustomers = Object.entries(customerSpending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([id, amount]) => ({ id, amount }));
    
    const salesByMonth = orders.reduce((acc, order) => {
      const month = new Date(order.date).getMonth();
      acc[month] = (acc[month] || 0) + order.amount;
      return acc;
    }, {});
    
    return {
      totalOrders,
      totalRevenue,
      averageOrder,
      statusCount,
      topCustomers,
      salesByMonth
    };
  }, [orders]);
  
  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="stats">
        <div>Total Commandes: {stats.totalOrders}</div>
        <div>CA Total: ${stats.totalRevenue.toFixed(2)}</div>
        <div>Panier Moyen: ${stats.averageOrder.toFixed(2)}</div>
      </div>
      
      <div className="status-breakdown">
        <h3>Par statut</h3>
        {Object.entries(stats.statusCount).map(([status, count]) => (
          <div key={status}>
            {status}: {count} ({((count/stats.totalOrders)*100).toFixed(1)}%)
          </div>
        ))}
      </div>
      
      <div className="top-customers">
        <h3>Top Clients</h3>
        {stats.topCustomers.map((customer, index) => (
          <div key={index}>
            #{index + 1} - Client {customer.id}: ${customer.amount}
          </div>
        ))}
      </div>
      
      <div className="monthly-sales">
        <h3>Ventes mensuelles</h3>
        {Object.entries(stats.salesByMonth).map(([month, amount]) => (
          <div key={month}>
            Mois {parseInt(month) + 1}: ${amount.toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

---

## 6. TABLEAU DE RÉFÉRENCE RAPIDE

| Opération | Méthode | Exemple |
|-----------|---------|---------|
| **Somme** | `reduce()` | `items.reduce((sum, i) => sum + i.price, 0)` |
| **Boucle** | `map()` | `items.map(item => <div>{item.name}</div>)` |
| **Filtre** | `filter()` | `items.filter(i => i.active)` |
| **Recherche** | `find()` | `items.find(i => i.id === 5)` |
| **Vérification** | `some()` | `items.some(i => i.price > 100)` |
| **Validation totale** | `every()` | `items.every(i => i.inStock)` |
| **Comptage** | `reduce()` ou `filter().length` | `items.filter(i => i.active).length` |
| **Groupement** | `reduce()` | `items.reduce((acc, i) => {...}, {})` |
| **Transformation** | `map()` | `items.map(i => ({...i, newProp: value}))` |
| **Tri** | `sort()` | `[...items].sort((a,b) => a.price - b.price)` |
| **Suppression** | `filter()` | `items.filter(i => i.id !== idToRemove)` |
| **Extraction valeurs** | `map()` | `items.map(i => i.name)` |
| **Concaténation** | `reduce()` | `items.reduce((acc, i) => acc + i.name + ', ', '')` |
| **Vérification existance** | `includes()` | `items.map(i => i.id).includes(id)` |

---

## 7. BONNES PRATIQUES

### À ÉVITER
\`\`\`jsx
// ❌ Calcul dans le rendu = mauvaise performance
function BadExample({ data }) {
  return (
    <div>
      {data.map(item => {
        const total = data.reduce((sum, i) => sum + i.value, 0);
        return <div key={item.id}>{item.value / total * 100}%</div>;
      })}
    </div>
  );
}

// ❌ Mutation directe du state
function BadUpdate({ items }) {
  const updateItem = (id, newValue) => {
    items.find(item => item.id === id).value = newValue; // ❌ Mutation!
    setItems(items);
  };
}

// ❌ Index comme key (quand les éléments peuvent changer)
function BadKey({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item.name}</div> // ❌ Problème si réordonnancement
      ))}
    </div>
  );
}
\`\`\`

### À PRÉFÉRER
\`\`\`jsx
// ✅ Calcul en dehors du map
function GoodExample({ data }) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          {((item.value / total) * 100).toFixed(1)}%
        </div>
      ))}
    </div>
  );
}

// ✅ Immutabilité
function GoodUpdate({ items }) {
  const updateItem = (id, newValue) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, value: newValue } : item
    ));
  };
}

// ✅ ID unique comme key
function GoodKey({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

// ✅ Utiliser useMemo pour les calculs lourds
function OptimizedComponent({ largeDataset }) {
  const expensiveCalculations = useMemo(() => {
    return largeDataset
      .filter(item => item.active)
      .map(item => ({ ...item, total: item.price * item.quantity }))
      .reduce((acc, item) => acc + item.total, 0);
  }, [largeDataset]);
  
  return <div>Total: {expensiveCalculations}</div>;
}

// ✅ Utiliser useCallback pour les fonctions de filtrage
function SearchComponent({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterItems = useCallback((term) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [items]);
  
  const filteredItems = useMemo(() => {
    return filterItems(searchTerm);
  }, [filterItems, searchTerm]);
  
  return (
    <div>
      <input onChange={(e) => setSearchTerm(e.target.value)} />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
\`\`\`

### Règles d'or
1. **Toujours utiliser `key` unique** dans les listes
2. **Éviter les index comme key** quand la liste peut changer
3. **Filtrer avant de mapper** pour de meilleures performances
4. **Utiliser `useMemo`** pour les transformations coûteuses
5. **Ne pas muter l'état** - créer toujours de nouveaux tableaux
6. **Extraire les composants** pour les listes complexes
7. **Calculer en dehors du JSX** les opérations lourdes

---

## Résumé des méthodes essentielles

\`\`\`jsx
// Reduce - pour accumuler des valeurs
const sum = array.reduce((acc, curr) => acc + curr, 0);
const grouped = array.reduce((acc, item) => {
  acc[item.category] = [...(acc[item.category] || []), item];
  return acc;
}, {});

// Map - pour transformer chaque élément
const doubled = array.map(x => x * 2);
const elements = array.map(item => <Component key={item.id} data={item} />);

// Filter - pour sélectionner des éléments
const filtered = array.filter(item => item.active);
const withoutItem = array.filter(item => item.id !== idToRemove);

// Find - pour trouver un élément
const found = array.find(item => item.id === targetId);

// Some/Every - pour vérifier des conditions
const hasActive = array.some(item => item.active);
const allValid = array.every(item => item.isValid);

// Sort - pour trier (créer une copie d'abord!)
const sorted = [...array].sort((a, b) => a.value - b.value);
\`\`\`

---

## Fin du guide

Ce guide couvre les cas d'utilisation les plus courants pour manipuler des données dans React. La clé est de faire les calculs **avant** le rendu (dans des variables ou avec `useMemo`) plutôt qu'à l'intérieur du JSX quand c'est complexe.