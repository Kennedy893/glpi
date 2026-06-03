import { useState } from 'react';
import { parseCsv } from '../../domain/models/utils/CsvParser';
import { validateAndMapUserRow } from '../../domain/models/users/UserImport';
import { ImportUserRepository } from '../../domain/repositories/ImportUserRepository';

export const useUserImporter = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const importCsv = async (file) => {
    setLoading(true);
    setLogs([]);
    setProgress(0);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        addLog("Lecture du fichier CSV...");
        
        // 1. Parsing fait main
        const rawRows = parseCsv(text);
        if (rawRows.length === 0) {
          addLog("❌ Le fichier CSV est vide ou invalide.");
          setLoading(false);
          return;
        }

        addLog(`Analyse et validation de ${rawRows.length} lignes...`);

        // 2. Phase de Validation
        const validatedRows = [];
        const allErrors = [];

        rawRows.forEach((rawRow, index) => {
          const { data, errors } = validateAndMapUserRow(rawRow, index);
          if (errors.length > 0) {
            allErrors.push(...errors);
          } else {
            validatedRows.push(data);
          }
        });

        // S'il y a la moindre erreur de validation, on stoppe tout avant d'appeler GLPI
        if (allErrors.length > 0) {
          addLog("❌ Échec de la validation du fichier. Corrigez les erreurs suivantes :");
          allErrors.forEach(err => addLog(err));
          setLoading(false);
          return;
        }

        addLog("✅ Validation réussie. Début de l'intégration GLPI...");

        // 3. Intégration séquentielle GLPI
        const totalRows = validatedRows.length;
        
        for (let i = 0; i < totalRows; i++) {
          const user = validatedRows[i];
          const userLogName = `${user.prenom} ${user.nom}`;

          try {
            addLog(`[${i + 1}/${totalRows}] Création de : ${userLogName}...`);

            // Règle : Localisation
            const locationId = await ImportUserRepository.getOrCreateLocation(user.localisation);
            
            // Règle : Groupe
            const groupId = await ImportUserRepository.getOrCreateGroup(user.groupe);

            // Règle : Profil & Entité
            const profileId = await ImportUserRepository.getProfileIdByName(user.profil);
            const entityId = await ImportUserRepository.getEntityIdByName(user.entite);

            if (!profileId) {
              throw new Error(`Profil "${user.profil}" introuvable dans GLPI.`);
            }

            // Règle : Création Utilisateur
            const userId = await ImportUserRepository.createUser({
              login: user.login,
              prenom: user.prenom,
              nom: user.nom,
              pwd: user.pwd,
              email: user.email,
              locationId: locationId
            });

            // Règle : Liaison Profil
            await ImportUserRepository.linkProfileToUser(userId, profileId, entityId);

            // Liaison Groupe (si présent)
            if (groupId) {
              await ImportUserRepository.linkGroupToUser(userId, groupId);
            }

            addLog(`✅ Succès pour ${userLogName} (ID : ${userId})`);
          } catch (error) {
            addLog(`❌ Erreur lors de l'intégration de ${userLogName} : ${error.message || error}`);
          }

          setProgress(Math.round(((i + 1) / totalRows) * 100));
        }

        addLog("🏁 Processus d'importation terminé.");

      } catch (err) {
        addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      addLog("❌ Erreur lors de la lecture physique du fichier.");
      setLoading(false);
    };

    // Déclenche la lecture du fichier en texte UTF-8
    reader.readAsText(file, 'UTF-8');
  };

  return { importCsv, loading, logs, progress };
};