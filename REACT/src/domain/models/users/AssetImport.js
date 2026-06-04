// domain/models/materiels/MaterielImport.js

/**
 * Valide le format d'une date (DD/MM/YYYY) et s'assure qu'elle est valide
 */
const isValidDate = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return true; // Date optionnelle
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

/**
 * Valide le format d'un prix (ex: "850,00" ou "850.00" ou "850")
 */
const isValidPrice = (priceStr) => {
  if (!priceStr || priceStr.trim() === '') return true; // Prix optionnel
  // Accepte les formats: 850, 850.00, 850,00, 1,200.50, 1.200,50
  const normalized = priceStr.replace(/\s/g, '').replace(/,/g, '.');
  const num = parseFloat(normalized);
  return !isNaN(num) && num >= 0;
};

/**
 * Valide le type d'équipement (doit correspondre aux types GLPI)
 */
const isValidType = (type) => {
  const validTypes = ['Ordinateur', 'Serveur', 'Imprimante', 'Écran', 'Ecran', 'Switch', 'Routeur', 'Périphérique'];
  return validTypes.includes(type);
};

/**
 * Valide le format de la référence/numéro de série (optionnel mais nettoie)
 */
const normalizeReference = (ref) => {
  if (!ref) return null;
  return ref.trim().toUpperCase();
};

/**
 * Valide et transforme une ligne brute du CSV materiels en entité exploitable.
 * @param {Object} rawRow - Ligne brute issue du parser CSV
 * @param {number} index - Index de la ligne pour les logs d'erreurs
 * @returns {{ data: Object|null, errors: string[] }}
 */
export const validateAndMapMaterielRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2; // +1 pour l'index 0, +1 pour la ligne d'en-tête

  // 1. Validation du nom (obligatoire)
  if (!rawRow.nom || rawRow.nom.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le nom de l'équipement est obligatoire.`);
  }

  // 2. Validation du type (obligatoire)
  if (!rawRow.type || rawRow.type.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le type d'équipement est obligatoire.`);
  } else if (!isValidType(rawRow.type)) {
    errors.push(`Ligne ${lineNum} : Le type "${rawRow.type}" n'est pas reconnu. Types valides: Ordinateur, Serveur, Imprimante, Écran, Switch, Routeur`);
  }

  // 3. Validation de la marque (obligatoire)
  if (!rawRow.marque || rawRow.marque.trim() === '') {
    errors.push(`Ligne ${lineNum} : La marque est obligatoire.`);
  }

  // 4. Validation du modèle (obligatoire)
  if (!rawRow.modele || rawRow.modele.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le modèle est obligatoire.`);
  }

  // 5. Validation de l'état (obligatoire)
  if (!rawRow.etat || rawRow.etat.trim() === '') {
    errors.push(`Ligne ${lineNum} : L'état est obligatoire.`);
  }

  // 6. Validation de la localisation (obligatoire)
  if (!rawRow.localisation || rawRow.localisation.trim() === '') {
    errors.push(`Ligne ${lineNum} : La localisation est obligatoire.`);
  }

  // 7. Validation de la date d'achat (optionnelle mais format valide)
  if (rawRow.date_achat && rawRow.date_achat.trim() !== '') {
    if (!isValidDate(rawRow.date_achat)) {
      errors.push(`Ligne ${lineNum} : La date d'achat "${rawRow.date_achat}" est invalide (format attendu: DD/MM/YYYY).`);
    }
  }

  // 8. Validation du prix d'achat (optionnel)
  if (rawRow.prix_achat && rawRow.prix_achat.trim() !== '') {
    if (!isValidPrice(rawRow.prix_achat)) {
      errors.push(`Ligne ${lineNum} : Le prix d'achat "${rawRow.prix_achat}" est invalide (format attendu: 850,00 ou 850.00).`);
    }
  }

  // 9. Validation de la RAM (optionnelle pour ordinateurs/serveurs)
  if ((rawRow.type === 'Ordinateur' || rawRow.type === 'Serveur') && rawRow.ram) {
    const ramMatch = rawRow.ram.match(/(\d+)\s*(Go|GB|Mo|MB)?/i);
    if (!ramMatch) {
      errors.push(`Ligne ${lineNum} : La RAM "${rawRow.ram}" a un format invalide (exemple: "16Go", "8 GB", "4096 Mo").`);
    }
  }

  // 10. Validation du stockage (optionnel pour ordinateurs/serveurs)
  if ((rawRow.type === 'Ordinateur' || rawRow.type === 'Serveur') && rawRow.stockage) {
    const storageMatch = rawRow.stockage.match(/(\d+)\s*(Go|GB|To|TB|SSD|HDD)?/i);
    if (!storageMatch) {
      errors.push(`Ligne ${lineNum} : Le stockage "${rawRow.stockage}" a un format invalide (exemple: "512Go SSD", "1To HDD").`);
    }
  }

  // Si des erreurs existent, on ne renvoie pas de données à traiter
  if (errors.length > 0) {
    return { data: null, errors };
  }

  // Nettoyage des valeurs
  const cleanNom = rawRow.nom.trim();
  const cleanReference = normalizeReference(rawRow.reference);
  const cleanType = rawRow.type.trim();
  const cleanMarque = rawRow.marque.trim();
  const cleanModele = rawRow.modele.trim();
  const cleanNumeroSerie = rawRow.numero_serie ? rawRow.numero_serie.trim() : null;
  const cleanRam = rawRow.ram ? rawRow.ram.trim() : null;
  const cleanStockage = rawRow.stockage ? rawRow.stockage.trim() : null;
  const cleanOs = rawRow.os ? rawRow.os.trim() : null;
  const cleanPrixAchat = rawRow.prix_achat ? parseFloat(rawRow.prix_achat.replace(/\s/g, '').replace(/,/g, '.')) : null;
  const cleanDateAchat = rawRow.date_achat ? rawRow.date_achat.trim() : null;
  const cleanEtat = rawRow.etat.trim();
  const cleanLocalisation = rawRow.localisation.trim();
  const cleanTechnicien = rawRow.technicien ? rawRow.technicien.trim() : null;

  // Retourne l'objet standardisé et nettoyé
  return {
    errors: [],
    data: {
      // Champs obligatoires
      nom: cleanNom,
      reference: cleanReference,
      type: cleanType,
      marque: cleanMarque,
      modele: cleanModele,
      etat: cleanEtat,
      localisation: cleanLocalisation,
      
      // Champs optionnels
      numeroSerie: cleanNumeroSerie,
      ram: cleanRam,
      stockage: cleanStockage,
      os: cleanOs,
      prixAchat: cleanPrixAchat,
      dateAchat: cleanDateAchat,
      technicien: cleanTechnicien,
      
      // Champs dérivés pour GLPI
      // Pour les types "Serveur", on les traitera comme des Computer
      glpiType: cleanType === 'Serveur' ? 'Computer' : cleanType
    }
  };
};

/**
 * Export des types valides pour utilisation externe (ex: affichage UI)
 */
export const VALID_TYPES = ['Ordinateur', 'Serveur', 'Imprimante', 'Écran', 'Switch', 'Routeur'];