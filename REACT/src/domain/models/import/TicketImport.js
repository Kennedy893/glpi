// ============================================================
// MAPS DE CONVERSION
// ============================================================
const TYPE_MAP = {
  'Incident': 1,
  'Demande':  2,
};

const STATUS_MAP = {
  'New':        1,
  'Processing': 2,
  'Assigned':   3,
  'Pending':    4,
  'Solved':     5,
  'Closed':     6,
};

const PRIORITY_MAP = {
  'Very Low':  1,
  'Low':       2,
  'Medium':    3,
  'High':      4,
  'Very High': 5,
  'Major':     6,
};

// Préfixe du nom asset → itemtype GLPI
export const ITEM_PREFIX_MAP = {
  'PC':  'Computer',
  'MN':  'Monitor',
  'PR':  'Printer',
  'NE':  'NetworkEquipment',
  'PH':  'Phone',
  'PE':  'Peripheral',
};

// ============================================================
// FONCTIONS DE CONVERSION
// ============================================================

/**
 * "03/06/2026" + "13:45" → "2026-06-03 13:45:00"
 */
export const convertDateTime = (dateStr, heureStr) => {
  if (!dateStr || dateStr.trim() === '') return null;
  const [day, month, year] = dateStr.trim().split('/');
  const time = heureStr && heureStr.trim() !== '' ? heureStr.trim() : '00:00';
  const [hh, mm] = time.split(':');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hh.padStart(2, '0')}:${(mm || '00').padStart(2, '0')}:00`;
};

/**
 * "Incident" → 1 / "Demande" → 2
 */
export const convertType = (typeStr) => {
  return TYPE_MAP[typeStr?.trim()] ?? null;
};

/**
 * "New" → 1 / "Solved" → 5 / etc.
 */
export const convertStatus = (statusStr) => {
  return STATUS_MAP[statusStr?.trim()] ?? null;
};

/**
 * "Medium" → 3 / "High" → 4 / etc.
 */
export const convertPriority = (priorityStr) => {
  return PRIORITY_MAP[priorityStr?.trim()] ?? null;
};

/**
 * "[""PC-ADM-001"",""MN-FORM-002""]" → ["PC-ADM-001", "MN-FORM-002"]
 */
// export const parseItems = (itemsStr) => {
//   if (!itemsStr || itemsStr.trim() === '' || itemsStr.trim() === '[]') return [];
//   try {
//     const parsed = JSON.parse(itemsStr.trim());
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(i => i.trim()).filter(Boolean);
//   } catch {
//     return [];
//   }
// };
export const parseItems = (itemsStr) => {
  if (!itemsStr || itemsStr.trim() === '' || itemsStr.trim() === '[]') return [];

  const str = itemsStr.trim();

  // Tentative 1 — JSON strict : ["PC-ADM-001","MN-FORM-002"]
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed.map(i => i.trim()).filter(Boolean);
  } catch {}

  // Tentative 2 — format sans guillemets : [PC-ADM-001,MN-FORM-002]
  const withoutBrackets = str.replace(/^\[/, '').replace(/\]$/, '');
  if (withoutBrackets.trim() === '') return [];
  return withoutBrackets
    .split(',')
    .map(i => i.trim().replace(/^"|"$/g, '')) // retire guillemets résiduels
    .filter(Boolean);
};

/**
 * "PC-ADM-001" → "Computer" / "MN-FORM-002" → "Monitor"
 * Utilise le préfixe avant le premier "-"
 */
export const resolveItemType = (itemName) => {
  if (!itemName) return null;
  const prefix = itemName.trim().split('-')[0].toUpperCase();
  return ITEM_PREFIX_MAP[prefix] ?? null;
};

// ============================================================
// FONCTIONS DE VALIDATION
// ============================================================

const isValidDate = (dateStr) => {
  if (!dateStr || dateStr.trim() === '') return false;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr.trim())) return false;
  const [day, month, year] = dateStr.trim().split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const isValidHeure = (heureStr) => {
  if (!heureStr || heureStr.trim() === '') return true; // optionnel
  return /^\d{2}:\d{2}$/.test(heureStr.trim());
};

const isValidType = (typeStr) => {
  return Object.keys(TYPE_MAP).includes(typeStr?.trim());
};

const isValidStatus = (statusStr) => {
  return Object.keys(STATUS_MAP).includes(statusStr?.trim());
};

const isValidPriority = (priorityStr) => {
  return Object.keys(PRIORITY_MAP).includes(priorityStr?.trim());
};

// const isValidItems = (itemsStr) => {
//   if (!itemsStr || itemsStr.trim() === '' || itemsStr.trim() === '[]') return true; // optionnel
//   try {
//     const parsed = JSON.parse(itemsStr.trim());
//     return Array.isArray(parsed);
//   } catch {
//     return false;
//   }
// };
const isValidItems = (itemsStr) => {
  if (!itemsStr || itemsStr.trim() === '' || itemsStr.trim() === '[]') return true;

  const str = itemsStr.trim();

  // Accepter JSON strict
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed);
  } catch {}

  // Accepter format sans guillemets [PC-ADM-001,MN-FORM-002]
  return /^\[[\w,\s\-]*\]$/.test(str);
};
// ============================================================
// VALIDATION + MAPPING PRINCIPAL
// ============================================================

/**
 * Valide et transforme une ligne brute du CSV tickets en entité exploitable.
 * @param {Object} rawRow - Ligne brute issue du parser CSV
 * @param {number} index  - Index de la ligne (0-based) pour les logs
 * @returns {{ data: Object|null, errors: string[] }}
 */
export const validateAndMapTicketRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2;

  // 1. Ref_Ticket (obligatoire)
  if (!rawRow.Ref_Ticket || rawRow.Ref_Ticket.trim() === '')
    errors.push(`Ligne ${lineNum} : La référence du ticket est obligatoire.`);

  // 2. Date (obligatoire)
  if (!rawRow.Date || rawRow.Date.trim() === '')
    errors.push(`Ligne ${lineNum} : La date est obligatoire.`);
  else if (!isValidDate(rawRow.Date))
    errors.push(`Ligne ${lineNum} : Date "${rawRow.Date}" invalide (format attendu : DD/MM/YYYY).`);

  // 3. Heure (optionnelle mais format valide si présente)
  if (rawRow.Heure && !isValidHeure(rawRow.Heure))
    errors.push(`Ligne ${lineNum} : Heure "${rawRow.Heure}" invalide (format attendu : HH:MM).`);

  // 4. Type (obligatoire)
  if (!rawRow.Type || rawRow.Type.trim() === '')
    errors.push(`Ligne ${lineNum} : Le type est obligatoire.`);
  else if (!isValidType(rawRow.Type))
    errors.push(`Ligne ${lineNum} : Type "${rawRow.Type}" non reconnu. Valeurs valides : ${Object.keys(TYPE_MAP).join(', ')}.`);

  // 5. Titre (obligatoire)
  if (!rawRow.Titre || rawRow.Titre.trim() === '')
    errors.push(`Ligne ${lineNum} : Le titre est obligatoire.`);

  // 6. Description (obligatoire)
  if (!rawRow.Description || rawRow.Description.trim() === '')
    errors.push(`Ligne ${lineNum} : La description est obligatoire.`);

  // 7. Status (obligatoire)
  if (!rawRow.Status || rawRow.Status.trim() === '')
    errors.push(`Ligne ${lineNum} : Le statut est obligatoire.`);
  else if (!isValidStatus(rawRow.Status))
    errors.push(`Ligne ${lineNum} : Status "${rawRow.Status}" non reconnu. Valeurs valides : ${Object.keys(STATUS_MAP).join(', ')}.`);

  // 8. Priority (obligatoire)
  if (!rawRow.Priority || rawRow.Priority.trim() === '')
    errors.push(`Ligne ${lineNum} : La priorité est obligatoire.`);
  else if (!isValidPriority(rawRow.Priority))
    errors.push(`Ligne ${lineNum} : Priority "${rawRow.Priority}" non reconnue. Valeurs valides : ${Object.keys(PRIORITY_MAP).join(', ')}.`);

  // 9. Items (optionnel mais format JSON valide si présent)
  if (rawRow.Items && rawRow.Items.trim() !== '' && !isValidItems(rawRow.Items))
    errors.push(`Ligne ${lineNum} : Items "${rawRow.Items}" invalide (format attendu : ["PC-ADM-001","MN-FORM-002"]).`);

  // 10. Vérifier que chaque item a un préfixe reconnu
  if (isValidItems(rawRow.Items)) {
    const items = parseItems(rawRow.Items);
    items.forEach(itemName => {
      if (!resolveItemType(itemName))
        errors.push(`Ligne ${lineNum} : Asset "${itemName}" — préfixe non reconnu. Préfixes valides : ${Object.keys(ITEM_PREFIX_MAP).join(', ')}.`);
    });
  }

  if (errors.length > 0) return { data: null, errors };

  // ============================================================
  // NETTOYAGE ET CONVERSION
  // ============================================================

  const items = parseItems(rawRow.Items);

  return {
    errors: [],
    data: {
      // Champs bruts nettoyés
      refTicket:   rawRow.Ref_Ticket.trim(),
      titre:       rawRow.Titre.trim(),
      description: rawRow.Description.trim(),

      // Champs convertis pour GLPI
      date:     convertDateTime(rawRow.Date, rawRow.Heure), // "2026-06-03 13:45:00"
      type:     convertType(rawRow.Type),                   // 1 ou 2
      status:   convertStatus(rawRow.Status),               // 1,2,4,5,6
      priority: convertPriority(rawRow.Priority),           // 1→6

      // Items parsés avec leur itemtype résolu
      items: items.map(name => ({
        name,
        itemtype: resolveItemType(name), // "Computer", "Monitor"...
      })),
    }
  };
};

export const VALID_TYPES     = Object.keys(TYPE_MAP);
export const VALID_STATUSES  = Object.keys(STATUS_MAP);
export const VALID_PRIORITIES = Object.keys(PRIORITY_MAP);