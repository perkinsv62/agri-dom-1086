import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Kiểu cho context CRM toàn cục
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: Record<string, unknown>) => void;
  getModuleData: (moduleName: string) => Record<string, unknown> | undefined;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: unknown[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: Record<string, unknown>) => Promise<boolean>;
}

// Hook personnalisé pour gérer le contexte global du CRM
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({
    parcelles: {
      items: [
        { id: 1, nom: "Thửa Bắc", surface: 12.5, culture: "Mía", statut: "Đang trồng" },
        { id: 2, nom: "Thửa Nam", surface: 8.3, culture: "Chuối", statut: "Đang thu hoạch" },
        { id: 3, nom: "Thửa Đông", surface: 5.2, culture: "Dứa", statut: "Chuẩn bị" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Tên" },
        { key: "surface", header: "Diện tích (ha)" },
        { key: "culture", header: "Cây trồng" },
        { key: "statut", header: "Trạng thái" }
      ]
    },
    cultures: {
      items: [
        { id: 1, nom: "Mía", variete: "R579", dateDebut: "2023-03-15", dateFin: "2024-03-15" },
        { id: 2, nom: "Chuối", variete: "Grande Naine", dateDebut: "2023-02-10", dateFin: "2023-12-10" },
        { id: 3, nom: "Dứa", variete: "MD-2", dateDebut: "2023-05-05", dateFin: "2024-06-01" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Cây trồng" },
        { key: "variete", header: "Giống" },
        { key: "dateDebut", header: "Ngày bắt đầu" },
        { key: "dateFin", header: "Ngày kết thúc" }
      ]
    },
    finances: {
      items: [
        { id: 1, type: "revenu", montant: 15000, description: "Bán vụ thu hoạch mía", date: "2023-06-15" },
        { id: 2, type: "depense", montant: 5000, description: "Mua phân bón", date: "2023-05-10" },
        { id: 3, type: "revenu", montant: 8500, description: "Bán chuối", date: "2023-07-20" }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "date", header: "Ngày" },
        { key: "type", header: "Loại" },
        { key: "description", header: "Mô tả" },
        { key: "montant", header: "Số tiền (€)" }
      ]
    },
    statistiques: {
      items: [
        { periode: "2023-T1", cultureId: 1, rendement: 8.2, revenus: 12500, couts: 4200 },
        { periode: "2023-T2", cultureId: 1, rendement: 8.5, revenus: 13000, couts: 4100 },
        { periode: "2023-T1", cultureId: 2, rendement: 15.3, revenus: 7800, couts: 2100 }
      ],
      columns: [
        { key: "periode", header: "Kỳ" },
        { key: "cultureId", header: "ID Cây trồng" },
        { key: "rendement", header: "Năng suất (t/ha)" },
        { key: "revenus", header: "Doanh thu (€)" },
        { key: "couts", header: "Chi phí (€)" }
      ]
    },
    inventaire: {
      items: [
        { id: 1, nom: "Phân NPK", categorie: "Vật tư", quantite: 500, unite: "kg", prix: 2.5 },
        { id: 2, nom: "Thuốc sinh học", categorie: "Vật tư", quantite: 50, unite: "L", prix: 18.75 },
        { id: 3, nom: "Máy kéo", categorie: "Thiết bị", quantite: 2, unite: "chiếc", prix: 25000 }
      ],
      columns: [
        { key: "id", header: "ID" },
        { key: "nom", header: "Tên" },
        { key: "categorie", header: "Loại" },
        { key: "quantite", header: "Số lượng" },
        { key: "unite", header: "Đơn vị" },
        { key: "prix", header: "Đơn giá (€)" }
      ]
    }
  });
  const [activeModules, setActiveModules] = useState<string[]>([
    'parcelles',
    'cultures',
    'finances',
    'statistiques',
    'inventaire'
  ]);
  
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

  // Mettre à jour les données d'un module spécifique
  const updateModuleData = useCallback((moduleName: string, data: any) => {
    setModuleData(prevData => ({
      ...prevData,
      [moduleName]: {
        ...prevData[moduleName],
        ...data
      }
    }));
    
    // Mettre à jour la date de dernière synchronisation
    setLastSync(new Date());
  }, []);

  // Récupérer les données d'un module spécifique
  const getModuleData = useCallback((moduleName: string) => {
    return moduleData[moduleName] || {};
  }, [moduleData]);

  // Export module data to specified format
  const exportModuleData = useCallback(async (
    moduleName: string, 
    format: 'csv' | 'excel' | 'pdf',
    customData?: any[]
  ): Promise<boolean> => {
    // Use custom data if provided, otherwise get from module
    const data = customData || getModuleData(moduleName)?.items;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    try {
      let success = false;
      
      // Handle special cases like technical sheets and guides
      if (moduleName === 'fiche_technique') {
        return await exportToPDF(data, `${companyName}_fiche_technique`, {
          title: `${companyName} - Fiche Technique`,
          landscape: false,
          template: 'technical_sheet'
        });
      } else if (moduleName === 'guide_cultures') {
        return true;
      }
      
      // Standard formats
      switch (format) {
        case 'csv':
          success = exportToCSV(data, `${companyName}_${moduleName}`);
          break;
        case 'excel':
          success = exportToExcel(data, `${companyName}_${moduleName}`);
          break;
        case 'pdf':
          success = await exportToPDF(data, `${companyName}_${moduleName}`);
          break;
        default:
          return false;
      }
      
      return success;
    } catch (error) {
      console.error(`Error exporting ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Import module data
  const importModuleData = useCallback(async (moduleName: string, file: File): Promise<boolean> => {
    try {
      const importedData = await importFromCSV(file);
      
      if (importedData && importedData.length > 0) {
        updateModuleData(moduleName, {
          items: importedData
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error importing ${moduleName} data:`, error);
      return false;
    }
  }, [updateModuleData]);

  // Print module data
  const printModuleData = useCallback(async (moduleName: string, options?: any): Promise<boolean> => {
    const data = getModuleData(moduleName);
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return false;
    }
    
    const moduleNames: Record<string, string> = {
      parcelles: "Thửa đất",
      cultures: "Cây trồng",
      finances: "Tài chính",
      statistiques: "Thống kê",
      inventaire: "Tồn kho",
      fiche_technique: "Phiếu kỹ thuật"
    };
    
    const title = `${companyName} - ${moduleNames[moduleName] || moduleName}`;
    
    try {
      return await printData(
        data.items,
        title,
        data.columns || Object.keys(data.items[0]).map(key => ({ key, header: key })),
        options
      );
    } catch (error) {
      console.error(`Error printing ${moduleName} data:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

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
    activeModules,
    syncDataAcrossCRM,
    updateModuleData,
    getModuleData,
    exportModuleData,
    importModuleData,
    printModuleData
  };
};

export default useCRMContext;
