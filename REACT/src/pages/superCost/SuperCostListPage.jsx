// pages/supercost/SuperCostListPage.jsx
import React from 'react';
import { useSuperCostList } from '../../hooks/supercost/useSuperCostList';
import { SuperCostTable } from '../../components/supercost/SuperCostTable';
import '../../assets/css/supercost/supercost-list.css';

export const SuperCostListPage = () => {
    const { items, loading, error, refresh } = useSuperCostList();

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="supercost-container">
            <div className="supercost-header">
                <h1>Liste des Items</h1>
                <button onClick={refresh} className="refresh-btn">Actualiser</button>
            </div>
            
            <SuperCostTable items={items} />
        </div>
    );
};