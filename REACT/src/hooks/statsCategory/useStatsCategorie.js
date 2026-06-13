import { useCallback, useEffect, useState } from "react"
import { StatsCategoryRepository } from "../../domain/repositories/StatsCategoryRepository";

export const useStatsCategorie = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState([]);

    const loadStats = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const statistics = await StatsCategoryRepository.getStatsCategory();
            if (!statistics) {
                setError('Erreur chargement des stats par categorie');
                return;
            }
            setStats(statistics);
        } catch (error) {
            console.error(err);
            setError('Erreur chargement des stats par categorie');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    },[loadStats]);

    return {
        stats, loading, error
    }
}