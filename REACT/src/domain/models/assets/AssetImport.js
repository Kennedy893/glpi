/**
 * Convertit un prix (ex: "850,00" ou "850.00" ou "850") en nombre
 * @param {string} priceStr - Chaîne de prix à convertir
 * @returns {number} - Prix converti en nombre, 0 si invalide
 */
const convertPrice = (priceStr) => {
  if (!priceStr || priceStr.trim() === '') return 0;
  // Supprimer les espaces, remplacer la virgule par un point
  const normalized = priceStr.toString().replace(/\s/g, '').replace(',', '.');
  // Extraire le premier nombre (ignore les caractères non numériques après)
  const match = normalized.match(/^[\d.]+/);
  if (!match) return 0;
  const price = parseFloat(match[0]);
  return isNaN(price) ? 0 : price;
};

/**
 * Formate une date (DD/MM/YYYY) au format GLPI (YYYY-MM-DD)
 * @param {string} dateStr - Date au format DD/MM/YYYY
 * @returns {string|null} - Date formatée ou null si invalide
 */
const formatDateForGLPI = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // Si déjà au bon format YYYY-MM-DD
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  
  // Convertir DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (year && year.length === 4 && day && month) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  return null;
};

/**
 * Extrait la capacité d'une chaîne de stockage (ex: "512Go SSD" → 512)
 * @param {string} storageStr - Chaîne de stockage
 * @returns {number|null} - Capacité en Go ou null
 */
const extractCapacity = (storageStr) => {
  if (!storageStr) return null;
  const match = storageStr.match(/(\d+)/);
  if (!match) return null;
  let capacity = parseInt(match[1]);
  
  // Convertir To en Go si nécessaire
  if (storageStr.toLowerCase().includes('to')) {
    capacity = capacity * 1000;
  }
  
  return capacity;
};

/**
 * Normalise le type d'équipement pour GLPI
 * @param {string} type - Type français
 * @returns {string} - Type GLPI (Computer, Printer, Monitor, Phone)
 */
const normalizeTypeForGLPI = (type) => {
  const TYPE_MAP = {
    'Ordinateur': 'Computer',
    'Serveur': 'Computer',
    'Imprimante': 'Printer',
    'Écran': 'Monitor',
    'Ecran': 'Monitor',
    'Téléphone': 'Phone',
    'Phone': 'Phone',
    'Switch': 'NetworkEquipment',
    'Routeur': 'NetworkEquipment'
  };
  
  return TYPE_MAP[type] || 'Computer';
};

/**
 * Valide le format d'une date (DD/MM/YYYY) et s'assure qu'elle est valide
 */
const isValidDate = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return true;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

/**
 * Valide le format d'un prix (ex: "850,00" ou "850.00" ou "850")
 */
const isValidPrice = (priceStr) => {
  if (!priceStr || priceStr.trim() === '') return true;
  const normalized = priceStr.replace(/\s/g, '').replace(/,/g, '.');
  const num = parseFloat(normalized);
  return !isNaN(num) && num >= 0;
};

/**
 * Valide le type d'équipement
 */
const isValidType = (type) => {
  const validTypes = ['Ordinateur', 'Serveur', 'Imprimante', 'Écran', 'Ecran', 'Switch', 'Routeur', 'Téléphone'];
  return validTypes.includes(type);
};

/**
 * Normalise une référence
 */
const normalizeReference = (ref) => {
  if (!ref) return null;
  return ref.trim().toUpperCase();
};

/**
 * Normalise la RAM (extrait juste la valeur numérique)
 */
const normalizeRam = (ramStr) => {
  if (!ramStr) return null;
  const match = ramStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
};

/**
 * Valide et transforme une ligne brute du CSV materiels en entité exploitable.
 * Les données sont déjà formatées pour GLPI.
 */
export const validateAndMapMaterielRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2;

  // 1. Validation du nom (obligatoire)
  if (!rawRow.nom || rawRow.nom.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le nom de l'équipement est obligatoire.`);
  }

  // 2. Validation du type (obligatoire)
  if (!rawRow.type || rawRow.type.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le type d'équipement est obligatoire.`);
  } else if (!isValidType(rawRow.type)) {
    errors.push(`Ligne ${lineNum} : Le type "${rawRow.type}" n'est pas reconnu.`);
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

  // 7. Validation de la date d'achat
  if (rawRow.date_achat && rawRow.date_achat.trim() !== '') {
    if (!isValidDate(rawRow.date_achat)) {
      errors.push(`Ligne ${lineNum} : La date d'achat "${rawRow.date_achat}" est invalide.`);
    }
  }

  // 8. Validation du prix d'achat
  if (rawRow.prix_achat && rawRow.prix_achat.trim() !== '') {
    if (!isValidPrice(rawRow.prix_achat)) {
      errors.push(`Ligne ${lineNum} : Le prix d'achat "${rawRow.prix_achat}" est invalide.`);
    }
  }

  if (errors.length > 0) {
    return { data: null, errors };
  }

  // === FORMATAGE ET CONVERSION POUR GLPI ===
  
  const cleanType = rawRow.type.trim();
  const glpiType = normalizeTypeForGLPI(cleanType);
  
  // Formater les dates pour GLPI
  const formattedDateAchat = formatDateForGLPI(rawRow.date_achat);
  
  // Convertir le prix en nombre
  const convertedPrice = convertPrice(rawRow.prix_achat);
  
  // Données spécifiques selon le type
  let ramForGLPI = null;
  let storageForGLPI = null;
  let ramSize = null;
  let storageCapacity = null;
  
  if (glpiType === 'Computer') {
    // Pour les ordinateurs, extraire la taille de RAM
    if (rawRow.ram) {
      ramForGLPI = rawRow.ram.trim();
      ramSize = normalizeRam(rawRow.ram);
    }
    
    // Pour le stockage, extraire la capacité
    if (rawRow.stockage) {
      storageForGLPI = rawRow.stockage.trim();
      storageCapacity = extractCapacity(rawRow.stockage);
    }
  }

  // Retourne l'objet standardisé et PRÊT POUR GLPI
  return {
    errors: [],
    data: {
      // Données originales nettoyées
      nom: rawRow.nom.trim(),
      reference: normalizeReference(rawRow.reference),
      type: cleanType,           // Type original français
      marque: rawRow.marque.trim(),
      modele: rawRow.modele.trim(),
      etat: rawRow.etat.trim(),
      localisation: rawRow.localisation.trim(),
      numeroSerie: rawRow.numero_serie ? rawRow.numero_serie.trim() : null,
      
      // Données formatées pour GLPI
      glpiType: glpiType,        // Type GLPI (Computer, Printer, etc.)
      prixAchat: convertedPrice,  // Nombre (850.00)
      dateAchat: formattedDateAchat,  // Format YYYY-MM-DD
      
      // Données techniques formatées
      ram: ramForGLPI,           // Chaîne originale (ex: "16Go")
      ramSize: ramSize,          // Taille en Go (16)
      stockage: storageForGLPI,   // Chaîne originale (ex: "512Go SSD")
      storageCapacity: storageCapacity, // Capacité en Go (512)
      os: rawRow.os ? rawRow.os.trim() : null,
      
      // Champs additionnels
      technicien: rawRow.technicien ? rawRow.technicien.trim() : null,
      fournisseur: rawRow.fournisseur ? rawRow.fournisseur.trim() : null,
      dateFinGarantie: formatDateForGLPI(rawRow.date_fin_garantie)
    }
  };
};

/**
 * Export des types valides
 */
export const VALID_TYPES = ['Ordinateur', 'Serveur', 'Imprimante', 'Écran', 'Switch', 'Routeur', 'Téléphone'];

/**
 * Export des fonctions utilitaires pour utilisation externe
 */
export const Formatters = {
  convertPrice,
  formatDateForGLPI,
  extractCapacity,
  normalizeTypeForGLPI,
  normalizeRam
};