# Documentation React.js — Syntaxes essentielles

> Référence complète des syntaxes React avec explications et exemples pratiques.

---

## Table des matières

1. [Composants](#composants)
2. [Props & State](#props--state)
3. [Hooks](#hooks)
4. [Événements](#événements)
5. [Listes & Conditions](#listes--conditions)
6. [Avancé](#avancé)

---

## Composants

### Composant fonctionnel

La façon principale de créer un composant en React. C'est une fonction JavaScript qui retourne du JSX. Le nom doit commencer par une majuscule.

```jsx
function MonComposant() {
  return (
    <div>
      <h1>Bonjour React !</h1>
    </div>
  );
}

export default MonComposant;
```

> 💡 Toujours exporter votre composant pour l'utiliser dans d'autres fichiers.

---

### Composant avec arrow function

Syntaxe alternative utilisant une fonction flèche (arrow function). Très courante dans les projets modernes.

```jsx
const MonComposant = () => {
  return <p>Hello World</p>;
};

// Retour implicite (sans accolades) :
const Court = () => <p>Court</p>;
```

---

### JSX — JavaScript XML

JSX permet d'écrire du HTML dans du JavaScript. Quelques règles importantes : une seule racine, `className` au lieu de `class`, les expressions entre `{}`.

```jsx
const element = (
  <div className="container">
    <h1 style={{ color: 'blue' }}>
      {"Bonjour" + " !"}
    </h1>
    <img src="logo.png" alt="Logo" />
  </div>
);
```

> 💡 Les balises auto-fermantes doivent se terminer par `/>`, ex: `<img />`, `<br />`

---

## Props & State

### Props — passer des données

Les props (properties) permettent de passer des données d'un composant parent vers un composant enfant. Elles sont en **lecture seule**.

```jsx
// Composant enfant :
function Salutation({ nom, age }) {
  return <p>Je m'appelle {nom}, j'ai {age} ans.</p>;
}

// Utilisation dans le parent :
<Salutation nom="Alice" age={25} />
```

> 💡 Déstructurez les props directement dans les paramètres pour un code plus lisible.

---

### Props par défaut

Définissez des valeurs par défaut pour les props non fournies, directement dans la déstructuration.

```jsx
function Bouton({ texte = "Cliquer", couleur = "blue" }) {
  return (
    <button style={{ background: couleur }}>
      {texte}
    </button>
  );
}

// Usage sans props = utilise les défauts :
<Bouton />
```

---

### Props children

La prop spéciale `children` contient tout ce que vous mettez entre les balises ouvrante et fermante d'un composant.

```jsx
function Carte({ children }) {
  return (
    <div className="carte">
      {children}
    </div>
  );
}

// Usage :
<Carte>
  <p>Contenu à l'intérieur !</p>
</Carte>
```

---

## Hooks

### useState — état local

`useState` permet de créer une variable d'état réactive. Quand l'état change, React re-rend le composant automatiquement.

```jsx
import { useState } from 'react';

function Compteur() {
  const [compte, setCompte] = useState(0);

  return (
    <div>
      <p>Valeur : {compte}</p>
      <button onClick={() => setCompte(compte + 1)}>
        +1
      </button>
    </div>
  );
}
```

> ⚠️ Ne modifiez JAMAIS l'état directement (`compte = 5`). Utilisez toujours la fonction setter (`setCompte(5)`).

---

### useEffect — effets de bord

`useEffect` exécute du code après le rendu. Utile pour les appels API, les abonnements, ou manipuler le DOM.

```jsx
import { useState, useEffect } from 'react';

function Data() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Exécuté au montage
    fetch('/api/data')
      .then(r => r.json())
      .then(d => setData(d));

    return () => {
      // Nettoyage (démontage)
    };
  }, []); // [] = exécuter une seule fois
}
```

> 💡 Le tableau de dépendances contrôle quand l'effet s'exécute :
> - `[]` → une seule fois au montage
> - `[valeur]` → à chaque fois que `valeur` change
> - absent → à chaque rendu

---

### useContext — contexte global

`useContext` permet de partager des données entre composants sans passer les props manuellement à chaque niveau (évite le *prop drilling*).

```jsx
import { createContext, useContext } from 'react';

const ThemeCtx = createContext('clair');

function App() {
  return (
    <ThemeCtx.Provider value="sombre">
      <Enfant />
    </ThemeCtx.Provider>
  );
}

function Enfant() {
  const theme = useContext(ThemeCtx);
  return <p>Thème : {theme}</p>;
}
```

---

### useRef — référence DOM

`useRef` crée une référence persistante. Permet d'accéder directement à un élément DOM ou de stocker une valeur sans déclencher de re-rendu.

```jsx
import { useRef } from 'react';

function Input() {
  const inputRef = useRef(null);

  const focus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </div>
  );
}
```

> 💡 `ref.current` donne accès à l'élément DOM réel. Modifier `ref.current` ne re-rend **pas** le composant.

---

### useMemo & useCallback

Optimisations de performance. `useMemo` mémoïse le résultat d'un calcul. `useCallback` mémoïse une fonction pour éviter sa recréation à chaque rendu.

```jsx
import { useMemo, useCallback } from 'react';

// useMemo — mémoïse un calcul coûteux :
const total = useMemo(() => {
  return liste.reduce((a, b) => a + b, 0);
}, [liste]);

// useCallback — mémoïse une fonction :
const handleClick = useCallback(() => {
  setCompte(c => c + 1);
}, []); // ne se recrée pas à chaque rendu
```

> ⚠️ N'abusez pas de ces hooks. Utilisez-les seulement quand vous observez de vraies lenteurs.

---

### useReducer — état complexe

Alternative à `useState` pour gérer un état plus complexe avec plusieurs transitions. Suit le pattern Redux (action, reducer).

```jsx
import { useReducer } from 'react';

function reducer(etat, action) {
  switch (action.type) {
    case 'increment': return { compte: etat.compte + 1 };
    case 'reset':     return { compte: 0 };
    default:          return etat;
  }
}

function Compteur() {
  const [etat, dispatch] = useReducer(reducer, { compte: 0 });

  return (
    <button onClick={() => dispatch({ type: 'increment' })}>
      {etat.compte}
    </button>
  );
}
```

---

## Événements

### Gestion des événements

React utilise des événements synthétiques similaires au DOM. Toujours passer une **référence** à la fonction, pas un appel de fonction.

```jsx
function Formulaire() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('Cliqué !');
  };

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Cliquer</button>
      <input onChange={handleChange} />
    </div>
  );
}
```

> ⚠️ `onClick={handleClick}` ✅ — `onClick={handleClick()}` ❌ (s'exécute immédiatement au rendu)

---

## Listes & Conditions

### Rendu de listes avec `.map()`

Pour afficher une liste d'éléments, utilisez `.map()` sur un tableau. Chaque élément doit avoir une prop `key` unique.

```jsx
const fruits = ['Mangue', 'Banane', 'Papaye'];

function Liste() {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}
```

> 💡 Préférez un identifiant unique (`id`) plutôt que l'index pour la `key`, surtout si la liste peut être réordonnée.

---

### Rendu conditionnel

Plusieurs façons d'afficher du contenu conditionnellement selon l'état ou les props.

```jsx
function Alerte({ estConnecte, message }) {
  // if/else classique :
  if (!estConnecte) return null;

  return (
    <div>
      {/* Ternaire */}
      {message ? <p>{message}</p> : <p>Pas de message</p>}

      {/* Opérateur && */}
      {message && <span>✓ Nouveau</span>}
    </div>
  );
}
```

> 💡 Retourner `null` dans un composant l'empêche de s'afficher sans provoquer d'erreur.

---

## Avancé

### Fragment — wrapper invisible

`React.Fragment` (ou `<>`) permet de grouper des éléments sans ajouter de nœud DOM supplémentaire.

```jsx
function Lignes() {
  return (
    <>
      <tr><td>Ligne 1</td></tr>
      <tr><td>Ligne 2</td></tr>
    </>
  );
}

// Avec key (obligatoire si dans une liste) :
<React.Fragment key={id}>...</React.Fragment>
```

---

### Formulaire contrôlé

Un composant contrôlé synchronise la valeur du champ avec l'état React via `onChange`. L'état React est la **source de vérité**.

```jsx
function Formulaire() {
  const [nom, setNom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Envoyé : ${nom}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={nom}
        onChange={e => setNom(e.target.value)}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

### Hook personnalisé (custom hook)

Un hook personnalisé est une fonction préfixée par `use` qui encapsule une logique réutilisable avec d'autres hooks React.

```jsx
function useLocalStorage(cle, valeurDefaut) {
  const [valeur, setValeur] = useState(
    () => JSON.parse(localStorage.getItem(cle)) ?? valeurDefaut
  );

  const sauvegarder = (nouvelleValeur) => {
    localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
    setValeur(nouvelleValeur);
  };

  return [valeur, sauvegarder];
}

// Usage :
const [nom, setNom] = useLocalStorage('nom', '');
```

> 💡 Les custom hooks doivent commencer par `use`. Ils peuvent appeler d'autres hooks React.

---

### Lazy loading & Suspense

Chargez les composants de façon paresseuse (seulement quand nécessaire) pour réduire la taille du bundle initial.

```jsx
import { lazy, Suspense } from 'react';

// Import dynamique :
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<p>Chargement...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

> 💡 `Suspense` affiche le `fallback` pendant le chargement du composant lazy.

---

### Portail (createPortal)

Render un enfant dans un nœud DOM situé en dehors du composant parent. Idéal pour les modals et tooltips.

```jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.getElementById('modal-root')
  );
}
```

> 💡 Le composant reste dans l'arbre React (événements, contexte) mais s'affiche ailleurs dans le DOM.

---

*Documentation générée avec Claude — 20 syntaxes React essentielles*
