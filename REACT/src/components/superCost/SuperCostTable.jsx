// components/supercost/SuperCostTable.jsx
import React, { useState } from 'react';
import { DetailsByCategorie } from './DetailsByCategorie';

const formatCurrency = (amount) => {
    // Vérifier si amount est un nombre
    if (amount === null || amount === undefined || isNaN(amount)) {
        return '0.00';
    }
    // Afficher avec 3 chiffres après la virgule
    return amount.toFixed(3);
};

export const SuperCostTable = ({ stats }) => {
    const [showModal, setShowModal] = useState(false);
    const [categorie, setCategorie] = useState('');

    const handleRowClick = (categorie) => {
        setCategorie(categorie);
        setShowModal(true);
    };
    
    if (stats.length === 0) {
        return <div className="empty-state">Aucun super cost enregistré</div>;
    }

    return (
        <div className="supercost-table-wrapper">
            <table className="supercost-table">
                <thead>
                    <tr>
                        <th>Type d'item</th>
                        <th>Cout GLPI</th>
                        <th>SuperCost</th>
                        <th>Cout Reouverture</th>
                        <th>Cout Total</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((item) => (
                        <tr key={item.categorie}>
                            <td onClick={() => handleRowClick(item.categorie)}  style={{ cursor: 'pointer' }}>
                                <strong>{item.categorie}</strong>
                            </td>
                            <td>{formatCurrency(item.totalGlpi)}</td>
                            <td>{formatCurrency(item.totalSuper)}</td>
                            <td>{formatCurrency(item.totalReouverture)}</td>
                            <td style={{ backgroundColor: "yellow" }}><strong>{formatCurrency(item.totalGeneral)}</strong></td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalGlpi, 0))}</td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalSuper, 0))}</td>
                        <td>{formatCurrency(stats.reduce((sum, i) => sum + i.totalReouverture, 0))}</td>
                        <td style={{ backgroundColor: "yellow" }}>{formatCurrency(stats.reduce((sum, i) => sum + i.totalGeneral, 0))}</td>
                    </tr>
                </tfoot>
            </table>

            {showModal && (
                <DetailsByCategorie
                    categorie={categorie}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
        
    );
};