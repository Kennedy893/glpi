import { useState } from "react";
import { ImportTicketRepository } from "../../domain/repositories/ImportTicketRepository";
import { formatDateForGLPI } from "../../domain/models/utils/Convertiser";
import { TicketRepository } from "../../domain/repositories/TicketRepository";

export const useCreateTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastCreatedTicketId, setLastCreatedTicketId] = useState(null);

    const create = async (date, type, name, content, status, priority, assets, userId) => {
        setLoading(true);
        setError('');
        setLastCreatedTicketId(null);
        
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
            }
            
            console.log('[useCreateTicket] Données ticket à envoyer:', ticketData);
            
            const ticketId = await ImportTicketRepository.createTicket(ticketData);
            console.log('[Create ticket] ticketId = ', ticketId);
            
            if (!ticketId) {
                throw new Error('Impossible de créer le ticket');
            }
            
            setLastCreatedTicketId(ticketId);
            
            // 2- Ajouter l'utilisateur dans Ticket_User (type 1 = demandeur/requester)
            if (userId) {
                console.log('[Create ticket] Ajout de l\'utilisateur comme demandeur:', userId);
                try {
                    const relationId = await TicketRepository.addUserToTicket(ticketId, userId, 1);
                    console.log('[Create ticket] Relation Ticket_User créée, ID =', relationId);
                } catch (err) {
                    console.error('[Create ticket] Erreur lors de l\'ajout de l\'utilisateur:', err);
                    // Ne pas bloquer la création du ticket si l'ajout échoue
                }
            } else {
                console.warn('[Create ticket] Aucun userId fourni, pas de lien Ticket_User créé');
            }
            
            // 3- Créer le lien Ticket<->Asset (POST Item_Ticket)   
            if (assets && Array.isArray(assets) && assets.length > 0) {
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
            } else {
                console.warn('[Create ticket] Aucun asset à lier.');
            }
            
            return ticketId;
            
        } catch (err) {
            console.error('[useCreateTicket] Erreur =', err);
            setError(err.message || 'Erreur lors de la création du ticket.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour réinitialiser l'état
    const reset = () => {
        setError('');
        setLastCreatedTicketId(null);
    };

    return { 
        create, 
        loading, 
        error,
        lastCreatedTicketId,
        reset 
    };
};