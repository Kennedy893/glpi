import { useState } from "react";
import { ImportTicketRepository } from "../../domain/repositories/ImportTicketRepository";
import { formatDateForGLPI } from "../../domain/models/utils/Convertiser";

export const useCreateTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const create = async (date, type, name, content, status, priority, assets) => {
        setLoading(true);
        setError('');
        
        try {
            // Convertir la date au format GLPI
            const formattedDate = formatDateForGLPI(date);
            
            console.log('[useCreateTicket] Date originale:', date);
            console.log('[useCreateTicket] Date formatée GLPI:', formattedDate);
            
            // Validation des champs obligatoires
            if (!name || name.trim() === '') {
                throw new Error('Le titre du ticket est obligatoire');
            }
            
            if (!content || content.trim() === '') {
                throw new Error('La description du ticket est obligatoire');
            }
            
            // 1- Créer le ticket (POST Ticket)
            const ticketData = {
                name: name.trim(),
                content: content.trim(),
                type: type || 1,        // 1 = Incident, 2 = Demande
                status: status || 1,    // 1 = Nouveau
                priority: priority || 3, // 1=Très haute, 2=Haute, 3=Moyenne, 4=Basse
            };
            
            // Ajouter la date seulement si elle existe
            if (formattedDate) {
                ticketData.date = formattedDate;
                // Ou selon l'API GLPI, peut-être "date_creation" ou "date_mod"
                // ticketData.date_creation = formattedDate;
            }
            
            console.log('[useCreateTicket] Données ticket à envoyer:', ticketData);
            
            const ticketId = await ImportTicketRepository.createTicket(ticketData);
            console.log('[Create ticket] ticketId = ', ticketId);
            
            if (!ticketId) {
                throw new Error('Impossible de créer le ticket');
            }
            
            // 2- Créer le lien Ticket<->Asset (POST Item_Ticket)   
            if (!assets || !Array.isArray(assets) || assets.length === 0) {
                console.warn('[Create ticket] Aucun asset à lier.');
                return ticketId;
            }
            
            // Créer les liens pour chaque asset
            const linkPromises = assets.map(asset => 
                ImportTicketRepository.createItemTicket({
                    tickets_id: ticketId,
                    itemtype: asset.itemtype || asset.type, // Support des deux formats
                    items_id: asset.id
                })
            );
            
            await Promise.all(linkPromises);
            console.log(`[Create ticket] ${assets.length} asset(s) lié(s) au ticket`);
            
            return ticketId;
            
        } catch (err) {
            console.error('[useCreateTicket] Erreur =', err);
            setError(err.message || 'Erreur lors de la création du ticket.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error };
};