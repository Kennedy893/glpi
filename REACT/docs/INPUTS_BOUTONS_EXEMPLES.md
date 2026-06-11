# Guide React - Exemples d'inputs et de boutons

Ce document rassemble des exemples React simples et reutilisables pour gerer plusieurs types d'inputs, des boutons, et leurs traitements.

Objectif:
- comprendre la syntaxe JSX
- apprendre a gerer des formulaires
- voir des handlers concrets pour les boutons
- reutiliser rapidement des patterns dans le projet

---

## 1) Composant React de base

Un composant fonctionnel est une fonction JavaScript qui retourne du JSX.

```jsx
import React, { useState } from 'react';

export default function ExempleSimple() {
  const [nom, setNom] = useState('');

  return (
    <div>
      <h1>Bonjour {nom || 'visiteur'}</h1>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Votre nom"
      />
    </div>
  );
}
```

Explication:
- `useState` stocke la valeur du champ.
- `value` relie l'input a l'etat.
- `onChange` met a jour l'etat a chaque frappe.

---

## 2) Formulaire complet avec plusieurs inputs

Exemple avec texte, email, mot de passe, nombre, checkbox, radio, select et textarea.

```jsx
import React, { useState } from 'react';

export default function FormulaireComplet() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    age: '',
    newsletter: false,
    genre: 'femme',
    pays: 'madagascar',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Formulaire envoye pour ${form.nom}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nom"
        value={form.nom}
        onChange={handleChange}
        placeholder="Nom complet"
      />

      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        type="password"
        name="motDePasse"
        value={form.motDePasse}
        onChange={handleChange}
        placeholder="Mot de passe"
      />

      <input
        type="number"
        name="age"
        value={form.age}
        onChange={handleChange}
        min="0"
        max="120"
      />

      <label>
        <input
          type="checkbox"
          name="newsletter"
          checked={form.newsletter}
          onChange={handleChange}
        />
        Recevoir la newsletter
      </label>

      <label>
        <input
          type="radio"
          name="genre"
          value="femme"
          checked={form.genre === 'femme'}
          onChange={handleChange}
        />
        Femme
      </label>

      <label>
        <input
          type="radio"
          name="genre"
          value="homme"
          checked={form.genre === 'homme'}
          onChange={handleChange}
        />
        Homme
      </label>

      <select name="pays" value={form.pays} onChange={handleChange}>
        <option value="madagascar">Madagascar</option>
        <option value="france">France</option>
        <option value="canada">Canada</option>
      </select>

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Votre message"
      />

      <button type="submit">Envoyer</button>
    </form>
  );
}
```

Explication:
- un seul `handleChange` peut gerer plusieurs champs
- `checkbox` utilise `checked` au lieu de `value`
- `radio` compare la valeur active
- `select` et `textarea` restent controles comme les inputs texte

---

## 3) Input text avec validation simple

```jsx
import React, { useState } from 'react';

export default function InputTexteValide() {
  const [valeur, setValeur] = useState('');
  const [erreur, setErreur] = useState('');

  const handleChange = (e) => {
    const text = e.target.value;
    setValeur(text);

    if (text.length < 3) {
      setErreur('Au moins 3 caracteres');
    } else {
      setErreur('');
    }
  };

  return (
    <div>
      <input type="text" value={valeur} onChange={handleChange} />
      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
    </div>
  );
}
```

---

## 4) Input number avec limites

```jsx
import React, { useState } from 'react';

export default function QuantiteSelector() {
  const [quantite, setQuantite] = useState(1);

  const increase = () => setQuantite((prev) => prev + 1);
  const decrease = () => setQuantite((prev) => Math.max(1, prev - 1));

  return (
    <div>
      <button type="button" onClick={decrease}>-</button>
      <input
        type="number"
        min="1"
        max="99"
        value={quantite}
        onChange={(e) => setQuantite(parseInt(e.target.value, 10) || 1)}
      />
      <button type="button" onClick={increase}>+</button>
    </div>
  );
}
```

Explication:
- `type="button"` evite le submit si le bouton est dans un formulaire
- on force une valeur minimum avec `Math.max(1, ...)`

---

## 5) Checkbox simple

```jsx
import React, { useState } from 'react';

export default function CheckboxDemo() {
  const [accept, setAccept] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={accept}
        onChange={(e) => setAccept(e.target.checked)}
      />
      J'accepte les conditions
    </label>
  );
}
```

---

## 6) Radio buttons

```jsx
import React, { useState } from 'react';

export default function RadioDemo() {
  const [mode, setMode] = useState('standard');

  return (
    <div>
      <label>
        <input
          type="radio"
          name="mode"
          value="standard"
          checked={mode === 'standard'}
          onChange={(e) => setMode(e.target.value)}
        />
        Standard
      </label>

      <label>
        <input
          type="radio"
          name="mode"
          value="express"
          checked={mode === 'express'}
          onChange={(e) => setMode(e.target.value)}
        />
        Express
      </label>
    </div>
  );
}
```

---

## 7) Select simple et select multiple

### Select simple

```jsx
import React, { useState } from 'react';

export default function SelectSimple() {
  const [ville, setVille] = useState('tana');

  return (
    <select value={ville} onChange={(e) => setVille(e.target.value)}>
      <option value="tana">Antananarivo</option>
      <option value="toamasina">Toamasina</option>
      <option value="antsirabe">Antsirabe</option>
    </select>
  );
}
```

### Select multiple

```jsx
import React, { useState } from 'react';

export default function SelectMultiple() {
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setTags(values);
  };

  return (
    <select multiple value={tags} onChange={handleChange}>
      <option value="react">React</option>
      <option value="vite">Vite</option>
      <option value="prestashop">PrestaShop</option>
    </select>
  );
}
```

---

## 8) Textarea

```jsx
import React, { useState } from 'react';

export default function Commentaire() {
  const [commentaire, setCommentaire] = useState('');

  return (
    <textarea
      rows="5"
      value={commentaire}
      onChange={(e) => setCommentaire(e.target.value)}
      placeholder="Ecrire un commentaire"
    />
  );
}
```

---

## 9) Input fichier

```jsx
import React, { useState } from 'react';

export default function UploadFichier() {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : '');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {fileName && <p>Fichier choisi: {fileName}</p>}
    </div>
  );
}
```

Explication:
- `files` contient une liste de fichiers
- un input file ne se controle pas comme un champ texte classique

---

## 10) Inputs date, time et range

```jsx
import React, { useState } from 'react';

export default function SaisieSpeciale() {
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [note, setNote] = useState(50);

  return (
    <div>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
      <input type="range" min="0" max="100" value={note} onChange={(e) => setNote(e.target.value)} />
      <p>Note: {note}</p>
    </div>
  );
}
```

---

## 11) Boutons et traitements

### Bouton simple

```jsx
<button onClick={() => alert('Clique !')}>Clique moi</button>
```

### Bouton avec fonction dédiée

```jsx
function supprimerProduit(id) {
  console.log('Supprimer produit', id);
}

<button onClick={() => supprimerProduit(12)}>Supprimer</button>
```

### Bouton submit dans un formulaire

```jsx
<form onSubmit={handleSubmit}>
  <button type="submit">Envoyer</button>
</form>
```

### Bouton reset

```jsx
<button type="reset">Reinitialiser</button>
```

### Bouton conditionnel

```jsx
<button disabled={!email || !motDePasse}>
  Se connecter
</button>
```

### Bouton chargement

```jsx
<button onClick={handleSave} disabled={loading}>
  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
</button>
```

### Boutons de quantite

```jsx
<div>
  <button type="button" onClick={() => setQuantite((q) => Math.max(1, q - 1))}>-</button>
  <button type="button" onClick={() => setQuantite((q) => q + 1)}>+</button>
</div>
```

---

## 12) Traitement async d'un bouton

```jsx
import React, { useState } from 'react';

export default function BoutonAsync() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/save');
      if (!response.ok) {
        throw new Error('Erreur serveur');
      }

      setMessage('Operation reussie');
    } catch (error) {
      setMessage(error.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading}>
        {loading ? 'Traitement...' : 'Lancer'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

---

## 13) Exemple de formulaire avec validation et reset

```jsx
import React, { useState } from 'react';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    setError('');
    console.log('Connexion avec', form);
  };

  const handleReset = () => {
    setForm({ email: '', password: '' });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit">Connexion</button>
      <button type="button" onClick={handleReset}>Effacer</button>
    </form>
  );
}
```

---

## 14) Petit composant reutilisable pour un bouton

```jsx
import React from 'react';

export default function ActionButton({ label, onClick, variant = 'primary', disabled = false }) {
  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

Utilisation:

```jsx
<ActionButton
  label="Supprimer"
  variant="danger"
  onClick={() => console.log('delete')}
/>
```

---

## 15) Points importants a retenir

- `value` + `onChange` = input controle
- `checked` sert pour checkbox et radio
- `type="button"` evite le submit accidentel
- `type="submit"` declenche `onSubmit` du formulaire
- `e.preventDefault()` bloque le rechargement de page
- pour les listes, utilise toujours un `key` unique

---

## 16) Exemple de structure finale simple

```jsx
import React, { useState } from 'react';

export default function DemoComplete() {
  const [nom, setNom] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [pays, setPays] = useState('madagascar');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Nom: ${nom}, pays: ${pays}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom" />

      <label>
        <input
          type="checkbox"
          checked={newsletter}
          onChange={(e) => setNewsletter(e.target.checked)}
        />
        Newsletter
      </label>

      <select value={pays} onChange={(e) => setPays(e.target.value)}>
        <option value="madagascar">Madagascar</option>
        <option value="france">France</option>
      </select>

      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />

      <button type="submit">Valider</button>
      <button type="button" onClick={() => {
        setNom('');
        setNewsletter(false);
        setPays('madagascar');
        setMessage('');
      }}>
        Reinitialiser
      </button>
    </form>
  );
}
```

---

## 17) Astuce pratique

Si tu veux tester rapidement une syntaxe, commence par:
- un state
- un input controlle
- un bouton avec `onClick`
- un `form` avec `onSubmit`

C'est souvent la base de 80% des interactions React du projet.
