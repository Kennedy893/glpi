# Guide de Référence Ultime : JavaScript & React

Bienvenue dans ce guide de référence complet conçu pour vous aider à retrouver rapidement n'importe quelle syntaxe ou fonction en JavaScript moderne (ES6+) et React.

---

## 1. JavaScript Moderne (ES6+)

### Variables & Portée
```javascript
const name = "GLPI-React"; // Valeur constante (ne peut pas être réassignée)
let counter = 0;           // Portée de bloc (réassignable)

// ❌ Évitez d'utiliser 'var' (portée de fonction, remonte en haut de la portée)
```

### Fonctions Fléchées (Arrow Functions)
```javascript
// Syntaxe standard
const add = (a, b) => {
  return a + b;
};

// Retour implicite (sans accolades ni mot-clé return)
const multiply = (a, b) => a * b;

// Avec un seul paramètre (parenthèses optionnelles)
const square = x => x * x;
```

### Raccourcis d'Objets & Propriétés Dynamiques
```javascript
const role = "Admin";
const age = 30;

// Propriétés abrégées (Shorthand properties)
const user = { role, age }; // Équivaut à { role: role, age: age }

// Clés dynamiques (Computed property names)
const keyName = "status";
const dynamicObj = {
  [keyName]: "active" // Équivaut à { status: "active" }
};
```

### Destructuration (Destructuring)
```javascript
// --- Objets ---
const person = { firstName: "John", lastName: "Doe", address: { city: "Paris" } };
const { firstName, lastName, address: { city } } = person;
// Valeur par défaut si indéfini
const { country = "France" } = person;

// --- Tableaux ---
const rgb = [255, 120, 0];
const [r, g, b] = rgb;
```

### Opérateurs Spread (`...`) & Rest
```javascript
// --- Spread (Copie et fusion) ---
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

const obj1 = { name: "Alice", role: "User" };
const obj2 = { ...obj1, role: "Admin", age: 25 }; // { name: "Alice", role: "Admin", age: 25 }

// --- Rest (Collecte le reste des éléments) ---
const [first, ...others] = [10, 20, 30, 40]; // first = 10, others = [20, 30, 40]
const { age: userAge, ...restOfUser } = obj2;
```

### Opérateurs Logiques Modernes
```javascript
// Optionnel Chaining (?.) - Évite les erreurs "Cannot read property of undefined"
const zipCode = user?.address?.zipCode; // Retourne undefined au lieu de lever une erreur

// Coalescence Nulle (??) - Renvoie l'opérande de droite uniquement si la gauche est null ou undefined
const displayName = user.username ?? "Invité"; // Utile par rapport à || qui exclut 0 ou ""
```

---

## 2. Méthodes de Tableaux JavaScript (Cruciales pour React)

| Méthode | Rôle | Exemple |
| :--- | :--- | :--- |
| **`.map()`** | Transforme chaque élément d'un tableau et retourne un nouveau tableau. (Utilisé pour afficher des listes JSX). | `items.map(item => <li key={item.id}>{item.name}</li>)` |
| **`.filter()`** | Filtre les éléments selon une condition et retourne un nouveau tableau. (Utilisé pour supprimer/filtrer des données). | `const active = users.filter(u => u.status === 'active')` |
| **`.reduce()`** | Réduit le tableau à une seule valeur (ex: somme). | `const total = items.reduce((acc, curr) => acc + curr.price, 0)` |
| **`.find()`** | Renvoie le **premier** élément qui valide la condition (ou `undefined`). | `const user = users.find(u => u.id === 42)` |
| **`.findIndex()`** | Renvoie l'index du premier élément qui valide la condition (ou `-1`). | `const index = users.findIndex(u => u.id === 42)` |
| **`.some()`** | Retourne `true` si **au moins un** élément valide la condition. | `const hasAdmin = users.some(u => u.role === 'admin')` |
| **`.every()`** | Retourne `true` si **tous** les éléments valident la condition. | `const allValid = inputs.every(i => i.isValid)` |
| **`.includes()`**| Vérifie si une valeur est présente dans le tableau. | `const isAllowed = ['admin', 'manager'].includes(userRole)` |

---

## 3. Asynchronisme (Promises, Async/Await)

```javascript
// Syntaxe avec Async/Await et gestion d'erreurs
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur réseau");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur détectée :", error);
  }
};
```

---
---

## 4. Les Fondations de React

### Structure d'un Composant Fonctionnel
```jsx
import React from 'react';

function MyComponent({ title, children }) {
  // 1. Déclarations de Hooks (toujours au premier niveau)
  // 2. Fonctions internes / Gestionnaires d'événements
  const handleClick = (event) => {
    console.log("Cliqué !", event);
  };

  // 3. Rendu JSX
  return (
    <div className="card">
      <h1>{title}</h1>
      {children}
      <button onClick={handleClick}>Action</button>
    </div>
  );
}

export default MyComponent;
```

### Règles Fondamentales de JSX
1. **Un seul élément racine** : Utilisez un Fragment (`<> ... </>`) si nécessaire.
2. **Attributs HTML** : Utilisez `className` à la place de `class`, `htmlFor` à la place de `for`.
3. **CamelCase** : Les attributs comme `onClick`, `onChange`, `tabIndex` s'écrivent en camelCase.
4. **JavaScript dans JSX** : Tout code JavaScript doit être enveloppé dans des accolades `{}`.

### Rendu Conditionnel
```jsx
// 1. Opérateur logique && (Affichage conditionnel simple)
{isVisible && <Modal />}

// 2. Opérateur Ternaire (Alternative A / B)
{isLoggedIn ? <Dashboard /> : <LoginForm />}

// 3. Condition avec retour rapide (Early Return) dans le composant
if (isLoading) {
  return <Spinner />;
}
```

### Rendu de Listes (Obligation de la clé `key`)
```jsx
const items = [
  { id: 1, text: "Acheter du pain" },
  { id: 2, text: "Configurer GLPI" }
];

function TodoList() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
```

---

## 5. Guide Complet des React Hooks

### `useState` (Gestion de l'état local)
Permet de stocker et mettre à jour des valeurs dynamiques persistantes entre les rendus.
```jsx
import { useState } from 'react';

// Exemple de base
const [count, setCount] = useState(0);

// Mise à jour classique
setCount(count + 1);

// ⚠️ Si le nouvel état dépend de l'ancien état, utilisez une fonction de rappel (callback) :
setCount(prevCount => prevCount + 1);

// Mise à jour d'un objet (Pensez à utiliser le spread opérateur)
const [user, setUser] = useState({ name: "Alice", age: 25 });
setUser(prevUser => ({
  ...prevUser,
  age: prevUser.age + 1
}));
```

### `useEffect` (Effets Secondaires)
Permet d'exécuter du code suite au rendu du composant (appels API, abonnements, manipulation manuelle du DOM).
```jsx
import { useEffect } from 'react';

// Cas 1 : Exécuté à CHAQUE rendu du composant (Absence de tableau de dépendances)
useEffect(() => {
  console.log("Composant mis à jour");
});

// Cas 2 : Exécuté UNIQUEMENT au premier montage (Tableau de dépendances vide)
useEffect(() => {
  console.log("Composant monté !");
}, []);

// Cas 3 : Exécuté au montage ET quand les dépendances spécifiées changent
useEffect(() => {
  console.log(`Le compteur est maintenant : ${count}`);
}, [count]);

// Cas 4 : Avec nettoyage (Cleanup) (Exécuté au démontage du composant ou avant le prochain effet)
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', handleResize);

  return () => {
    // Nettoyage de l'événement pour éviter les fuites de mémoire
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

### `useContext` (Partage global d'état sans Prop Drilling)
Évite de faire passer des props sur plusieurs niveaux de composants intermédiaires.
```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Création du Context
const ThemeContext = createContext();

// 2. Composant Provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Consommation du Context dans un composant enfant
export function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Mode Actuel : {theme}
    </button>
  );
}
```

### `useRef` (Référence DOM et Persistance de valeurs)
Permet de pointer directement vers un nœud du DOM ou de stocker une valeur modifiable qui **ne déclenche pas** de nouveau rendu lorsqu'elle change.
```jsx
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);
  const clickCount = useRef(0); // Valeur persistante hors cycle de rendu

  const handleFocus = () => {
    // Accès direct à l'élément HTML input
    inputRef.current.focus();
    // Incrémentation silencieuse (ne provoque pas de re-render)
    clickCount.current += 1; 
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus sur le champ</button>
    </div>
  );
}
```

### `useMemo` & `useCallback` (Optimisation de performances)
- **`useMemo`** : Garde en mémoire le **résultat calculé** d'une fonction coûteuse.
- **`useCallback`** : Garde en mémoire la **référence d'une fonction** pour éviter de la recréer à chaque rendu.
```jsx
import { useMemo, useCallback } from 'react';

// --- useMemo ---
// Calcule 'expensiveResult' uniquement si 'items' change.
const expensiveResult = useMemo(() => {
  return items.filter(item => item.price > 100).reduce((a, b) => a + b.price, 0);
}, [items]);

// --- useCallback ---
// Garde la même référence de fonction tant que 'userId' reste identique.
// Utile pour passer des fonctions en props à des enfants mémoïsés (React.memo).
const handleDelete = useCallback((id) => {
  deleteUser(userId, id);
}, [userId]);
```

### `useReducer` (Alternative avancée à `useState`)
Recommandé pour gérer des états complexes avec de multiples transitions ou logiques métiers imbriquées.
```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return { count: 0 };
    default: throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Compte : {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

---

## 6. Gestion des Formulaires (Composants Contrôlés)

Le standard recommandé en React est de relier la valeur de chaque champ HTML à une variable d'état.
```jsx
import { useState } from 'react';

function FormExample() {
  const [formData, setFormData] = useState({
    username: '',
    role: 'user',
    subscribe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de page traditionnel
    console.log("Données soumises :", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="username" 
        value={formData.username} 
        onChange={handleChange} 
        placeholder="Nom d'utilisateur"
      />
      
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="user">Utilisateur</option>
        <option value="admin">Administrateur</option>
      </select>

      <label>
        <input 
          type="checkbox" 
          name="subscribe" 
          checked={formData.subscribe} 
          onChange={handleChange} 
        />
        S'abonner
      </label>

      <button type="submit">Enregistrer</button>
    </form>
  );
}
```

---

## 7. Créer son propre Hook Personnalisé (Custom Hook)

Permet de factoriser et de réutiliser une logique d'état complexe à travers plusieurs composants.
```jsx
import { useState, useEffect } from 'react';

// Hook personnalisé pour suivre la connectivité internet de l'utilisateur
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Utilisation dans n'importe quel composant :
// const isOnline = useOnlineStatus();
```

---

> [!TIP]
> **Règle d'or de React** : Ne modifiez jamais directement l'état (`state.push()`, `state.name = "X"`). Créez toujours une nouvelle copie de l'état en utilisant les fonctions de mise à jour (`setX`) et le destructuring/spread.
