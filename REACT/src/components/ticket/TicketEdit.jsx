import { useGetTicket } from '../../hooks/ticket/useGetTicket';
import { useModifTicket } from '../../hooks/ticket/useModifTicket';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const TicketEditPage = () => {
    const { id } = useParams(); // Récupère l'ID du ticket depuis l'URL
    const navigate = useNavigate();

    const { modifTicket } = useModifTicket();
    const { getTicket, ticket, loading, error } = useGetTicket();

    const [formData, setFormData] = useState({
        name: '',
        content: '',
        status: 1,
        date: ''
    });

    // Charger le ticket au montage du composant
    useEffect(() => {
        if (id) {
        loadTicket();
        }
    }, [id]);

    const loadTicket = async () => {
        const response = await getTicket(id);
        if (response.success && response.data) {
        setFormData({
            name: response.data.name || '',
            content: response.data.content || '',
            status: response.data.status || 1,
            date: response.data.date
        });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const update = await modifTicket(id, formData);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange}/>

            <label>Content</label>
            <textarea value={formData.content} name="content" onChange={handleInputChange}/>

            <label>Statut</label>
            <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
            >
                <option value="1">🟢 Nouveau</option>
                <option value="2">🟡 En cours</option>
                <option value="3">🔵 Résolu</option>
                <option value="4">⚫ Fermé</option>
                <option value="5">🔴 Annulé</option>
            </select>

            <label>Date</label>
            <input type="datetime-local" name="date" value={formData.date}/>

            <button>Modifier</button>
        </form>
    );
}