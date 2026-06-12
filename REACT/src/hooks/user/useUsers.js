import { useEffect, useState } from "react";
import { UserRepository } from "../../domain/repositories/UserRepository";

export const useUsers = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');
            
            try {
                // UserRepository.getTechniciens() retourne directement un tableau
                const data = await UserRepository.getTechniciens();
                
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    console.warn('[useUsers] La réponse n\'est pas un tableau:', data);
                    setUsers([]);
                }
            } catch (err) {
                console.error('[useUsers] Erreur:', err);
                setError(err.message || 'Erreur lors du chargement des techniciens');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error
    };
};