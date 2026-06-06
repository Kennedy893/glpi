import { useState } from 'react';
import { useAssetImporter } from '../hooks/import/useAssetImport';
import { useTicketImport } from '../hooks/import/useTicketImport';

export const UserImportPage = () => {
  const [file, setFile] = useState(null);
  // const { importCsv, loading, logs, progress } = useAssetImporter();
  const { importCsv, loading, logs, progress } = useTicketImport();

  const handleFileChange = (e) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      importCsv(file);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Importation massive d'utilisateurs GLPI</h2>
      
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        disabled={loading} 
      />
      
      <button 
        onClick={handleUpload} 
        disabled={!file || loading}
        style={{ marginLeft: '10px' }}
      >
        {loading ? 'Importation en cours...' : "Lancer l'import"}
      </button>

      {loading && (
        <div style={{ marginTop: '20px' }}>
          <label>Progression : {progress}%</label>
          <div style={{ width: '100%', background: '#eee', borderRadius: '4px' }}>
            <div style={{ width: `${progress}%`, background: '#4CAF50', height: '10px', borderRadius: '4px' }} />
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Logs de l'opération :</h3>
        <div style={{ 
          background: '#1e1e1e', 
          color: '#fff', 
          padding: '15px', 
          borderRadius: '5px',
          maxHeight: '300px', 
          overflowY: 'auto',
          fontFamily: 'monospace'
        }}>
          {logs.length === 0 && <li>En attente de fichier...</li>}
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};