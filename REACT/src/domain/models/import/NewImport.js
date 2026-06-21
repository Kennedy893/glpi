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

export const validateRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2;

  if (errors.length > 0) return { data: null, errors };

  return {
    errors: [],
    data: {
        ticket: rawRow.ticket,
        mvt: rawRow.mvt,
        valeur: convertCost(rawRow.valeur),
        mode: rawRow.mode
    }
  };
};