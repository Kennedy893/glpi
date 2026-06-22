export const useListe = (ticketsStatusMap, setTicketsStatusMap) => {
    
    if (newStatusId === 2 &&  currentStatusId === 6 && extraData.pourcentageReouverture && extraData.mode) 
    {
        console.log(extraData.pourcentageReouverture);
        console.log('mode', extraData.mode);
        
        // Récupérer les items du ticket
        const items = await TicketRepository.getItemsByTicket(ticket.id);
        const nbItems = items.length;
        const superCost = await SuperCostRepository.getLastSuperCost(ticket.id);
        console.log(superCost);

        const firstSuperCost = await SuperCostRepository.getFirstSuperCost(ticket.id);

        const sumSP = await SuperCostRepository.getSumSuperCost(ticket.id);
        let coutSomme = 0;
        if (Array.isArray(sumSP) && sumSP.length > 0) {
            coutSomme = sumSP[0][3] || 0;
            console.log('💰 Premier cout:', coutSomme);
        } else {
            console.log('Aucune donnée');
        }

        const averageSP = await SuperCostRepository.getAvgSuperCost(ticket.id);
        let coutAvg = 0;
        if (Array.isArray(averageSP) && averageSP.length > 0) {
            coutAvg = averageSP[0][3] || 0;
            console.log('💰 Premier cout:', coutAvg);
        } else {
            console.log('Aucune donnée');
        }

        let cost = 0;
        if (nbItems > 0 && extraData.pourcentageReouverture && parseFloat(extraData.pourcentageReouverture) > 0) 
        {
            // 1- COUT FARANY
            if (extraData.mode === '1') {
            cost = parseFloat(superCost[0].cout || 0) * extraData.pourcentageReouverture / 100;  
            }

            // 2- COUT VOALOHANY
            else if (extraData.mode === '2') {
                cost = parseFloat(firstSuperCost[0].cout || 0) * extraData.pourcentageReouverture / 100;
            }

            // 3- MOYENNE DES COUTS
            else if (extraData.mode === '3') {
            cost = parseFloat(coutAvg || 0) * extraData.pourcentageReouverture / 100;
            // console.log('shshshshshshs', cost);
            
            }

            // 4- SOMME DES COUTS
            else if (extraData.mode === '4') {
            cost = parseFloat(coutSomme || 0) * extraData.pourcentageReouverture / 100;
            }
            
            console.log('cosssssst', cost);
            
            
            // Créer un supercost pour chaque item
            for (const item of items) {
                try {
                    // Créer le Cout glpi
                    await SuperCostRepository.createReouvertureCost({
                        ticketId: ticket.id,
                        itemId: item.id,
                        cost: cost || 0,
                        categorie: item.itemType || item.type,
                        mode: parseFloat(extraData.mode)
                    });
                } catch (error) {
                    console.error(`Erreur pour l'item ${item.id}:`, error);
                }
            }
            
            console.log(`💰 ${nbItems} Reouverture créée pour le ticket ${ticket.id}`);
        } else if (nbItems === 0) {
            console.warn(`⚠️ Aucun item trouvé pour le ticket ${ticket.id}`);
        }
    }
}