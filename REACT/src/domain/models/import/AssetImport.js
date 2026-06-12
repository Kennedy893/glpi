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
    'Computer': 'Computer',
    'Ordinateur': 'Computer',
    'Serveur': 'Computer',
    'Imprimante': 'Printer',
    'Monitor': 'Monitor',
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
  const validTypes = ['Computer', 'Monitor', 'Ordinateur', 'Serveur', 'Imprimante', 'Écran', 'Ecran', 'Switch', 'Routeur', 'Phone', 'Printer', 'Peripheral', 'NetworkEquipment'];
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

export const GLPI_TYPE_MAP = {
  'Computer':         'Computer',
  'Monitor':          'Monitor',
  'Printer':          'Printer',
  'NetworkEquipment': 'NetworkEquipment',
  'Phone':            'Phone',
  'Peripheral':       'Peripheral',
};

/**
 * Valide et transforme une ligne brute du CSV materiels en entité exploitable.
 * Les données sont déjà formatées pour GLPI.
 */
export const validateAndMapMaterielRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2;

  // 1. Nom (obligatoire)
  if (!rawRow.Name || rawRow.Name.trim() === '')
    errors.push(`Ligne ${lineNum} : Le nom de l'équipement est obligatoire.`);

  // 2. Type (obligatoire)
  if (!rawRow.Item_Type || rawRow.Item_Type.trim() === '')
    errors.push(`Ligne ${lineNum} : Le type d'équipement est obligatoire.`);
  else if (!isValidType(rawRow.Item_Type))
    errors.push(`Ligne ${lineNum} : Type "${rawRow.Item_Type}" non reconnu. Types valides : ${Object.keys(GLPI_TYPE_MAP).join(', ')}`);

  // 3. Status (obligatoire)
  if (!rawRow.Status || rawRow.Status.trim() === '')
    errors.push(`Ligne ${lineNum} : Le statut est obligatoire.`);

  // 4. Location (obligatoire)
  if (!rawRow.Location || rawRow.Location.trim() === '')
    errors.push(`Ligne ${lineNum} : La localisation est obligatoire.`);

  // 5. Manufacturer (obligatoire)
  if (!rawRow.Manufacturer || rawRow.Manufacturer.trim() === '')
    errors.push(`Ligne ${lineNum} : Le fabricant est obligatoire.`);

  // 6. Model (obligatoire)
  if (!rawRow.Model || rawRow.Model.trim() === '')
    errors.push(`Ligne ${lineNum} : Le modèle est obligatoire.`);

  // // 7. Inventory_Number (obligatoire)
  // if (!rawRow.Inventory_Number || rawRow.Inventory_Number.trim() === '')
  //   errors.push(`Ligne ${lineNum} : Le numéro d'inventaire est obligatoire.`);

  if (errors.length > 0) return { data: null, errors };

  // === NETTOYAGE ET MAPPING POUR GLPI ===

  const userResolved = rawRow.User;

  return {
    errors: [],
    data: {
      // Champs directs
      name:              rawRow.Name.trim(),
      inventoryNumber:  normalizeReference(rawRow.Inventory_Number),
      type:             rawRow.Item_Type.trim(),
      glpiType:         GLPI_TYPE_MAP[rawRow.Item_Type.trim()],

      // Champs à résoudre via getOrCreate
      status:       rawRow.Status.trim(),
      location: rawRow.Location.trim(),
      manufacturer:       rawRow.Manufacturer.trim(),
      modele:       rawRow.Model.trim(),

      // User : personne ou groupe
      // userType:  userResolved.type,   // 'user' | 'group' | 'none'
      // userValue: userResolved.value,  // nom à résoudre via GET
      user: userResolved
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