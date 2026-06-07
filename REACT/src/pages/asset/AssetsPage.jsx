// pages/AssetsPage.jsx
import { useAssets } from '../../hooks/asset/useAssets';
import { AssetList } from '../../components/asset/AssetList';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { useNavigate } from 'react-router-dom';

export const AssetsPage = () => {
  const { assets, loading, error, refresh } = useAssets();
  const navigate = useNavigate();

  const handleAssetClick = (asset) => {
    // Navigation vers la page de détail de l'équipement
    navigate(`/assets/${asset.type}/${asset.id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <div className="assets-page-container">
      <div className="assets-page-header">
        <h1>Liste du parc informatique</h1>
        <hr />
      </div>
      
      <AssetList 
        assets={assets} 
        onRefresh={refresh}
        onAssetClick={handleAssetClick}
      />
    </div>
  );
};