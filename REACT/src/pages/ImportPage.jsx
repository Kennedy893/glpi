import { useState } from 'react';
import { useAssetImporter }    from '../hooks/import/useAssetImport';
import { useTicketImport }     from '../hooks/import/useTicketImport';
import { useTicketCostImport } from '../hooks/import/useTicketCostImport';
import '../assets/css/import.css';

export const ImportPage = () => {
  const [fileAsset,      setFileAsset]      = useState(null);
  const [fileTicket,     setFileTicket]     = useState(null);
  const [fileTicketCost, setFileTicketCost] = useState(null);

  const [refToGlpiId, setRefToGlpiId] = useState({});

  // Hooks des 3 fichiers
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

  const loading = loadingAsset || loadingTicket || loadingCost;
  const allLogs = [...logsAsset, ...logsTicket, ...logsCost];

  // Progression globale : moyenne des 3
  const globalProgress = Math.round((progressAsset + progressTicket + progressCost) / 3);

  const handleImportAll = async () => {
    if (!fileAsset || !fileTicket || !fileTicketCost) return;

    await importAssets(fileAsset);

    // Récupérer la table directement depuis le retour de importTickets
    const table = await importTickets(fileTicket);
    console.log('[ImportPage] table reçue =', table); // vérification

    // Passer la table directement à importCosts — pas via le state
    await importCosts(fileTicketCost, table);
  };

  const allFilesSelected = fileAsset && fileTicket && fileTicketCost;

  const getLogClass = (log) => {
    if (log.includes('❌')) return 'error';
    if (log.includes('✅')) return 'success';
    if (log.includes('⚠️')) return 'warning';
    return 'info';
  };

  return (
    <div className="import-page">
      <h2 className="import-title">Importation massive GLPI</h2>
      <p className="import-subtitle">Sélectionnez les 3 fichiers CSV puis lancez l'import.</p>

      {/* Sélection des 3 fichiers */}
      <div className="files-section">
        <FileInput
          label="Fichier 1 — Matériels"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileAsset(f)}
          selected={fileAsset}
        />

        <FileInput
          label="Fichier 2 — Tickets"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileTicket(f)}
          selected={fileTicket}
        />

        <FileInput
          label="Fichier 3 — Coûts des tickets"
          accept=".csv"
          disabled={loading}
          onChange={(f) => setFileTicketCost(f)}
          selected={fileTicketCost}
        />
      </div>

      {/* Bouton unique */}
      <button
        onClick={handleImportAll}
        disabled={!allFilesSelected || loading}
        className={`import-button ${!allFilesSelected || loading ? 'disabled' : 'active'}`}
      >
        {loading ? 'Importation en cours...' : "Lancer l'import"}
      </button>

      {!allFilesSelected && !loading && (
        <p className="import-warning">⚠️ Sélectionnez les 3 fichiers pour activer l'import.</p>
      )}

      {/* Progression globale */}
      {loading && (
        <div className="progress-section">
          <div className="progress-bars">
            <ProgressBar label="Matériels"  value={progressAsset}  active={loadingAsset} />
            <ProgressBar label="Tickets"    value={progressTicket} active={loadingTicket} />
            <ProgressBar label="Coûts"      value={progressCost}   active={loadingCost} />
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