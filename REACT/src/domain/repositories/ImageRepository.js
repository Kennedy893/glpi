import JSZip from 'jszip';  // ← AJOUTER CETTE LIGNE
import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();


export const ImageRepository = {

    // Lire et extraire un fichier ZIP
    // domain/repositories/ImageRepository.js

async readZipFile(file) {
    try {
        console.log('[readZipFile] Début lecture du ZIP:', file.name);
        
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        
        const images = [];
        
        for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
            // Ignorer les dossiers
            if (zipEntry.dir) continue;
            
            // IGNORER les fichiers système macOS
            if (filename.includes('__MACOSX') || filename.includes('._')) {
                console.log(`[readZipFile] Ignoré (fichier système): ${filename}`);
                continue;
            }
            
            // Vérifier que c'est une image
            const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filename);
            if (!isImage) continue;
            
            // ✅ Extraire UNIQUEMENT le nom du fichier (sans le dossier)
            // Exemple: "images/PC-ADM-001.png" -> "PC-ADM-001.png"
            const filenameOnly = filename.split('/').pop();
            
            // Extraire le nom sans extension
            const imageName = filenameOnly.replace(/\.[^/.]+$/, '');
            
            const blob = await zipEntry.async('blob');
            
            images.push({
                originalPath: filename,
                name: filenameOnly,
                baseName: imageName,
                blob: blob,
                size: blob.size,
                type: blob.type
            });
            
            console.log(`[readZipFile] Image trouvée: ${filenameOnly} (${blob.size} bytes)`);
        }
        
        console.log(`[readZipFile] Total images trouvées: ${images.length}`);
        return images;
        
    } catch (error) {
        console.error('[readZipFile] Erreur:', error);
        throw error;
    }
},

    // Convertir Blob en Base64
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },

    // Associer une image à un asset (Document dans GLPI)
    async attachImageToAsset(imageBlob, filename, assetId, assetType = 'Computer') {
        try {
            // Récupérer la session token depuis l'apiClient
            const sessionToken = apiClient.sessionToken;
            const appToken = apiClient.appToken;
            const baseUrl = apiClient.baseUrl;
            
            // Créer le FormData
            const formData = new FormData();
            formData.append('filename', imageBlob, filename);
            
            const documentData = {
                input: [{
                    name: filename,
                    entities_id: 0,
                    is_recursive: 0,
                    documentcategories_id: 1,
                    date_creation: new Date().toISOString(),
                    comment: `Image associée à ${assetType} #${assetId}`
                }]
            };
            formData.append('uploadManifest', JSON.stringify(documentData));
            
            console.log('[attachImageToAsset] Upload du document:', filename);
            console.log('[attachImageToAsset] Document data:', JSON.stringify(documentData, null, 2));
            
            // ⚠️ Utiliser fetch directement pour le multipart
            const uploadResponse = await fetch(`${baseUrl}/Document`, {
                method: 'POST',
                headers: {
                    'App-Token': appToken,
                    'Session-Token': sessionToken,
                    // NE PAS mettre 'Content-Type' - fetch le définit automatiquement avec boundary
                },
                body: formData
            });
            
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('[attachImageToAsset] Upload échec:', uploadResponse.status, errorText);
                throw new Error(`Upload échec: ${uploadResponse.status}`);
            }
            
            const uploadResult = await uploadResponse.json();
            console.log('[attachImageToAsset] Upload résultat:', uploadResult);
            
            const documentId = uploadResult?.[0]?.id || uploadResult?.id;
            
            if (!documentId) {
                throw new Error('Impossible de récupérer l\'ID du document');
            }
            
            // Associer le document à l'asset (utiliser apiClient pour celui-ci)
            const linkPayload = {
                input: [{
                    documents_id: documentId,
                    itemtype: assetType,
                    items_id: assetId
                }]
            };
            
            console.log('[attachImageToAsset] Association payload:', JSON.stringify(linkPayload, null, 2));
            
            const linkResponse = await apiClient.post('Document_Item', linkPayload);
            console.log('[attachImageToAsset] Association réponse:', linkResponse);
            
            return {
                success: true,
                documentId: documentId,
                linked: true,
                filename: filename
            };
            
        } catch (error) {
            console.error('[attachImageToAsset] Erreur:', error);
            return {
                success: false,
                documentId: null,
                linked: false,
                filename: filename,
                error: error.message
            };
        }
    },

    // Déterminer le type d'asset à partir du préfixe du nom
    getAssetTypeFromName(assetName) {
        const prefix = assetName.split('-')[0].toUpperCase();
        
        const typeMapping = {
            'PC': 'Computer',
            'MN': 'Monitor',
            'PR': 'Printer',
            'SW': 'NetworkEquipment',
            'PH': 'Phone',
            'PE': 'Peripheral'
        };
        
        return typeMapping[prefix] || 'Computer'; // Par défaut Computer
    },
    
    // Extraire le nom de l'image sans extension
    // Exemple: "PC-ADM-001.png" -> "PC-ADM-001"
    getImageNameWithoutExtension(filename) {
        // 1. Enlever le dossier (ex: "images/PC-ADM-001.png" -> "PC-ADM-001.png")
        let name = filename.split('/').pop();
        
        // 2. Enlever l'extension (ex: "PC-ADM-001.png" -> "PC-ADM-001")
        name = name.replace(/\.[^/.]+$/, '');
        
        // 3. Enlever les caractères invisibles ou indésirables
        name = name.trim();
        
        console.log(`[cleanAssetName] "${filename}" -> "${name}"`); // Debug
        
        return name;
    },
    
    // Importer toutes les images du ZIP
    async importImagesZip(zipFile, assetMap) {
        // assetMap: { "PC-ADM-001": 272, "MN-FORM-002": 273, "PR-ADM-001": 274 }
        
        try {
            // 1. Lire le ZIP
            const images = await this.readZipFile(zipFile);

            // 🔥 DEBUG COMPLET
            console.log('=== DÉBUT DE L\'IMPORT IMAGES ===');
            console.log('assetMap (clés):', Object.keys(assetMap));
            console.log('Images trouvées:', images.map(i => i.cleanName));
            
            const results = {
                total: images.length,
                attached: 0,
                failed: 0,
                details: []
            };
            
            // 2. Pour chaque image, chercher l'asset correspondant
            for (const image of images) {
                // Nom de l'image sans extension (ex: "PC-ADM-001")
                const imageName = this.getImageNameWithoutExtension(image.name);
                
                // Chercher l'asset par son nom exact
                const assetId = assetMap[imageName];
                
                if (!assetId) {
                    results.failed++;
                    results.details.push({
                        image: image.name,
                        status: 'skipped',
                        reason: `Aucun asset trouvé avec le nom "${imageName}"`
                    });
                    continue;
                }
                
                // Déterminer le type d'asset à partir du nom
                const assetType = this.getAssetTypeFromName(imageName);
                
                // Associer l'image à l'asset
                const attachResult = await this.attachImageToAsset(
                    image.blob,
                    image.name,
                    assetId,
                    assetType
                );
                
                if (attachResult.linked) {
                    results.attached++;
                    results.details.push({
                        image: image.name,
                        status: 'attached',
                        assetId: assetId,
                        assetType: assetType,
                        documentId: attachResult.documentId
                    });
                } else {
                    results.failed++;
                    results.details.push({
                        image: image.name,
                        status: 'failed',
                        error: attachResult.error
                    });
                }
            }
            
            console.log('[importImagesZip] Résultats:', results);
            return results;
            
        } catch (error) {
            console.error('[importImagesZip] Erreur:', error);
            throw error;
        }
    },
}