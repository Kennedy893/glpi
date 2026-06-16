# Encyclopédie JavaScript & React : Guide de Référence Complet (Style MDN)

Ce guide regroupe l'ensemble des fonctions utilitaires de JavaScript (manipulation de tableaux, d'objets, de chaînes, de dates) et les concepts clés de React, présentés avec des exemples clairs et pratiques.

---

## Sommaire
1. [Manipulation des Tableaux (Array)](#1-manipulation-des-tableaux-array)
2. [Recettes React : Manipulation Immuable du State](#2-recettes-react--manipulation-immuable-du-state)
3. [Manipulation des Objets (Object)](#3-manipulation-des-objets-object)
4. [Manipulation des Chaînes de Caractères (String)](#4-manipulation-des-chaines-de-caracteres-string)
5. [Nombres et Mathématiques (Number & Math)](#5-nombres-et-mathematiques-number--math)
6. [Manipulation des Dates (Date)](#6-manipulation-des-dates-date)
7. [React : Hooks et Cycles de Rendu](#7-react--hooks-et-cycles-de-rendu)
8. [Formulaires et Événements en React](#8-formulaires-et-evenements-en-react)

---

## 1. Manipulation des Tableaux (Array)

Voici les méthodes les plus utilisées pour transformer, filtrer et manipuler des listes de données.

### A. Transformer et Combiner (Non-Mutant)

#### `.map(callback)`
Crée un nouveau tableau en appliquant une fonction à chaque élément du tableau d'origine.
```javascript
const numbers = [1, 2, 3];
const doubles = numbers.map(x => x * 2); // [2, 4, 6]
```

#### `.filter(callback)`
Crée un nouveau tableau contenant uniquement les éléments qui valident la condition du callback.
```javascript
const ages = [12, 18, 22, 15];
const adults = ages.filter(age => age >= 18); // [18, 22]
```

#### `.reduce(callback, initialValue)`
Réduit les éléments d'un tableau à une seule valeur cumulative (nombre, objet, tableau).
```javascript
const cart = [{ price: 10 }, { price: 15 }, { price: 30 }];
const totalPrice = cart.reduce((accumulator, item) => accumulator + item.price, 0); // 55
```

#### `.flatMap(callback)`
Applique une transformation puis aplatit le résultat d'un niveau. Équivaut à `.map().flat(1)`.
```javascript
const sentences = ["Bonjour tout", "le monde"];
const words = sentences.flatMap(s => s.split(" ")); // ["Bonjour", "tout", "le", "monde"]
```

#### `.concat(array2)`
Fusionne deux ou plusieurs tableaux (alternative : opérateur spread `[...arr1, ...arr2]`).
```javascript
const letters = ['a', 'b'].concat(['c', 'd']); // ['a', 'b', 'c', 'd']
```

---

### B. Rechercher et Vérifier (Non-Mutant)

#### `.find(callback)`
Renvoie la valeur du **premier** élément trouvé dans le tableau qui respecte le callback, sinon `undefined`.
```javascript
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const bob = users.find(u => u.name === 'Bob'); // { id: 2, name: 'Bob' }
```

#### `.findIndex(callback)`
Renvoie l'index du **premier** élément trouvé, sinon `-1`.
```javascript
const index = users.findIndex(u => u.name === 'Bob'); // 1
```

#### `.includes(element)`
Détermine si un tableau contient une valeur spécifique (renvoie `true` ou `false`).
```javascript
const roleList = ['admin', 'manager', 'guest'];
const isAdmin = roleList.includes('admin'); // true
```

#### `.some(callback)`
Renvoie `true` si au moins **un** élément du tableau respecte la condition du callback.
```javascript
const hasAdmin = users.some(u => u.role === 'admin');
```

#### `.every(callback)`
Renvoie `true` si **tous** les éléments du tableau respectent la condition du callback.
```javascript
const allFieldsValid = inputs.every(input => input.isValid);
```

#### `.indexOf(element)`
Renvoie le premier index auquel on trouve un élément donné dans le tableau, sinon `-1`.
```javascript
const colors = ['red', 'blue', 'green'];
colors.indexOf('blue'); // 1
```

---

### C. Extraire et Découper (Non-Mutant)

#### `.slice(start, end)`
Renvoie une copie superficielle d'une portion d'un tableau.
* **`start`** : Index de départ (inclus). Si négatif, décalage à partir de la fin du tableau.
* **`end`** (optionnel) : Index de fin (exclu).

```javascript
const elements = ['A', 'B', 'C', 'D', 'E'];

// Extraction classique
elements.slice(1, 4); // ['B', 'C', 'D']

// Extraction des N derniers éléments (index négatif)
const lastThree = elements.slice(-3); // ['C', 'D', 'E']
```

#### `.at(index)`
Accède à un élément par son index. Supporte les indices négatifs pour compter à partir de la fin.
```javascript
const arr = [10, 20, 30, 40];
arr.at(-1); // 40 (équivalent de arr[arr.length - 1])
arr.at(-2); // 30
```

---

### D. Modifier, Trier et Inverser (⚠️ Modifient le tableau d'origine !)

> [!WARNING]
> Ces fonctions mutent le tableau en place. Pour les utiliser en React, vous devez d'abord cloner votre tableau (ex: `const clone = [...myArray]`).

#### `.sort(compareFunction)`
Trie les éléments d'un tableau.
* Sans fonction de tri, il convertit tout en chaînes et trie par ordre alphabétique (Unicode).
* **Tri de nombres** : `(a, b) => a - b` (croissant) ou `(b, a) => b - a` (décroissant).

```javascript
const numbers = [40, 1, 5, 200];
// Tri croissant
const sorted = [...numbers].sort((a, b) => a - b); // [1, 5, 40, 200]
```

#### `.reverse()`
Inverse l'ordre des éléments du tableau.
```javascript
const arr = [1, 2, 3];
const reversed = [...arr].reverse(); // [3, 2, 1]
```

#### `.splice(start, deleteCount, item1, item2, ...)`
Modifie le contenu d'un tableau en retirant, remplaçant ou ajoutant des éléments.
```javascript
const months = ['Jan', 'March', 'April'];
// Insère à l'index 1, supprime 0 élément, ajoute 'Feb'
months.splice(1, 0, 'Feb'); // ['Jan', 'Feb', 'March', 'April']
```

---

## 2. Recettes React : Manipulation Immuable du State

En React, le state est immuable. Voici comment réaliser les opérations courantes sans modifier directement vos variables d'état.

### ➕ Ajouter un élément (Insert)
```javascript
const [list, setList] = useState(['A', 'B']);

// Ajouter à la fin
setList(prev => [...prev, 'C']); // ['A', 'B', 'C']

// Ajouter au début
setList(prev => ['Z', ...prev]); // ['Z', 'A', 'B']

// Insérer à un index spécifique (ex: index 1)
const insertAtIndex = (index, newItem) => {
  setList(prev => [
    ...prev.slice(0, index),
    newItem,
    ...prev.slice(index)
  ]);
};
```

### ❌ Supprimer un élément (Delete)
```javascript
const [list, setList] = useState([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);

// Supprimer un élément par son identifiant unique (id)
const deleteItem = (id) => {
  setList(prev => prev.filter(item => item.id !== id));
};
```

### 🔄 Mettre à jour un élément (Update)
```javascript
const [list, setList] = useState([{ id: 1, checked: false }, { id: 2, checked: false }]);

// Basculer (toggle) la valeur d'une propriété d'un élément précis
const toggleItem = (id) => {
  setList(prev => prev.map(item => 
    item.id === id ? { ...item, checked: !item.checked } : item
  ));
};
```

---

## 3. Manipulation des Objets (Object)

#### `Object.keys(obj)`
Retourne un tableau contenant les clés (propriétés) de l'objet.
```javascript
const user = { name: 'Alice', age: 25 };
Object.keys(user); // ['name', 'age']
```

#### `Object.values(obj)`
Retourne un tableau contenant les valeurs de l'objet.
```javascript
Object.values(user); // ['Alice', 25]
```

#### `Object.entries(obj)`
Retourne un tableau de tableaux de paires clé/valeur `[clé, valeur]`.
```javascript
Object.entries(user); // [['name', 'Alice'], ['age', 25]]
```

#### `Object.fromEntries(iterable)`
Transforme une liste de paires clé/valeur en un objet (l'inverse de `Object.entries`).
```javascript
const entries = [['role', 'admin'], ['status', 'active']];
Object.fromEntries(entries); // { role: 'admin', status: 'active' }
```

#### `Object.assign(target, ...sources)`
Copie les valeurs de toutes les propriétés directes d'un ou plusieurs objets sources dans un objet cible (alternative : `{...target, ...sources}`).
```javascript
const target = { a: 1 };
const source = { b: 2 };
const newObj = Object.assign({}, target, source); // { a: 1, b: 2 }
```

#### Vérifier la présence d'une propriété : `Object.hasOwn(obj, prop)`
```javascript
const car = { make: 'Toyota' };
Object.hasOwn(car, 'make'); // true
Object.hasOwn(car, 'model'); // false
```

---

## 4. Manipulation des Chaînes de Caractères (String)

### Extraction de sous-chaînes
* **`.slice(start, end)`** : Extrait une section d'une chaîne et la retourne sans modifier la chaîne d'origine.
  ```javascript
  const str = "GLPI React Client";
  str.slice(5, 10); // "React"
  str.slice(-6); // "Client"
  ```
* **`.split(separator)`** : Divise une chaîne en un tableau de chaînes à partir d'un séparateur.
  ```javascript
  "pomme,banane,orange".split(","); // ["pomme", "banane", "orange"]
  ```

### Recherche et vérification
* **`.includes(searchString)`** : Vérifie si la chaîne contient la valeur recherchée (`true`/`false`).
  ```javascript
  "Hello World".includes("World"); // true
  ```
* **`.startsWith(searchString)`** et **`.endsWith(searchString)`** :
  ```javascript
  "https://localhost".startsWith("https"); // true
  ```
* **`.indexOf(searchValue)`** : Retourne l'index de la première occurrence, sinon `-1`.

### Nettoyage et Remplacement
* **`.trim()`** : Supprime les espaces blancs aux deux extrémités de la chaîne.
  ```javascript
  "  hello  ".trim(); // "hello"
  ```
* **`.toLowerCase()`** et **`.toUpperCase()`** : Convertit en minuscules / majuscules.
* **`.replace(pattern, replacement)`** : Remplace la première occurrence.
* **`.replaceAll(pattern, replacement)`** : Remplace toutes les occurrences.
  ```javascript
  "01-02-2026".replaceAll("-", "/"); // "01/02/2026"
  ```

### Remplissage (Padding)
* **`.padStart(targetLength, padString)`** : Remplit la chaîne au début pour atteindre la longueur ciblée (pratique pour formater des nombres comme des heures ou des dates).
  ```javascript
  "5".padStart(2, "0"); // "05" (Heure : 05h)
  ```

---

## 5. Nombres et Mathématiques (Number & Math)

### Conversion et Analyse (Parsing)
```javascript
// Conversion forcée (Renvoie NaN si invalide)
Number("123"); // 123
Number("12.3"); // 12.3
Number("abc"); // NaN

// Analyse d'entier et flottant (s'arrête au premier caractère non numérique valide)
parseInt("42px", 10); // 42 (base 10)
parseFloat("3.14m"); // 3.14

// Vérification de NaN
Number.isNaN(NaN); // true
Number.isNaN(42); // false
```

### Formatage des Nombres
* **`.toFixed(digits)`** : Formate un nombre en notation fixe (renvoie une **chaîne de caractères** avec le nombre de décimales demandé).
  ```javascript
  const price = 42.897;
  price.toFixed(2); // "42.90"
  ```
* **`Intl.NumberFormat`** : Formate en fonction de la langue locale (monnaie, pourcentages).
  ```javascript
  const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  formatter.format(2500); // "2 500,00 €"
  ```

### Utilitaires Math
* **`Math.round(x)`** : Arrondit à l'entier le plus proche.
* **`Math.floor(x)`** : Arrondit à l'entier inférieur.
* **`Math.ceil(x)`** : Arrondit à l'entier supérieur.
* **`Math.abs(x)`** : Retourne la valeur absolue.
* **`Math.min(a, b, ...)`** / **`Math.max(a, b, ...)`** : Retourne le plus petit / grand nombre.
  ```javascript
  const values = [5, 12, 1, 9];
  Math.max(...values); // 12 (avec l'opérateur spread)
  ```
* **`Math.random()`** : Génère un nombre décimal aléatoire entre 0 (inclus) et 1 (exclu).
  ```javascript
  // Générer un entier entre 'min' et 'max' (inclus)
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  ```

---

## 6. Manipulation des Dates (Date)

### Initialiser une Date
```javascript
const now = new Date(); // Date et heure actuelles
const specificDate = new Date("2026-06-15T10:00:00Z"); // ISO String
const timestampDate = new Date(1771027200000); // Timestamp en millisecondes
```

### Méthodes d'Instance indispensables
```javascript
const d = new Date("2026-06-15T14:30:00");

d.getFullYear(); // 2026
d.getMonth();    // 5 (Attention : les mois vont de 0 à 11. 0 = Janvier, 5 = Juin)
d.getDate();     // 15 (Jour du mois)
d.getDay();      // 1 (Jour de la semaine. 0 = Dimanche, 1 = Lundi, etc.)
d.getHours();    // 14
d.getMinutes();  // 30
d.getTime();     // 1781523000000 (Timestamp en millisecondes, idéal pour comparer deux dates)
```

### Formatage localisé (Sans dépendance externe)
```javascript
const d = new Date("2026-06-15T12:00:00");

// Format Date standard (JJ/MM/AAAA)
d.toLocaleDateString("fr-FR"); // "15/06/2026"

// Format complet personnalisé
d.toLocaleDateString("fr-FR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric"
}); // "lundi 15 juin 2026"

// Format Heure (HH:MM:SS)
d.toLocaleTimeString("fr-FR"); // "12:00:00"
```

---

## 7. React : Hooks et Cycles de Rendu

### `useState` (État local)
```jsx
const [state, setState] = useState(initialValue);
// Utiliser une fonction de rappel pour calculer le prochain état basé sur l'état précédent :
setState(prev => prev + 1);
```

### `useEffect` (Effets de rendu)
```jsx
useEffect(() => {
  // Exécuté après le rendu initial et après les mises à jour des dépendances

  return () => {
    // Phase de nettoyage (Cleanup) : exécutée avant le prochain effet et au démontage
  };
}, [dep1, dep2]); // Tableau de dépendances
```

### `useContext` (Accès global)
```jsx
const value = useContext(MyContext);
```

### `useRef` (Accès DOM & valeurs persistantes sans re-render)
```jsx
const inputRef = useRef(null);
// Accès : inputRef.current
```

### `useMemo` (Calculs lourds mémoïsés)
```jsx
const value = useMemo(() => expensiveCalculation(a), [a]);
```

### `useCallback` (Fonctions mémoïsées)
```jsx
const memoizedCallback = useCallback(() => { doSomething(a); }, [a]);
```

---

## 8. Formulaires et Événements en React

### Gestionnaire d'Événement Générique (Inputs Multiples)
Permet de lier dynamiquement plusieurs champs (input, select, checkbox) à un unique objet de State.

```jsx
import React, { useState } from 'react';

function ControlledForm() {
  const [fields, setFields] = useState({
    title: '',
    description: '',
    priority: 'medium',
    isClosed: false
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Annule le comportement de soumission par défaut (rechargement)
    console.log("Envoi des données :", fields);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Texte */}
      <input 
        type="text" 
        name="title" 
        value={fields.title} 
        onChange={handleChange} 
      />

      {/* Zone de texte */}
      <textarea 
        name="description" 
        value={fields.description} 
        onChange={handleChange} 
      />

      {/* Sélecteur */}
      <select name="priority" value={fields.priority} onChange={handleChange}>
        <option value="high">Haute</option>
        <option value="medium">Moyenne</option>
        <option value="low">Basse</option>
      </select>

      {/* Case à cocher */}
      <label>
        <input 
          type="checkbox" 
          name="isClosed" 
          checked={fields.isClosed} 
          onChange={handleChange} 
        />
        Ticket résolu
      </label>

      <button type="submit">Sauvegarder</button>
    </form>
  );
}
```
