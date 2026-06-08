/**
 * Convertit une date au format GLPI (YYYY-MM-DD HH:MM:SS)
 * @param {Date|string} date - Date à convertir
 * @returns {string} Date formatée pour GLPI
 */
export const formatDateForGLPI = (date) => {
    if (!date) return null;
    
    let dateObj;
    
    // Si c'est déjà une chaîne, essayer de la parser
    if (typeof date === 'string') {
        // Si déjà au bon format GLPI
        if (date.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
            return date;
        }
        // Si c'est une date ISO
        if (date.includes('T')) {
            dateObj = new Date(date);
        } 
        // Format DD/MM/YYYY
        else if (date.includes('/')) {
            const parts = date.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                dateObj = new Date(`${year}-${month}-${day}`);
            }
        }
        // Format YYYY-MM-DD
        else if (date.includes('-')) {
            dateObj = new Date(date);
        }
    } 
    // Si c'est déjà un objet Date
    else if (date instanceof Date) {
        dateObj = date;
    }
    
    if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('[formatDateForGLPI] Date invalide:', date);
        return null;
    }
    
    // Formater: YYYY-MM-DD HH:MM:SS
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Convertit la date au format GLPI (sans heure - pour date simple)
 * @param {Date|string} date - Date à convertir
 * @returns {string} Date formatée YYYY-MM-DD
 */
export const formatDateOnlyForGLPI = (date) => {
    if (!date) return null;
    
    let dateObj;
    
    if (typeof date === 'string') {
        // Si déjà au bon format GLPI
        if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return date;
        }
        // Format DD/MM/YYYY
        if (date.includes('/')) {
            const parts = date.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                return `${year}-${month}-${day}`;
            }
        }
        dateObj = new Date(date);
    } else if (date instanceof Date) {
        dateObj = date;
    }
    
    if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('[formatDateOnlyForGLPI] Date invalide:', date);
        return null;
    }
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
};