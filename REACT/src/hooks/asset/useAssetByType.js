import { useState } from "react";
import { AssetRepository } from "../../domain/repositories/AssetRepository"

export const useAssetByType = () => {

    const [asset, setAsset] = useState('');

    const assetByType = async (assetId, itemType) => {
        try {
            const response = await AssetRepository.getAssetByIdAndType(assetId, itemType);
            setAsset(response || {});
            return response;
        } catch (error) {
            console.log('[useAssetByType] erreur = ', error);
            
        }
    };

    return {
        assetByType,
        asset
    }
}