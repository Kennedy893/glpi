// components/AssetRow.jsx
import { useEffect, useState } from 'react';
import '../../assets/css/asset/asset-table.css';
import { useNavigate } from 'react-router-dom';
import { AssetRepository } from '../../domain/repositories/AssetRepository';
import { AssetImage } from './AssetImage';

export const AssetRow = ({ asset, onAssetClick }) => {

  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
      loadAssetImage();
  }, [asset.id]);

  const loadAssetImage = async () => {
      try {
          const image = await AssetRepository.getAssetImage(asset.id, asset.type);
          if (image && image.url) {
              setImageUrl(image.url);
          }
      } catch (error) {
          console.error('Erreur chargement image:', error);
      } finally {
          setImageLoading(false);
      }
  };

  const navigate = useNavigate();

  const handleRowClick = () => {
    // Appeler la fonction parent pour afficher les détails (dans une modal ou page)
    if (onAssetClick) {
      onAssetClick(asset);
    }
  };

//   const handleViewDetails = (e) => {
//     e.stopPropagation(); // Empêcher le déclenchement du clic sur la ligne
//     // Option 1: Naviguer vers une page de détail
//     navigate(`/assets/${asset.type}/${asset.id}`);
//     // Option 2: ou utiliser onAssetClick pour afficher une modal
//     // if (onAssetClick) onAssetClick(asset);
//   };

  // Icône selon le type d'équipement
  const getTypeIcon = (type) => {
    const icons = {
      Computer: '💻',
      Printer: '🖨️',
      Monitor: '🖥️',
      NetworkEquipment: '🌐',
      Phone: '📱',
      Peripheral: '🖱️'
    };
    return icons[type] || '📦';
  };

  // Classe CSS selon l'état
  const getStateClass = (stateName) => {
    const classes = {
      'En service': 'state-active',
      'En panne': 'state-broken',
      'En maintenance': 'state-maintenance',
      'Réformé': 'state-retired'
    };
    return classes[stateName] || 'state-default';
  };

  return (
    <tr className="asset-row" onClick={handleRowClick} style={{ cursor: 'pointer' }}>
      {/* Colonne image */}
      <td className="col-image">
      <AssetImage 
          asset={asset} 
          className="asset-thumbnail"
          fallbackIcon={getTypeIcon(asset.type)}
      />
      </td>
      
      {/* Icône + Nom */}
      <td className="col-name">
        {/* <span className="asset-icon">{getTypeIcon(asset.type)}</span> */}
        <span className="asset-name">{asset.name}</span>
      </td>
      
      {/* Type */}
      <td className="col-type">{asset.type}</td>
      
      {/* Marque */}
      <td className="col-manufacturer">{asset.manufacturer || '-'}</td>
      
      {/* Modèle */}
      <td className="col-model">{asset.model || '-'}</td>
      
      {/* Localisation */}
      <td className="col-location">{asset.location || '-'}</td>
      
      {/* État */}
      <td className="col-status">
        <span className={`state-badge ${getStateClass(asset.state)}`}>
          {asset.state || '-'}
        </span>
      </td>

      {/* User */}
      <td className="col-location">{asset.user || '-'}</td>

      {/* Actions */}
      {/* <td className="col-actions">
        <button 
          className="btn-view-details" 
          onClick={handleViewDetails}
          title="Voir les détails"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"/>
          </svg>
          Détails
        </button>
      </td> */}
    </tr>
  );
};