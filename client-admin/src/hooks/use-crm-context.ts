import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Kiểu cho context CRM toàn cục
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  syncDataAcrossCRM: () => void;
  
}

// Hook personnalisé pour gérer le contexte global du CRM
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
 
  
  // Nom de l'entreprise
  const companyName = 'Agri Dom';

  // Synchronisation des données à travers tous les modules du CRM
  const syncDataAcrossCRM = useCallback(() => {
    setIsRefreshing(true);
    
    // Simuler un temps de synchronisation
    setTimeout(() => {
      setLastSync(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  


  // Synchronisation initiale au chargement
  useEffect(() => {
    const initialSync = setTimeout(() => {
      syncDataAcrossCRM();
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, [syncDataAcrossCRM]);

  return {
    lastSync,
    isRefreshing,
    companyName,
    syncDataAcrossCRM,
  };
};

export default useCRMContext;
