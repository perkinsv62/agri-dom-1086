
import React, { createContext, useContext, useState, useEffect } from 'react';



export interface CostData {
  name: string;
  value: number;
  color: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}


interface StatisticsContextType {
  revenueData: RevenueData[];
  setRevenueData: React.Dispatch<React.SetStateAction<RevenueData[]>>;
  costData?: CostData[];
}

const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};


const initialRevenueData = [
  { month: 'Thg 1', revenue: 28500, expenses: 20100, profit: 8400 },
  { month: 'Thg 2', revenue: 30200, expenses: 21800, profit: 8400 },
  { month: 'Thg 3', revenue: 32800, expenses: 22400, profit: 10400 },
  { month: 'Thg 4', revenue: 35500, expenses: 23100, profit: 12400 },
  { month: 'Thg 5', revenue: 38200, expenses: 23500, profit: 14700 },
  { month: 'Thg 6', revenue: 37800, expenses: 22900, profit: 14900 },
  { month: 'Thg 7', revenue: 42500, expenses: 24200, profit: 18300 },
  { month: 'Thg 8', revenue: 44800, expenses: 25300, profit: 19500 },
  { month: 'Thg 9', revenue: 40200, expenses: 24800, profit: 15400 },
  { month: 'Thg 10', revenue: 38200, expenses: 23100, profit: 15100 },
  { month: 'Thg 11', revenue: 36500, expenses: 22500, profit: 14000 },
  { month: 'Thg 12', revenue: 41200, expenses: 25800, profit: 15400 }
];

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  
  const [revenueDataState, setRevenueDataState] = useState<RevenueData[]>(initialRevenueData);
  const [costDataState] = useState<CostData[] | undefined>(undefined);

  return (
    <StatisticsContext.Provider
      value={{
        revenueData: revenueDataState,
        setRevenueData: setRevenueDataState,
        costData: costDataState,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
