import { useEffect, useState } from "react";
import { useAllReouvCosts } from "../../hooks/liste/useAllReouvCosts";
import { useAllSupCosts } from "../../hooks/liste/useAllSupCosts"
import { SuperCostRepository } from "../../domain/repositories/SuperCostRepository";

export const ListeCouts = () => {

    const [newSupCost, setNewSupCost] = useState('');
    const [newReouvCost, setNewReouvCost] = useState('');
    const [newMode, setNewMode] = useState('');

    const {superCosts} = useAllSupCosts();
    const {reouvCosts} = useAllReouvCosts();

    const updateSup = (id, cout) => {
        SuperCostRepository.updateSuper(id, cout);
    }

    const updateReouv = (id, cout, mode) => {
        SuperCostRepository.updateReouv(id, cout, mode);
    }

    

    // useEffect(() => {
    //     if (superCosts) {
    //         {superCosts.map((sup) => (
    //             setNewSupCost(sup.cout)
    //         ))}
    //     }
    // })

    if (superCosts.length === 0) {
        return <div className="empty-state">Aucun super cost enregistré</div>;
    }

    return (
        <div>
            <h2>SUPERCOSTS</h2>
            {superCosts.map((sup) => (
                <div>
                    <p>{sup.cout}</p>
                    <input key={sup.id} type="number" value={newSupCost} onChange={(e) => setNewSupCost(e.target.value)} />
                    <button onClick={() => updateSup(sup.id, newSupCost)}>Modifier</button>
                </div>
            ))}

            <hr />

            <h2>REOUVERTURE COSTS</h2>
            {reouvCosts.map((reouv) => (
                <div key={reouv.id}>
                    <p>{reouv.cout}</p>
                    <input key={reouv.id} type="number" value={newReouvCost} onChange={(e) => setNewReouvCost(e.target.value)} />
                    <select name="mode" id="" onChange={(e) => setNewMode(e.target.value)}>
                        <option value="1">mode 1</option>
                        <option value="2">mode 2</option>
                        <option value="3">mode 3</option>
                        <option value="4">mode 4</option>
                    </select>
                    <button onClick={() => updateReouv(reouv.id, newReouvCost, newMode)}>Modifier</button>
                </div>
            ))}
        
        </div>
    );
}