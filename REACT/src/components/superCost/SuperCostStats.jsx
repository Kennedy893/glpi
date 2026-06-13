// // components/supercost/SuperCostStats.jsx
// import React from 'react';

// export const SuperCostStats = ({ stats, formatCurrency }) => {
//     const statCards = [
//         {
//             label: "Nombre d'items",
//             value: stats.totalItems,
//             icon: "📦",
//             color: "blue"
//         },
//         {
//             label: "Total GLPI",
//             value: formatCurrency(stats.totalGlpiCost),
//             icon: "💰",
//             color: "gray"
//         },
//         {
//             label: "Total SuperCosts",
//             value: formatCurrency(stats.totalSuperCost),
//             icon: "➕",
//             color: "supercost"
//         },
//         {
//             label: "Grand Total",
//             value: formatCurrency(stats.totalGeneral),
//             icon: "🎯",
//             color: "total"
//         }
//     ];

//     return (
//         <div className="stats-footer">
//             {statCards.map((card, index) => (
//                 <div key={index} className={`stat-card ${card.color}`}>
//                     <div className="stat-icon">{card.icon}</div>
//                     <div className="stat-info">
//                         <span className="stat-label">{card.label}</span>
//                         <span className="stat-value">{card.value}</span>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };