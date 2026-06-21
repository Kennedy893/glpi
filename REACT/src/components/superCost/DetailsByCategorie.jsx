import '../../assets/css/ticket/ticket-details-modal.css';
import { useEffect, useState } from "react";
import { useGetByCategorie } from "../../hooks/superCost/useGetByCategorie";
import { useAssetByType } from '../../hooks/asset/useAssetByType';

export const DetailsByCategorie = ({categorie, onClose}) => {
    const [isVisible, setIsVisible] = useState(false);
    const[enrichCosts, setEnrichedCosts] = useState([]);

    const { getByCat, costs } = useGetByCategorie();
    useEffect(() => {
        if (categorie) {
            getByCat(categorie);
        }
    }, [categorie]);

    const {assetByType} = useAssetByType();
    // Enrichir les coûts avec les noms des assets
    useEffect(() => {
        const enrichCosts = async () => {
            if (costs.length === 0) return;

            const enriched = [];
            for (const cost of costs) {
                // ✅ Récupérer l'asset directement depuis la fonction
                const asset = await assetByType(cost.itemId, categorie);
                enriched.push({
                    ...cost,
                    assetName: asset?.name || `Item #${cost.itemId}`
                });
                console.log('Asset récupéré:', asset?.name);
            }
            setEnrichedCosts(enriched);
        };

        enrichCosts();
    }, [costs, categorie]);

    useEffect(() => {
        // Animation d'entrée
        setTimeout(() => setIsVisible(true), 10);
        
        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        handleClose();
        }
    };

    return (
        <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={handleBackdropClick}>
            <div className={`modal-container ${isVisible ? 'visible' : ''}`}>
                <div className="modal-header">
                    <h2 className="modal-title">{categorie}</h2>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </div>
                
                <div className="modal-body">
                
                    {costs.length === 0 && (
                        <p>Aucun détail trouvé pour cette catégorie</p>
                    )}
                    
                    { costs.length > 0 && (
                        
                        <table border={1}>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Coût GLPI</th>
                                    <th>Super Cost</th>
                                    <th>Coût Réouverture</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrichCosts.map((cost) => (
                                    <tr key={cost.id || cost.itemId}>
                                        <td>{cost.assetName}</td>
                                        <td>{cost.type_cout === 2 ? cost.cout : 0}</td>
                                        <td>{cost.type_cout === 1 ? cost.cout : 0}</td>
                                        <td>{cost.type_cout === 3 ? cost.cout : 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
