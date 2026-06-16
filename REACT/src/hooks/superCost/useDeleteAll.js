import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository"

export const useDeleteAll = () => {

    const deleteAll = async () => {
        try {
            const response = await SuperCostRepository.deleteAll();
        } catch (error) {
            console.error('[delete all supercosts]');
            console.log(error);
            
        }
    };

    return { deleteAll }
}