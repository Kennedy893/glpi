1. useState avec map pour initialiser l'état
function ProductManager() {
  // Initialisation d'un état avec map
  const [products, setProducts] = useState(() => {
    const initialProducts = [
      { id: 1, name: 'Laptop', price: 999, quantity: 0 },
      { id: 2, name: 'Mouse', price: 29, quantity: 0 },
      { id: 3, name: 'Keyboard', price: 79, quantity: 0 }
    ];
    
    // Ajouter un champ calculé à chaque produit
    return initialProducts.map(product => ({
      ...product,
      totalValue: product.price * product.quantity,
      inStock: product.quantity > 0
    }));
  });
  
  return <div>{/* Composant */}</div>;
}

2. useEffect avec map pour transformations de données
function DataProcessor({ rawData }) {
  const [processedData, setProcessedData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  useEffect(() => {
    // Transformation des données avec map
    const transformed = rawData.map(item => ({
      id: item.id,
      fullName: `${item.firstName} ${item.lastName}`.toUpperCase(),
      age: calculateAge(item.birthDate),
      category: item.score > 80 ? 'Premium' : 'Standard',
      // Calculs complexes
      score: Math.round(item.score * 100) / 100,
      isValid: validateItem(item)
    }));
     
    setProcessedData(transformed);
    
    // Calcul de statistiques en utilisant map
    const stats = {
      totalItems: transformed.length,
      averageScore: transformed.reduce((sum, item) => sum + item.score, 0) / transformed.length,
      categories: transformed.map(item => item.category),
      premiumCount: transformed.filter(item => item.category === 'Premium').length
    };
    
    setStatistics(stats);
  }, [rawData]);
  
  return <div>{/* Composant */}</div>;
}

3. useCallback avec map pour créer des fonctions de transformation
function SearchAndFilter() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  
  // Fonction de filtrage avec map
  const filterItems = useCallback((itemsToFilter, search, activeFilters) => {
    let filtered = [...itemsToFilter];
    
    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Appliquer les filtres actifs avec map pour transformer
    const filteredWithHighlights = filtered.map(item => ({
      ...item,
      highlight: search ? getHighlightPositions(item.name, search) : [],
      matchesFilters: Object.entries(activeFilters).every(([key, value]) => 
        item[key] === value
      )
    }));
    
    return filteredWithHighlights;
  }, []);
  
  // Mise à jour des résultats avec map
  const updateResults = useCallback(() => {
    const filtered = filterItems(items, searchTerm, filters);
    setFilteredResults(filtered);
    
    // Extraire les catégories uniques avec map
    const categories = [...new Set(filtered.map(item => item.category))];
    setAvailableCategories(categories);
    
    // Calculer les prix min/max avec map
    const prices = filtered.map(item => item.price);
    setPriceRange({
      min: Math.min(...prices),
      max: Math.max(...prices)
    });
  }, [items, searchTerm, filters, filterItems]);
  
  useEffect(() => {
    updateResults();
  }, [updateResults]);
  
  return <div>{/* Composant */}</div>;
}

5. Custom Hook avec map pour transformation de données
// Custom hook pour la gestion de collection
function useCollectionTransformer(initialData, transformFn) {
  const [data, setData] = useState(initialData);
  const [transformedData, setTransformedData] = useState([]);
  
  useEffect(() => {
    const transformed = data.map(transformFn);
    setTransformedData(transformed);
  }, [data, transformFn]);
  
  const addItem = (item) => {
    setData(prev => [...prev, item]);
  };
  
  const updateItem = (id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };
  
  const removeItems = (predicate) => {
    setData(prev => prev.filter(item => !predicate(item)));
  };
  
  const batchUpdate = (updates) => {
    setData(prev => prev.map(item => {
      const update = updates.find(u => u.id === item.id);
      return update ? { ...item, ...update.changes } : item;
    }));
  };
  
  return {
    data,
    transformedData,
    addItem,
    updateItem,
    removeItems,
    batchUpdate
  };
}

// Utilisation du custom hook
function UserManager() {
  const transformUser = (user) => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    displayName: user.username || `${user.firstName} ${user.lastName[0]}.`,
    isActive: user.status === 'active',
    lastLoginFormatted: user.lastLogin?.toLocaleDateString(),
    permissions: user.roles.map(role => role.permissions).flat()
  });
  
  const {
    transformedData: users,
    addItem,
    updateItem,
    batchUpdate
  } = useCollectionTransformer(initialUsers, transformUser);
  
  // Mise à jour groupée avec map
  const activateAllUsers = () => {
    batchUpdate(
      users.map(user => ({
        id: user.id,
        changes: { status: 'active', activatedAt: new Date() }
      }))
    );
  };
  
  return <div>{/* Composant */}</div>;
}

---------------------------------

// ✅ Pattern correct pour async
useEffect(() => {
  const fetchData = async () => {
    const data = await fetchData();
    console.log(data);
  };
  fetchData(); // ← Parenthèses d'exécution
}, []);

1. Cas simple avec argument fixe
useEffect(() => {
  const fetchData = async (userId) => {
    const data = await fetch(`/api/users/${userId}`);
    console.log(data);
  };
  
  fetchData(123); // ← Passage de l'argument ici
}, []);

