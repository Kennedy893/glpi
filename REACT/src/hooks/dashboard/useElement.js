import { useEffect, useState } from "react";
import { DashboardRepository } from "../../domain/repositories/DashboardRepository";

export const useElement = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [nbComputers, setNbComputers] = useState(0);
    const [nbMonitors, setNbMonitors] = useState(0);
    const [nbPrinters, setNbPrinters] = useState(0);
    const [nbNetworkEquipments, setNbNetworkEquipments] = useState(0);
    const [nbPhones, setNbPhones] = useState(0);
    const [nbPeripherals, setNbPeripherals] = useState(0);
    const [nbTotalAsset, setNbTotalAsset] = useState(0);

    useEffect(() => {

        const loadData = async () => {
            try {
                setLoading(true);

                const computers = await DashboardRepository.nbTotalAsset('Computer');
                const monitors = await DashboardRepository.nbTotalAsset('Monitor');
                const printers = await DashboardRepository.nbTotalAsset('Printer');
                const networkEquipments = await DashboardRepository.nbTotalAsset('NetworkEquipment');
                const phones = await DashboardRepository.nbTotalAsset('Phone');
                const peripherals = await DashboardRepository.nbTotalAsset('Peripheral');

                setNbComputers(computers);
                setNbMonitors(monitors);
                setNbPrinters(printers);
                setNbNetworkEquipments(networkEquipments);
                setNbPhones(phones);
                setNbPeripherals(peripherals);

                setNbTotalAsset(
                    computers +
                    monitors +
                    printers +
                    networkEquipments +
                    phones +
                    peripherals
                );

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();

    }, []);

    return {
        nbComputers,
        nbMonitors,
        nbPrinters,
        nbNetworkEquipments,
        nbPhones,
        nbPeripherals,
        nbTotalAsset,
        loading,
        error
    };
};