// components/supercost/SuperCostTable.jsx
import React from 'react';

const formatCurrency = (amount) => {
    return `${amount || 0} Ar`;
};

export const SuperCostTable = ({ items }) => {
    // if (items.length === 0) {
    //     return <div className="empty-state">Aucun super cost enregistré</div>;
    // }

    return (
        <div className="supercost-table-wrapper">
            <table className="supercost-table">
                <thead>
                    <tr>
                        <th>Type d'item</th>
                        <th>Nombre d'items</th>
                        <th>Coût GLPI</th>
                        <th>SuperCost</th>
                        <th>Coût Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.type}>
                            <td>
                                <strong>{item.type}</strong>
                            </td>
                            <td>{item.count}</td>
                            <td>{formatCurrency(item.glpiCost)}</td>
                            <td>{formatCurrency(item.superCost)}</td>
                            <td><strong>{formatCurrency(item.total)}</strong></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{items.reduce((sum, i) => sum + i.count, 0)}</td>
                        <td>{formatCurrency(items.reduce((sum, i) => sum + i.glpiCost, 0))}</td>
                        <td>{formatCurrency(items.reduce((sum, i) => sum + i.superCost, 0))}</td>
                        <td>{formatCurrency(items.reduce((sum, i) => sum + i.total, 0))}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};