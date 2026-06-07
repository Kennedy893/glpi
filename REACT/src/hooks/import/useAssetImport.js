import { useState } from 'react';
import { parseCsv } from '../../domain/models/utils/CsvParser';
import { validateAndMapMaterielRow } from '../../domain/models/import/AssetImport';
import { ImportAssetRepository } from '../../domain/repositories/ImportAssetRepository';
import { ImportAssetVerif } from '../../domain/repositories/ImportAssetVerif';

export const useAssetImporter = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (message) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const importCsv = (file) => {
    return new Promise((resolve, reject) => {
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
            const asset = validatedRows[i];
            const assetLogName = `${asset.name} ${asset.glpiType}`;

            try {
              addLog(`[${i + 1}/${totalRows}] Création de : ${assetLogName}...`);

              // Regle : Manufacturer
              const manufacturerId = await ImportAssetVerif.getOrCreateManufacturer(asset.manufacturer);

              // Regle : State
              const stateId = await ImportAssetVerif.getOrCreateState(asset.status);

              // Règle : Localisation
              const locationId = await ImportAssetVerif.getOrCreateLocation(asset.location);

              // Regle : User
              const userId = await ImportAssetVerif.getOrCreateUser(asset.user);

              // Regle : DeviceMemory (RAM)
              // const deviceMemoryId = await ImportAssetVerif.getOrCreateDeviceMemory(asset.ram);
              // console.log('[DEBUG] deviceMemoryId reçu:', deviceMemoryId, 'Type:', typeof deviceMemoryId);

              // Regle : DeviceHardDrive (HDD)
              // const deviceHDDId = await ImportAssetVerif.getOrCreateDeviceHardDrive(asset.stockage);
              
              // Regle : OS
              // const deviceOSId = await ImportAssetVerif.getOrCreateOperatingSystem(asset.os);

              if (asset.glpiType === 'Computer' || asset.glpiType === 'Serveur') {
                  // Regle : Model
                  const modelId = await ImportAssetVerif.getOrCreateComputerModel(asset.modele);

                  // Règle : Création Computer
                  const computerId = await ImportAssetRepository.createComputer({
                      "name":                asset.name,
                      "otherserial":         asset.inventoryNumber,
                      "manufacturers_id":    manufacturerId,
                      "computermodels_id":   modelId,
                      "states_id":           stateId,
                      "locations_id":        locationId,
                      "users_id":            userId || 0
                  });

                  // --- LIAISON ---

                  // Regle : Liaison avec Infocom
                  // const infocomId = await ImportAssetRepository.createInfocom(asset, computerId);

                  // Regle : Liaison avec ItemDeviceMemory
                  // const itemDeviceMemoryId = await ImportAssetRepository.createItemDeviceMemory(asset, computerId, deviceMemoryId);

                  // Regle : Liaison avec ItemDeviceHDD
                  // const itemDeviceHDDId = await ImportAssetRepository.createItemDeviceHardDrive(asset, computerId, deviceHDDId);

                  addLog(`✅ Succès pour ${assetLogName} (ID : ${computerId})`);
              }

              else if (asset.glpiType === 'Monitor') {
                  // Regle : Model
                  const modelId = await ImportAssetVerif.getOrCreateMonitorModel(asset.modele)

                  // Regle : Creation Monitor
                  const monitorId = await ImportAssetRepository.createMonitor({
                      "name":                asset.name,
                      "otherserial":         asset.inventoryNumber,
                      "manufacturers_id":    manufacturerId,
                      "monitormodels_id":    modelId,
                      "states_id":           stateId,
                      "locations_id":        locationId,
                      "users_id":            userId || 0
                  });

                  // --- LIAISON ---

                  // Regle : Liaison avec Infocom
                  // const infocomId = await ImportAssetRepository.createInfocom(asset, printerId);

                  addLog(`✅ Succès pour ${assetLogName} (ID : ${monitorId})`);
              }
              
              // Regle : liaison avec ItemOS
              // const itemDeviceOD = await ImportAssetRepository.createItemOS(asset, computerId, deviceOSId);
            } catch (error) {
              addLog(`❌ Erreur lors de l'intégration de ${assetLogName} : ${error.message || error}`);
            }

            setProgress(Math.round(((i + 1) / totalRows) * 100));
          }

          addLog("🏁 Processus d'importation terminé.");
          resolve(); // ✅ signale la fin réelle
        } catch (err) {
          addLog(`❌ Erreur critique lors du traitement : ${err.message}`);
          resolve(); // resolve même en cas d'erreur pour ne pas bloquer la chaîne
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        addLog("❌ Erreur lors de la lecture physique du fichier.");
        setLoading(false);
        resolve(); // ne pas rejeter pour ne pas bloquer la chaîne
      };

      // Déclenche la lecture du fichier en texte UTF-8
      reader.readAsText(file, 'UTF-8');
    });

    
  }
  return { importCsv, loading, logs, progress };
};