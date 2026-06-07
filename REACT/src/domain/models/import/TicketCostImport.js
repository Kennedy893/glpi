// ============================================================
// FONCTIONS DE CONVERSION
// ============================================================

/**
 * Convertit une durée en secondes → entier
 * "600" → 600 / "0" → 0
 */
const convertDuration = (durationStr) => {
  if (!durationStr || durationStr.trim() === '') return 0;
  const parsed = parseInt(durationStr.trim(), 10);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Convertit un coût (virgule ou point) → float
 * "8,7" → 8.7 / "109" → 109.0 / "" → 0
 */
const convertCost = (costStr) => {
  if (!costStr || costStr.trim() === '') return 0;
  const normalized = costStr.trim().replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
};

// ============================================================
// FONCTIONS DE VALIDATION
// ============================================================

/**
 * Vérifie que la durée est un entier >= 0
 * "600" ✅ / "8.5" ❌ / "-10" ❌ / "abc" ❌
 */
const isValidDuration = (durationStr) => {
  if (!durationStr || durationStr.trim() === '') return true; // optionnel → 0 par défaut
  const parsed = parseInt(durationStr.trim(), 10);
  return !isNaN(parsed) && parsed >= 0 && String(parsed) === durationStr.trim();
};

/**
 * Vérifie que le coût est un nombre >= 0
 * Accepte virgule ou point comme séparateur décimal
 * "8,7" ✅ / "109" ✅ / "8.7" ✅ / "-5" ❌ / "abc" ❌
 */
const isValidCost = (costStr) => {
  if (!costStr || costStr.trim() === '') return true; // optionnel → 0 par défaut
  const normalized = costStr.trim().replace(',', '.');
  const parsed = parseFloat(normalized);
  return !isNaN(parsed) && parsed >= 0;
};

/**
 * Vérifie que Num_Ticket est un entier positif
 * "1" ✅ / "0" ❌ / "abc" ❌
 */
const isValidNumTicket = (numStr) => {
  if (!numStr || numStr.trim() === '') return false;
  const parsed = parseInt(numStr.trim(), 10);
  return !isNaN(parsed) && parsed > 0;
};

// ============================================================
// VALIDATION + MAPPING PRINCIPAL
// ============================================================

/**
 * Valide et transforme une ligne brute du CSV TicketCost.
 * @param {Object} rawRow - Ligne brute issue du parser CSV
 * @param {number} index  - Index de la ligne (0-based) pour les logs
 * @returns {{ data: Object|null, errors: string[] }}
 */
export const validateAndMapTicketCostRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2;

  // 1. Num_Ticket (obligatoire, entier positif)
  if (!rawRow.Num_Ticket || rawRow.Num_Ticket.trim() === '') {
    errors.push(`Ligne ${lineNum} : Le numéro de ticket est obligatoire.`);
  } else if (!isValidNumTicket(rawRow.Num_Ticket)) {
    errors.push(`Ligne ${lineNum} : Num_Ticket "${rawRow.Num_Ticket}" invalide (entier positif attendu).`);
  }

  // 2. Duration_second (optionnel, entier >= 0)
  if (rawRow.Duration_second && rawRow.Duration_second.trim() !== '') {
    if (!isValidDuration(rawRow.Duration_second)) {
      errors.push(`Ligne ${lineNum} : Duration_second "${rawRow.Duration_second}" invalide (entier >= 0 attendu, ex: 600).`);
    }
  }

  // 3. Time_Cost (optionnel, float >= 0)
  if (rawRow.Time_Cost && rawRow.Time_Cost.trim() !== '') {
    if (!isValidCost(rawRow.Time_Cost)) {
      errors.push(`Ligne ${lineNum} : Time_Cost "${rawRow.Time_Cost}" invalide (nombre >= 0 attendu, ex: "8,7" ou "8.7").`);
    }
  }

  // 4. Fixed_Cost (optionnel, float >= 0)
  if (rawRow.Fixed_Cost && rawRow.Fixed_Cost.trim() !== '') {
    if (!isValidCost(rawRow.Fixed_Cost)) {
      errors.push(`Ligne ${lineNum} : Fixed_Cost "${rawRow.Fixed_Cost}" invalide (nombre >= 0 attendu, ex: "109" ou "109.5").`);
    }
  }

  // 5. Cohérence : Time_Cost sans Duration_second n'a aucun effet
  const duration = convertDuration(rawRow.Duration_second);
  const timeCost = convertCost(rawRow.Time_Cost);
  if (duration === 0 && timeCost > 0) {
    // Avertissement non bloquant — on continue quand même
    console.warn(`[TicketCostImport] Ligne ${lineNum} : Time_Cost=${timeCost} renseigné mais Duration_second=0 → coût main d'œuvre sera 0.`);
  }

  if (errors.length > 0) return { data: null, errors };

  // ============================================================
  // NETTOYAGE ET CONVERSION
  // ============================================================

  return {
    errors: [],
    data: {
      // Référence pour résolution via refToGlpiId
      numTicket: rawRow.Num_Ticket.trim(),          // "1" — clé dans refToGlpiId

      // Champs convertis prêts pour POST /TicketCost
      actiontime:   convertDuration(rawRow.Duration_second), // 0 ou 600
      cost_time:    convertCost(rawRow.Time_Cost),           // 0 ou 8.7
      cost_fixed:   convertCost(rawRow.Fixed_Cost),          // 109.0 ou 50.0

      // Champs GLPI avec valeurs par défaut (absents du CSV)
      name:          "Coût import",
      comment:       "",
      begin_date:    null,
      end_date:      null,
      cost_material: 0,
      budgets_id:    0,
      entities_id:   0,
    }
  };
};