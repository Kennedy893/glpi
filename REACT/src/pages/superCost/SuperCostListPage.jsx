// pages/supercost/SuperCostListPage.jsx
import React from 'react';
import { useSuperCostList } from '../../hooks/supercost/useSuperCostList';
import { SuperCostTable } from '../../components/supercost/SuperCostTable';
import '../../assets/css/supercost/supercost-list.css';
import { useStatsCategorie } from '../../hooks/statsCategory/useStatsCategorie';

export const SuperCostListPage = () => {
    const { stats, loading, error } = useStatsCategorie();

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="supercost-container">
            <div className="supercost-header">
                <h1>Liste des couts</h1>
            </div>
            
            <SuperCostTable stats={stats} />
        </div>
    );
};