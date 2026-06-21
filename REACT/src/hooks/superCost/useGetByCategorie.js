import { useState } from "react";
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository"

export const useGetByCategorie = () => {
    const [costs, setCosts] = useState([]);

    const getByCat = async (categorie) => {
        try {
            const response = await SuperCostRepository.getByCategorie(categorie);
            if (!response) {
                console.log('[getByCat] VIDE');
                
            }
            setCosts(response || []);
            console.log(costs);
            
        } catch (error) {
            console.log(error);
            
        }
    };

    return {
        getByCat,
        costs
    }
};