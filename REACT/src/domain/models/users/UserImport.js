/**
 * Valide le format d'une date (DD/MM/YYYY) et s'assure qu'elle est valide
 */
const isValidDate = (dateStr) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  const [day, month, year] = dateStr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

/**
 * Valide le format d'un e-mail
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valide et transforme une ligne brute du CSV en entité exploitable.
 * @param {Object} rawRow - Ligne brute issue du parser
 * @param {number} index - Index de la ligne pour les logs d'erreurs
 * @returns {{ data: Object|null, errors: string[] }}
 */
export const validateAndMapUserRow = (rawRow, index) => {
  const errors = [];
  const lineNum = index + 2; // +1 pour l'index 0, +1 pour la ligne d'en-tête

  // 1. Validation de la date
  if (!rawRow.date_creation) {
    errors.push(`Ligne ${lineNum} : La date de création est obligatoire.`);
  } else if (!isValidDate(rawRow.date_creation)) {
    errors.push(`Ligne ${lineNum} : La date "${rawRow.date_creation}" est invalide (format attendu: DD/MM/YYYY).`);
  }

  // 2. Validation de l'email
  if (!rawRow.email) {
    errors.push(`Ligne ${lineNum} : L'adresse email est obligatoire.`);
  } else if (!isValidEmail(rawRow.email)) {
    errors.push(`Ligne ${lineNum} : L'email "${rawRow.email}" a un format invalide.`);
  }

  // 3. Validation des champs textuels obligatoires
  const requiredFields = {
    nom: 'Le nom',
    prenom: 'Le prénom',
    login: 'Le login',
    pwd: 'Le mot de passe',
    profil: 'Le profil',
    entite: "L'entité"
  };

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!rawRow[field] || rawRow[field].trim() === '') {
      errors.push(`Ligne ${lineNum} : ${label} est manquant.`);
    }
  });

  // 4. Exemple de validation numérique/montant (si ton CSV venait à en avoir)
  if (rawRow.montant) {
    const montantNum = Number(rawRow.montant);
    if (isNaN(montantNum)) {
      errors.push(`Ligne ${lineNum} : Le montant doit être un nombre.`);
    } else if (montantNum < 0) {
      errors.push(`Ligne ${lineNum} : Le montant ne peut pas être négatif (${rawRow.montant}).`);
    }
  }

  // Si des erreurs existent, on ne renvoie pas de données à traiter
  if (errors.length > 0) {
    return { data: null, errors };
  }

  // Retourne l'objet standardisé et nettoyé
  return {
    errors: [],
    data: {
      dateCreation: rawRow.date_creation,
      nom: rawRow.nom.trim(),
      prenom: rawRow.prenom.trim(),
      email: rawRow.email.trim(),
      login: rawRow.login.trim(),
      pwd: rawRow.pwd, // On ne trim pas le mot de passe (les espaces comptent !)
      profil: rawRow.profil.trim(),
      groupe: rawRow.groupe ? rawRow.groupe.trim() : null,
      entite: rawRow.entite.trim(),
      localisation: rawRow.localisation ? rawRow.localisation.trim() : null,
    }
  };
};