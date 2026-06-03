/**
 * Parse une chaîne CSV brute en un tableau d'objets standardisés.
 * @param {string} csvText - Le contenu brut du fichier CSV.
 * @returns {Array<Object>} Un tableau d'objets clé-valeur.
 */
export const parseCsv = (csvText) => {
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0 || !lines[0].trim()) return [];

  // Extraction et nettoyage des en-têtes (première ligne)
  const headers = splitCsvLine(lines[0]).map(h => h.trim());

  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Ignore les lignes vides

    const values = splitCsvLine(line);
    const rowObject = {};

    headers.forEach((header, index) => {
      // Si la valeur est absente, on met une chaîne vide
      rowObject[header] = values[index] !== undefined ? values[index].trim() : '';
    });

    result.push(rowObject);
  }

  return result;
};

/**
 * Découpe une ligne CSV en gérant les éventuels guillemets (RFC 4180 simplifié)
 */
const splitCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes; // Bascule l'état des guillemets
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
};