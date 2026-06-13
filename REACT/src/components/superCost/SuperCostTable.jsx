// components/supercost/SuperCostTable.jsx
import React from 'react';

const formatCurrency = (amount) => {
    return `${amount || 0} Ar`;
};

export const SuperCostTable = ({ stats }) => {
    if (stats.length === 0) {
        return <div className="empty-state">Aucun super cost enregistré</div>;
    }

    return (
        <div className="supercost-table-wrapper">
            <table className="supercost-table">
                <thead>
                    <tr>
                        <th>Type d'item</th>
                        <th>Coût GLPI</th>
                        <th>SuperCost</th>
                        <th>Coût Total</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((item) => (
                        <tr key={item.categorie}>
                            <td>
                                <strong>{item.categorie}</strong>
                            </td>
                            <td>{formatCurrency(item.totalGlpi)}</td>
                            <td>{formatCurrency(item.totalCout)}</td>
                            <td><strong>{formatCurrency(item.totalGeneral)}</strong></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalGlpi, 0))}</td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalCout, 0))}</td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalGeneral, 0))}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};