import { useState } from "react";
import { useNewImport } from "../hooks/import/useNewImport";

export const NewImportPage = () => {

    const [file,      setFile]      = useState(null);

    // const refToGlpiId = {};
    // refToGlpiId["1"] = 208;
    // refToGlpiId["2"] = 209;

    const refToGlpiId = {
        "1": 214,
        "2": 215
    };

    const {
        importCsv: importCsv,
        loading:   loadingCost,
        logs:      logsCost,
        progress:  progressCost,
      } = useNewImport();

    const handleImport = async () => {
        console.log('Debut Import...');
        
        try {
            if (file) {
                await importCsv(file, refToGlpiId);
                // alert('✅ Import réussi !');
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    return (
        <div className="import-page">
            <h2 className="import-title">Importation evenements GLPI</h2>

            {/* Sélection du fichier */}
            <div className="files-section">
                <FileInput
                    label="Fichier (CSV)"
                    accept=".csv"
                    // disabled={loading}
                    onChange={(f) => setFile(f)}
                    selected={file}
                />
            </div>

            <button
                onClick={handleImport}
                // disabled={!allFilesSelected || loading}
                // className={`import-button ${!allFilesSelected || loading ? 'disabled' : 'active'}`}
            >
                {/* {loading ? 'Importation en cours...' : "Lancer l'import"} */}
                Importer
            </button>

            {/* Logs unifiés */}
            <div className="logs-section">
                <h3 className="logs-title">Logs de l'opération</h3>
                
                
                {logsCost.message}
            </div>
        </div>

        
    )


};

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