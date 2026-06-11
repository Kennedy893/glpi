// components/asset/AssetImage.jsx
import { useState, useEffect } from 'react';
import { getApiClient } from '../../domain/repositories/ApiClientRepository';

export const AssetImage = ({ asset, className }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
  const loadImage = async () => {
    setLoading(true);
    setError(false);

    try {
      const apiClient    = getApiClient();
      const sessionToken = apiClient.sessionToken;
      const appToken     = apiClient.appToken;
      const baseUrl      = apiClient.baseUrl;

      // 1. Récupérer le document lié à l'asset
      const docResponse = await apiClient.get(
        `Document_Item?searchText[items_id]=${asset.id}&searchText[itemtype]=${asset.type}`
      );

      if (!docResponse || docResponse.length === 0) {
        setLoading(false);
        return;
      }

      const documentId = docResponse[0].documents_id;
      if (!documentId) {
        setLoading(false);
        return;
      }

      // 2. Télécharger l'image avec les tokens dans les headers
      const downloadUrl = `${baseUrl}/Document/${documentId}?alt=media`;

      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'App-Token':     appToken,
          'Session-Token': sessionToken,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob      = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);

    } catch (err) {
      console.error('[AssetImage] Erreur:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  loadImage();

  return () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  };
}, [asset.id, asset.type]);
    
    const getIcon = () => {
        const icons = {
            Computer: '💻',
            Printer: '🖨️',
            Monitor: '🖥️',
            NetworkEquipment: '🌐',
            Phone: '📱',
            Peripheral: '🖱️'
        };
        return icons[asset.type] || '📦';
    };
    
    if (loading) {
        return <div className="image-placeholder loading"></div>;
    }
    
    if (imageUrl && !error) {
        return <img src={imageUrl} alt={asset.name} className={className} onError={() => setError(true)} />;
    }
    
    return (
        <div className="image-placeholder no-image">
            <span>{getIcon()}</span>
        </div>
    );
};