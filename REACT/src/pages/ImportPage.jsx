// pages/ImportPage.jsx
import { useState, useEffect } from 'react';
import { useAssetImporter }    from '../hooks/import/useAssetImport';
import { useTicketImport }     from '../hooks/import/useTicketImport';
import { useTicketCostImport } from '../hooks/import/useTicketCostImport';
import { useImageImport } from '../hooks/import/useImageImport';
import { useAssetsImage } from '../hooks/asset/useAssetsImage';
import '../assets/css/import.css';
import { useResetData } from '../hooks/reset/useResetData';

export const ImportPage = () => {
  const [fileAsset,      setFileAsset]      = useState(null);
  const [fileTicket,     setFileTicket]     = useState(null);
  const [fileTicketCost, setFileTicketCost] = useState(null);
  const [fileZipImages,  setFileZipImages]  = useState(null); // Nouveau state pour le ZIP

  const [refToGlpiId, setRefToGlpiId] = useState({});
  
  // Récupérer tous les assets pour le mapping
  const { assets, loading: loadingAssets, refresh: refreshAssets } = useAssetsImage();

  // Hooks des 4 fichiers
  const {
    importCsv: importAssets,
    loading:   loadingAsset,
    logs:      logsAsset,
    progress:  progressAsset,
  } = useAssetImporter();

  const {
    importCsv: importTickets,
    loading:   loadingTicket,
    logs:      logsTicket,
    progress:  progressTicket,
  } = useTicketImport({ onComplete: setRefToGlpiId });

  const {
    importCsv: importCosts,
    loading:   loadingCost,
    logs:      logsCost,
    progress:  progressCost,
  } = useTicketCostImport();

  const {
    importZip: importImages,
    loading:   loadingImages,
    logs:      logsImages,
    progress:  progressImages,
  } = useImageImport();

  // RESET
  const { resetData, loading: resetting, logs: resetLogs } = useResetData();

  const loading = loadingAsset || loadingTicket || loadingCost || loadingImages || resetting;
  const allLogs = [...logsAsset, ...logsTicket, ...logsCost, ...logsImages, ...resetLogs];

  // Progression globale
  const globalProgress = Math.round((progressAsset + progressTicket + progressCost + progressImages) / 4);

  // ✅ Attendre que les assets soient chargés pour construire le mapping
  const assetMap = assets.reduce((map, asset) => {
    if (asset.name && asset.id) {
      map[asset.name] = asset.id;
    }
    return map;
  }, {});

  console.log('[ImportPage] assetMap construit:', Object.keys(assetMap).length, 'entrées');
  console.log('[ImportPage] Exemples d\'assets:', assets.slice(0, 3).map(a => ({ name: a.name, id: a.id })));

  // Rafraîchir les assets après l'import des matériels
  // useEffect(() => {
  //   if (!loadingAsset && progressAsset === 100) {
  //     refreshAssets();
  //   }
  // }, [loadingAsset, progressAsset, refreshAssets]);
  // pages/ImportPage.jsx

  const handleImportAll = async () => {
    console.log('[ImportPage] Début import...');
    let freshAssets = [];
    
    try {
      // 1. Importer les assets si un fichier est fourni
      if (fileAsset) {
        console.log('[ImportPage] Import des assets...');
        await importAssets(fileAsset);
        
        // Attendre que les assets soient rafraîchis
        console.log('[ImportPage] Rafraîchissement des assets...');
        freshAssets = await refreshAssets();
        
        console.log('[ImportPage] Assets frais reçus:', freshAssets?.length || 0);
        console.log('[ImportPage] Premiers assets:', freshAssets?.slice(0, 3));
        
        // Construire le mapping avec les assets frais
        const freshAssetMap = (freshAssets || []).reduce((map, asset) => {
          if (asset.name && asset.id) {
            map[asset.name] = asset.id;
            console.log(`[ImportPage] Mapping: ${asset.name} -> ${asset.id}`);
          }
          return map;
        }, {});
        
        console.log('[ImportPage] freshAssetMap construit:', Object.keys(freshAssetMap).length, 'entrées');
        console.log('[ImportPage] Clés du mapping:', Object.keys(freshAssetMap));
        
        // 2. Importer les images avec le mapping frais
        if (fileZipImages && Object.keys(freshAssetMap).length > 0) {
          console.log('[ImportPage] Import des images avec mapping...');
          await importImages(fileZipImages, freshAssetMap);
        } else if (fileZipImages && Object.keys(freshAssetMap).length === 0) {
          console.warn('[ImportPage] Pas de mapping disponible pour les images');
        }
      }
      
      // 3. Importer les tickets
      let table = null;
      if (fileTicket) {
        console.log('[ImportPage] Import des tickets...');
        table = await importTickets(fileTicket);
      }
      
      // 4. Importer les coûts des tickets
      if (fileTicketCost && table) {
        console.log('[ImportPage] Import des coûts...');
        await importCosts(fileTicketCost, table);
      }
      alert('✅ Import réussi !');


    } catch (error) {
      console.error('Erreur:', error);
      await resetData();
      alert(`❌ Import annulé - Rollback effectué\n\nErreur: ${error.message}`);
      await refreshAssets();
    }
  };

  const allFilesSelected = fileAsset && fileTicket && fileTicketCost && fileZipImages;

  const getLogClass = (log) => {
    if (log.includes('❌')) return 'error';
    if (log.includes('✅')) return 'success';
    if (log.includes('⚠️')) return 'warning';
    return 'info';
  };

  return (
    <div className="import-page">
      <h2 className="import-title">Importation massive GLPI</h2>
      <p className="import-subtitle">Sélectionnez les 4 fichiers puis lancez l'import.</p>

      {/* Sélection des 4 fichiers */}
      <div className="files-section">
        <FileInput
          label="Fichier 1 — Matériels (CSV)"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileAsset(f)}
          selected={fileAsset}
        />

        <FileInput
          label="Fichier 2 — Tickets (CSV)"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileTicket(f)}
          selected={fileTicket}
        />

        <FileInput
          label="Fichier 3 — Coûts des tickets (CSV)"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileTicketCost(f)}
          selected={fileTicketCost}
        />

        <FileInput
          label="Fichier 4 — Images des équipements (ZIP)"
          accept=".zip"
          disabled={loading}
          onChange={(f) => setFileZipImages(f)}
          selected={fileZipImages}
        />
      </div>

      {/* Affichage du nombre d'assets disponibles pour le mapping */}
      {Object.keys(assetMap).length > 0 && (
        <div className="asset-map-info">
          📊 {Object.keys(assetMap).length} équipements disponibles pour l'import des images
        </div>
      )}

      {/* Bouton unique */}
      <button
        onClick={handleImportAll}
        disabled={!allFilesSelected || loading}
        className={`import-button ${!allFilesSelected || loading ? 'disabled' : 'active'}`}
      >
        {loading ? 'Importation en cours...' : "Lancer l'import"}
      </button>

      {!allFilesSelected && !loading && (
        <p className="import-warning">⚠️ Sélectionnez les 4 fichiers pour activer l'import.</p>
      )}

      {/* Progression globale */}
      {loading && (
        <div className="progress-section">
          <div className="progress-bars">
            <ProgressBar label="Matériels"  value={progressAsset}  active={loadingAsset} />
            <ProgressBar label="Tickets"    value={progressTicket} active={loadingTicket} />
            <ProgressBar label="Coûts"      value={progressCost}   active={loadingCost} />
            <ProgressBar label="Images ZIP" value={progressImages} active={loadingImages} />
          </div>
          <p className="progress-global">Progression globale : {globalProgress}%</p>
        </div>
      )}

      {/* Logs unifiés */}
      <div className="logs-section">
        <h3 className="logs-title">Logs de l'opération</h3>
        <div className="logs-box">
          {allLogs.length === 0
            ? <span className="logs-empty">En attente de fichiers...</span>
            : allLogs.map((log, i) => (
                <div key={i} className={`log-line ${getLogClass(log)}`}>
                  {log}
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};

// ─── Composant FileInput ───────────────────────────────────
const FileInput = ({ label, accept, disabled, onChange, selected }) => (
  <div className="file-row">
    <span className="file-label">{label}</span>
    <label className={`file-button ${disabled ? 'disabled' : ''}`}>
      {selected ? selected.name : 'Choisir un fichier'}
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
    </label>
    {selected && <span className="file-check">✅</span>}
  </div>
);

// ─── Composant ProgressBar ────────────────────────────────
const ProgressBar = ({ label, value, active }) => (
  <div className="progress-row">
    <span className="progress-label">{label}</span>
    <div className="progress-track">
      <div 
        className={`progress-fill ${active ? 'active' : value === 100 ? 'completed' : 'inactive'}`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="progress-percent">{value}%</span>
  </div>
);