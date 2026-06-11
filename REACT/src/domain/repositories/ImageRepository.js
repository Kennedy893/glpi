import JSZip from 'jszip';
import { getApiClient } from './ApiClientRepository';

// On récupère le client une bonne fois pour toutes au chargement du fichier
const apiClient = getApiClient();

// Fonction utilitaire pour convertir une image en JPEG
async function convertToJPEG(blob, originalFilename) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(blob);
        
        img.onload = () => {
            // Créer un canvas pour la conversion
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Convertir en JPEG avec qualité 0.9 (90%)
            canvas.toBlob((jpegBlob) => {
                URL.revokeObjectURL(url);
                
                // Changer l'extension du fichier
                const newFilename = originalFilename.replace(/\.[^/.]+$/, '.jpg');
                
                resolve({
                    blob: jpegBlob,
                    filename: newFilename,
                    type: 'image/jpeg',
                    size: jpegBlob.size
                });
            }, 'image/jpeg', 0.9);
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error(`Impossible de convertir l'image: ${originalFilename}`));
        };
        
        img.src = url;
    });
}

export const ImageRepository = {

    // Lire et extraire un fichier ZIP
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
                const filenameOnly = filename.split('/').pop();
                
                // Extraire le nom sans extension
                const imageName = filenameOnly.replace(/\.[^/.]+$/, '');
                
                let blob = await zipEntry.async('blob');
                let finalFilename = filenameOnly;
                let finalBlob = blob;
                let wasConverted = false;
                
                // 🔥 CONVERSION EN JPEG si ce n'est pas déjà du JPEG/JPG
                const extension = filenameOnly.split('.').pop().toLowerCase();
                if (extension !== 'jpg' && extension !== 'jpeg') {
                    console.log(`[readZipFile] Conversion en JPEG: ${filenameOnly}`);
                    try {
                        const converted = await convertToJPEG(blob, filenameOnly);
                        finalBlob = converted.blob;
                        finalFilename = converted.filename;
                        wasConverted = true;
                        console.log(`[readZipFile] Conversion réussie: ${filenameOnly} -> ${finalFilename} (${finalBlob.size} bytes)`);
                    } catch (error) {
                        console.error(`[readZipFile] Erreur conversion ${filenameOnly}:`, error);
                        // Si la conversion échoue, on ignore l'image
                        continue;
                    }
                }
                
                images.push({
                    originalPath: filename,
                    name: finalFilename,
                    originalName: filenameOnly,
                    baseName: imageName,
                    blob: finalBlob,
                    size: finalBlob.size,
                    type: 'image/jpeg', // Maintenant toujours du JPEG
                    wasConverted: wasConverted
                });
                
                console.log(`[readZipFile] Image ajoutée: ${finalFilename} (${finalBlob.size} bytes)${wasConverted ? ' [convertie]' : ''}`);
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
            const sessionToken = apiClient.sessionToken;
            const appToken = apiClient.appToken;
            const baseUrl = apiClient.baseUrl;
            
            // 🔥 1. Nettoyer le nom du fichier
            const cleanFilename = filename.split('/').pop();
            const nameWithoutExt = cleanFilename.replace(/\.[^/.]+$/, '');
            
            // 🔥 2. Maintenant toujours en JPEG
            const mimeType = 'image/jpeg';
            
            // 🔥 3. Créer un Blob avec le bon type MIME
            const correctBlob = new Blob([imageBlob], { type: mimeType });
            
            const formData = new FormData();
            
            // 🔥 4. Ajouter le fichier
            formData.append('filename', correctBlob, cleanFilename);
            
            // 🔥 5. Manifest
            const documentData = {
                input: {
                    name: nameWithoutExt,
                    entities_id: 0,
                    is_recursive: 0,
                    documentcategories_id: 0,
                    is_active: 1,
                    mime: mimeType,
                    comment: `Image associée à ${assetType} #${assetId}`
                }
            };
            
            formData.append('uploadManifest', JSON.stringify(documentData));
            
            console.log('[attachImageToAsset] Upload:', {
                filename: cleanFilename,
                mimeType: mimeType,
                size: correctBlob.size,
                manifest: documentData
            });
            
            const uploadResponse = await fetch(`${baseUrl}/Document`, {
                method: 'POST',
                headers: {
                    'App-Token': appToken,
                    'Session-Token': sessionToken,
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                console.error('Upload échec:', uploadResponse.status, errorText);
                throw new Error(`Upload échec: ${uploadResponse.status}`);
            }
            
            const uploadResult = await uploadResponse.json();
            console.log('Upload succès:', uploadResult);
            
            const documentId = uploadResult?.id || uploadResult?.[0]?.id;
            
            if (!documentId) {
                throw new Error('Impossible de récupérer ID document');
            }
            
            // Associer à l'asset
            const linkPayload = {
                input: {
                    documents_id: documentId,
                    itemtype: assetType,
                    items_id: assetId
                }
            };
            
            await apiClient.post('Document_Item', linkPayload);
            
            return { success: true, documentId, linked: true };
            
        } catch (error) {
            console.error('[attachImageToAsset] Erreur:', error);
            return { success: false, error: error.message };
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
        
        return typeMapping[prefix] || 'Computer';
    },
    
    // Extraire le nom de l'image sans extension
    getImageNameWithoutExtension(filename) {
        // 1. Enlever le dossier
        let name = filename.split('/').pop();
        
        // 2. Enlever l'extension
        name = name.replace(/\.[^/.]+$/, '');
        
        // 3. Enlever les caractères invisibles ou indésirables
        name = name.trim();
        
        console.log(`[cleanAssetName] "${filename}" -> "${name}"`);
        
        return name;
    },
    
    // Importer toutes les images du ZIP
    async importImagesZip(zipFile, assetMap) {
        try {
            // 1. Lire le ZIP (avec conversion automatique)
            const images = await this.readZipFile(zipFile);

            console.log('=== DÉBUT DE L\'IMPORT IMAGES ===');
            console.log('assetMap (clés):', Object.keys(assetMap));
            console.log('Images trouvées:', images.map(i => ({ 
                name: i.name, 
                original: i.originalName,
                converted: i.wasConverted 
            })));
            
            const results = {
                total: images.length,
                attached: 0,
                failed: 0,
                details: []
            };
            
            // 2. Pour chaque image, chercher l'asset correspondant
            for (const image of images) {
                // Utiliser le nom original (sans conversion) pour la correspondance
                const originalName = image.originalName || image.name;
                const imageName = this.getImageNameWithoutExtension(originalName);
                
                // Chercher l'asset par son nom exact
                const assetId = assetMap[imageName];
                
                if (!assetId) {
                    results.failed++;
                    results.details.push({
                        image: originalName,
                        convertedTo: image.wasConverted ? image.name : null,
                        status: 'skipped',
                        reason: `Aucun asset trouvé avec le nom "${imageName}"`
                    });
                    continue;
                }
                
                // Déterminer le type d'asset à partir du nom
                const assetType = this.getAssetTypeFromName(imageName);
                
                // Associer l'image à l'asset (maintenant toujours en JPEG)
                const attachResult = await this.attachImageToAsset(
                    image.blob,
                    image.name, // Utiliser le nouveau nom si converti
                    assetId,
                    assetType
                );
                
                if (attachResult.linked) {
                    results.attached++;
                    results.details.push({
                        image: originalName,
                        convertedTo: image.wasConverted ? image.name : null,
                        status: 'attached',
                        assetId: assetId,
                        assetType: assetType,
                        documentId: attachResult.documentId
                    });
                } else {
                    results.failed++;
                    results.details.push({
                        image: originalName,
                        convertedTo: image.wasConverted ? image.name : null,
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



// Fonction convertToJPEG : Convertit n'importe quelle image (PNG, GIF, WEBP, BMP) en JPEG en utilisant un canvas HTML.

// Conversion automatique dans readZipFile :

// Vérifie l'extension de chaque image

// Si ce n'est pas du JPG/JPEG, convertit automatiquement

// Garde une trace des images converties avec wasConverted

// Gestion des erreurs : Si la conversion échoue, l'image est ignorée avec un log d'erreur.

// Conservation des noms :

// originalName : nom original du fichier

// name : nouveau nom avec extension .jpg si converti

// La correspondance avec assetMap utilise toujours le nom original

// Qualité JPEG : Réglée à 90% (0.9) pour un bon équilibre qualité/taille.