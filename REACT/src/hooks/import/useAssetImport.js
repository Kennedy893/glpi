import { useState } from 'react';
import { parseCsv } from '../../domain/models/utils/CsvParser';
import { validateAndMapMaterielRow } from '../../domain/models/users/AssetImport';
import { ImportAssetRepository } from '../../domain/repositories/ImportAssetRepository';
import { ImportAssetVerif } from '../../domain/repositories/ImportAssetVerif';

export const useAssetImporter = () => {
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
          const { data, errors } = validateAndMapMaterielRow(rawRow, index);
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
          const computer = validatedRows[i];
          const computerLogName = `${computer.nom} ${computer.type}`;

          try {
            addLog(`[${i + 1}/${totalRows}] Création de : ${computerLogName}...`);

            // Regle : Manufacturer
            const manufacturerId = await ImportAssetVerif.getOrCreateManufacturer(computer.marque);

            // Regle : Model
            const modelId = await ImportAssetVerif.getOrCreateComputerModel(computer.modele);

            // Regle : State
            const stateId = await ImportAssetVerif.getOrCreateState(computer.etat);

            // Règle : Localisation
            const locationId = await ImportAssetVerif.getOrCreateLocation(computer.localisation);

            // Regle : DeviceMemory (RAM)
            const deviceMemoryId = await ImportAssetVerif.getOrCreateDeviceMemory(computer.ram);
            console.log('[DEBUG] deviceMemoryId reçu:', deviceMemoryId, 'Type:', typeof deviceMemoryId);

            // Regle : DeviceHardDrive (HDD)
            const deviceHDDId = await ImportAssetVerif.getOrCreateDeviceHardDrive(computer.stockage);
            
            // Regle : OS
            const deviceOSId = await ImportAssetVerif.getOrCreateOperatingSystem(computer.os);

            // Règle : Création Computer
            const computerId = await ImportAssetRepository.createComputer({
              "name":                computer.nom,
              "otherserial":         computer.reference,
              "serial":              computer.numero_serie,
              "manufacturers_id":    manufacturerId,
              "computermodels_id":   modelId,
              "states_id":           stateId,
              "locations_id":        locationId
            });

            // --- LIAISON ---

            // Regle : Liaison avec Infocom
            const infocomId = await ImportAssetRepository.createInfocom(computer, computerId);

            // Regle : Liaison avec ItemDeviceMemory
            const itemDeviceMemoryId = await ImportAssetRepository.createItemDeviceMemory(computer, computerId, deviceMemoryId);

            // Regle : Liaison avec ItemDeviceHDD
            const itemDeviceHDDId = await ImportAssetRepository.createItemDeviceHardDrive(computer, computerId, deviceHDDId);

            // Regle : liaison avec ItemOS
            // const itemDeviceOD = await ImportAssetRepository.createItemOS(computer, computerId, deviceOSId);

            addLog(`✅ Succès pour ${computerLogName} (ID : ${computerId})`);
          } catch (error) {
            addLog(`❌ Erreur lors de l'intégration de ${computerLogName} : ${error.message || error}`);
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