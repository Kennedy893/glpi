# Exemples de parsing et regex (avec explications)

Ce document rassemble des exemples courants de parsing rencontrés dans le projet: CSV, champs `achat`, prix, dates, XML, et transformations JS utiles. Chaque exemple montre la regex, son rôle, et un snippet JavaScript pour l'appliquer.

---

## 1) Normaliser un prix (ex: "1 234,56 €" → 1234.56)

Pattern:
- Regex: `/([\d\s]+[\.,]?\d*)/` ou plus strict `/([0-9]+(?:[\s\.]?[0-9]{3})*(?:[,.][0-9]+)?)/`

Pourquoi: Dans les CSV francophones on trouve souvent des espaces milliers et `,` pour décimales.

Extrait JS:

```javascript
const raw = "1 234,56 €";
const match = raw.match(/([0-9]+(?:[\s\.]?[0-9]{3})*(?:[,.][0-9]+)?)/);
const normalized = match ? match[0].replace(/[\s\.]/g, '').replace(',', '.') : null;
const value = normalized ? parseFloat(normalized) : null; // 1234.56
```

Notes: toujours `parseFloat` après remplacement; vérifier `NaN`.

---

## 2) Extraire champs CSV (gestion des champs entre guillemets)

Pattern (global):
- Regex: `/(?:"([^"]*)"|([^,]*))(?:,|$)/g`

Pourquoi: prend en charge les champs entourés de guillemets contenant des virgules.

Extrait JS:

```javascript
function splitCsvLine(line) {
  const re = /(?:"([^"]*)"|([^,]*))(?:,|$)/g;
  const fields = [];
  let m;
  while ((m = re.exec(line)) !== null) {
    fields.push(m[1] !== undefined ? m[1] : m[2]);
  }
  return fields;
}

// exemple
splitCsvLine('"Nom, Prénom",ref123,12,1 234,56 €');
```

Remarques: pour CSV complexes, utiliser un parser dédié (`papaparse`, `csv-parse`).

---

## 3) Parser le champ `achat` (ex: "REF123 x2; REF-456 x1")

Pattern:
- Regex: `/([A-Za-z0-9_\-]+)\s*(?:x|×)?\s*(\d+)?/gi`

Pourquoi: extraire référence + quantité optionnelle.

Extrait JS:

```javascript
const achat = "REF123 x2;REF-456 x1; REF789";
const re = /([A-Za-z0-9_\-]+)\s*(?:x|×)?\s*(\d+)?/gi;
let m;
const items = [];
while ((m = re.exec(achat)) !== null) {
  const ref = m[1];
  const qty = m[2] ? parseInt(m[2], 10) : 1;
  items.push({ ref, qty });
}
// items => [ {ref:'REF123', qty:2}, ... ]
```

Conseil: nettoyer séparateurs (`;`, `,`, `/`) avant matching si nécessaire.

---

## 4) Dates: dd/mm/yyyy → format SQL `YYYY-MM-DD`

Pattern:
- Regex: `/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/`

Extrait JS:

```javascript
function toSqlDate(str) {
  const m = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (!m) return null;
  const d = m[1].padStart(2, '0');
  const mo = m[2].padStart(2, '0');
  const y = m[3];
  return `${y}-${mo}-${d}`; // YYYY-MM-DD
}
```

Remarque: pour formats variés, utiliser `date-fns` ou `luxon`.

---

## 5) Extraire référence + variante encodée (ex: "REF123|Color:Red|Size:M")

Pattern:
- Pour séparation des paires attribut: `/([^:|]+):([^|]+)/g`

Extrait JS:

```javascript
const input = 'REF123|Color:Red|Size:M';
const [refPart, ...attrParts] = input.split('|');
const ref = refPart;
const attrs = {};
const attrRe = /([^:|]+):([^|]+)/g;
let am;
for (const part of attrParts) {
  if ((am = attrRe.exec(part))) {
    attrs[am[1].trim()] = am[2].trim();
  }
  attrRe.lastIndex = 0; // reset si on réutilise
}
// attrs => { Color: 'Red', Size: 'M' }
```

---

## 6) XML → lecture via `DOMParser` (extrait du service web)

Pourquoi: l'API PrestaShop retourne souvent XML; utiliser `DOMParser` en front-end ou `xml2js` côté Node.

Extrait JS (naviguer l'XML retourné):

```javascript
const xml = '<product><id>123</id><name><language id="1">Produit</language></name></product>';
const parser = new DOMParser();
const doc = parser.parseFromString(xml, 'application/xml');
const idNode = doc.querySelector('product > id');
const id = idNode ? idNode.textContent : null; // '123'
// Pour obtenir champs multi-langue: doc.querySelectorAll('product > name > language')
```

Côté serveur (Node) on préfère `xml2js` ou `fast-xml-parser` pour transformer en JSON.

---

## 7) Regex avancée: groupes nommés

Pattern:
- Exemple: `/^(?<ref>[A-Z0-9_\-]+)\s*(?:x|×)?\s*(?<qty>\d+)?$/i`

Extrait JS:

```javascript
const re = /^(?<ref>[A-Z0-9_\-]+)\s*(?:x|×)?\s*(?<qty>\d+)?$/i;
const m = 'REF123 x2'.match(re);
if (m && m.groups) {
  const ref = m.groups.ref;
  const qty = m.groups.qty ? parseInt(m.groups.qty, 10) : 1;
}
```

Note: les groupes nommés sont pratiques pour clarté; vérifier compatibilité Node/browser si ancien.

---

## 8) Sécurité et robustesse

- Toujours `trim()` les champs avant parsing.
- Toujours valider `parseInt/parseFloat` pour `NaN`.
- Pour CSV complexes, utiliser une librairie plutôt que regex fragile.
- Pour XML, vérifier `parser.parseFromString` pour les erreurs (node `<parsererror>`).
- Lors d'import massif, proposer un `dry-run` qui n'envoie pas d'appels API mais logge les actions prévues.

---

## 9) Boîte à outils recommandée

- CSV: `papaparse` (navigateur) / `csv-parse` (Node)
- XML: `fast-xml-parser`, `xml2js`
- Dates: `date-fns`, `luxon`
- Validation: `ajv` (JSON schema) pour structures d'entrée

---

Fichier créé: `docs/PARSING_EXAMPLES.md` — veux-tu que j'ajoute des exemples spécifiques tirés d'un fichier CSV réel du projet (je peux lire `src/utils/importComposer.js` pour extraire formats exacts) ?