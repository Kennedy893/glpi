import { useState } from 'react';
import { useAssetImporter }    from '../hooks/import/useAssetImport';
import { useTicketImport }     from '../hooks/import/useTicketImport';
import { useTicketCostImport } from '../hooks/import/useTicketCostImport';

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
  } = useTicketCostImport(refToGlpiId);

  const loading = loadingAsset || loadingTicket || loadingCost;
  const allLogs = [...logsAsset, ...logsTicket, ...logsCost];

  // Progression globale : moyenne des 3
  const globalProgress = Math.round((progressAsset + progressTicket + progressCost) / 3);

  const handleImportAll = async () => {
    if (!fileAsset || !fileTicket || !fileTicketCost) return;

    // Séquentiel : assets → tickets → coûts
    await importAssets(fileAsset);
    await importTickets(fileTicket);
    await importCosts(fileTicketCost);
  };

  const allFilesSelected = fileAsset && fileTicket && fileTicketCost;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Importation massive GLPI</h2>
      <p style={styles.subtitle}>Sélectionnez les 3 fichiers CSV puis lancez l'import.</p>

      {/* Sélection des 3 fichiers */}
      <div style={styles.filesSection}>

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
        style={{
          ...styles.button,
          background: !allFilesSelected || loading ? '#555' : '#4CAF50',
          cursor: !allFilesSelected || loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Importation en cours...' : "Lancer l'import"}
      </button>

      {!allFilesSelected && !loading && (
        <p style={styles.warning}>⚠️ Sélectionnez les 3 fichiers pour activer l'import.</p>
      )}

      {/* Progression globale */}
      {loading && (
        <div style={styles.progressSection}>
          <div style={styles.progressBars}>

            <ProgressBar label="Matériels"  value={progressAsset}  active={loadingAsset} />
            <ProgressBar label="Tickets"    value={progressTicket} active={loadingTicket} />
            <ProgressBar label="Coûts"      value={progressCost}   active={loadingCost} />

          </div>
          <p style={styles.progressGlobal}>Progression globale : {globalProgress}%</p>
        </div>
      )}

      {/* Logs unifiés */}
      <div style={styles.logsSection}>
        <h3 style={styles.logsTitle}>Logs de l'opération</h3>
        <div style={styles.logsBox}>
          {allLogs.length === 0
            ? <span style={styles.logsEmpty}>En attente de fichiers...</span>
            : allLogs.map((log, i) => (
                <div key={i} style={{
                  ...styles.logLine,
                  color: log.includes('❌') ? '#ff6b6b'
                       : log.includes('✅') ? '#69db7c'
                       : log.includes('⚠️') ? '#ffd43b'
                       : '#ccc'
                }}>
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
  <div style={styles.fileRow}>
    <span style={styles.fileLabel}>{label}</span>
    <label style={{
      ...styles.fileButton,
      opacity: disabled ? 0.5 : 1,
      cursor:  disabled ? 'not-allowed' : 'pointer',
    }}>
      {selected ? selected.name : 'Choisir un fichier'}
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
    </label>
    {selected && <span style={styles.fileCheck}>✅</span>}
  </div>
);

// ─── Composant ProgressBar ────────────────────────────────
const ProgressBar = ({ label, value, active }) => (
  <div style={styles.progressRow}>
    <span style={styles.progressLabel}>{label}</span>
    <div style={styles.progressTrack}>
      <div style={{
        ...styles.progressFill,
        width: `${value}%`,
        background: active ? '#4CAF50' : value === 100 ? '#69db7c' : '#555',
      }} />
    </div>
    <span style={styles.progressPct}>{value}%</span>
  </div>
);

// ─── Styles ───────────────────────────────────────────────
const styles = {
  page: {
    padding: '2rem 1.5rem',
    maxWidth: 800,
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    margin: '0 0 0.25rem 0',
    color: 'var(--color-text-primary, #111)',
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--color-text-secondary, #666)',
    margin: '0 0 1.5rem 0',
  },
  filesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: '1.5rem',
  },
  fileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--color-background-secondary, #f5f5f5)',
    borderRadius: 8,
    padding: '0.75rem 1rem',
  },
  fileLabel: {
    fontSize: 14,
    fontWeight: 500,
    minWidth: 220,
    color: 'var(--color-text-primary, #111)',
  },
  fileButton: {
    fontSize: 13,
    padding: '0.4rem 0.9rem',
    borderRadius: 6,
    background: 'var(--color-background-primary, #fff)',
    border: '1px solid var(--color-border-tertiary, #ddd)',
    color: 'var(--color-text-secondary, #444)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 260,
    display: 'inline-block',
  },
  fileCheck: { fontSize: 16 },
  button: {
    padding: '0.65rem 1.5rem',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  warning: {
    fontSize: 13,
    color: '#f0a500',
    marginTop: 8,
  },
  progressSection: {
    marginTop: '1.5rem',
  },
  progressBars: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  progressLabel: {
    fontSize: 13,
    minWidth: 90,
    color: 'var(--color-text-secondary, #666)',
  },
  progressTrack: {
    flex: 1,
    background: '#e0e0e0',
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  progressPct: {
    fontSize: 12,
    minWidth: 35,
    textAlign: 'right',
    color: 'var(--color-text-secondary, #666)',
  },
  progressGlobal: {
    fontSize: 13,
    color: 'var(--color-text-secondary, #666)',
    marginTop: 8,
    textAlign: 'right',
  },
  logsSection: {
    marginTop: '2rem',
  },
  logsTitle: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 8,
    color: 'var(--color-text-primary, #111)',
  },
  logsBox: {
    background: '#1e1e1e',
    borderRadius: 8,
    padding: '1rem',
    maxHeight: 320,
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 1.6,
  },
  logLine: {
    marginBottom: 2,
  },
  logsEmpty: {
    color: '#666',
  },
};