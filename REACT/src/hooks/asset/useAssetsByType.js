import { useState, useEffect } from "react";
import { AssetRepository } from "../../domain/repositories/AssetRepository"; // ✅ import

export const useAssetsByType = () => {
  const [computers,        setComputers]        = useState([]);
  const [printers,         setPrinters]         = useState([]);
  const [monitors,         setMonitors]         = useState([]);
  const [networkEquipments,setNetworkEquipments] = useState([]);
  const [phones,           setPhones]           = useState([]);
  const [peripherals,      setPeripherals]      = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);

  useEffect(() => {                              // ✅ useEffect obligatoire
    const loadAll = async () => {               // ✅ fonction async à l'intérieur
      setLoading(true);
      setError(null);

      try {
        const [
          computersData,
          printersData,
          monitorsData,
          networkData,
          phonesData,
          peripheralsData,
        ] = await Promise.all([                 // ✅ await dans une fonction async
          AssetRepository.getAllAsset('Computer'),
          AssetRepository.getAllAsset('Printer'),
          AssetRepository.getAllAsset('Monitor'),
          AssetRepository.getAllAsset('NetworkEquipment'),
          AssetRepository.getAllAsset('Phone'),
          AssetRepository.getAllAsset('Peripheral'),
        ]);

        // ✅ setters appelés après le await
        setComputers(computersData);
        setPrinters(printersData);
        setMonitors(monitorsData);
        setNetworkEquipments(networkData);
        setPhones(phonesData);
        setPeripherals(peripheralsData);

      } catch (err) {
        console.error('Erreur lors de la récupération des assets:', err);
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []); // ✅ tableau vide = chargement une seule fois au montage

  return {
    computers,
    printers,
    monitors,
    networkEquipments,
    phones,
    peripherals,
    loading,
    error,
  };
};