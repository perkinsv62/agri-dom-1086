
import React, { createContext, useContext, ReactNode } from 'react';
import useCRMContext from '../hooks/use-crm-context';

// Création du contexte avec les types appropriés
interface CRMContextType {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: unknown) => void;
  getModuleData: (moduleName: string) => unknown;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: unknown[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: Record<string, unknown>) => Promise<boolean>;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

// Props pour le provider
interface CRMProviderProps {
  children: ReactNode;
}

// Provider qui va envelopper notre application
export const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const crmContext = useCRMContext();
  
  const contextValue: CRMContextType = {
    ...crmContext,
    activeModules: [],
    updateModuleData: () => {},
    getModuleData: () => ({}),
    exportModuleData: async () => false,
    importModuleData: async () => false,
    printModuleData: async () => false,
  };
  
  return (
    <CRMContext.Provider value={contextValue}>
      {children}
    </CRMContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useCRM = () => {
  const context = useContext(CRMContext);
  
  if (context === undefined) {
    throw new Error('useCRM phải được sử dụng bên trong một CRMProvider');
  }
  
  return context;
};

export default CRMContext;
