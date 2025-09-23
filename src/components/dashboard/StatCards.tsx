
import React from 'react';
import { TrendingUp } from 'lucide-react';
// EditableField removed; using plain inputs/spans

interface StatCardsProps {
  monthlyRevenue: number;
  revenueGrowth: number;
  cultivatedArea: number;
  parcelsCount: number;
  averageYield: number;
  yieldGrowth: number;
  // alertsCount intentionally omitted (not used in this component)
  handleRevenueChange: (_value: string | number) => void;
  handleRevenueGrowthChange: (_value: string | number) => void;
  handleAreaChange: (_value: string | number) => void;
  handleParcelsCountChange: (_value: string | number) => void;
  handleYieldChange: (_value: string | number) => void;
  handleYieldGrowthChange: (_value: string | number) => void;
}

const StatCards: React.FC<StatCardsProps> = ({
  monthlyRevenue,
  revenueGrowth,
  cultivatedArea,
  parcelsCount,
  averageYield,
  yieldGrowth,
  handleRevenueChange,
  handleRevenueGrowthChange,
  handleAreaChange,
  handleParcelsCountChange,
  handleYieldChange,
  handleYieldGrowthChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
      <div className="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Revenu mensuel</p>
            <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-800">
                <input
                  type="number"
                  className="inline-block border rounded px-2 py-1 w-32 text-3xl font-bold"
                  defaultValue={String(monthlyRevenue)}
                  onBlur={(e) => handleRevenueChange(Number(e.target.value))}
                /> €
              </p>
              <span className="text-green-600 text-sm font-medium flex items-center ml-3">
                <TrendingUp className="h-4 w-4 mr-1" /> +
                <input
                  type="number"
                  className="inline-block w-16 border rounded px-1 py-0.5"
                  defaultValue={String(revenueGrowth)}
                  onBlur={(e) => handleRevenueGrowthChange(Number(e.target.value))}
                />%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Superficie cultivée</p>
            <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-800">
                <input
                  type="number"
                  className="inline-block border rounded px-2 py-1 w-24 text-3xl font-bold"
                  defaultValue={String(cultivatedArea)}
                  onBlur={(e) => handleAreaChange(Number(e.target.value))}
                /> ha
              </p>
              <span className="text-agri-primary text-sm font-medium ml-3">
                <input
                  type="number"
                  className="inline-block w-16 border rounded px-1 py-0.5"
                  defaultValue={String(parcelsCount)}
                  onBlur={(e) => handleParcelsCountChange(Number(e.target.value))}
                /> parcelles
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="stat-card bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Rendement moyen</p>
            <div className="flex items-baseline">
                <p className="text-3xl font-bold text-gray-800">
                <input
                  type="number"
                  className="inline-block border rounded px-2 py-1 w-24 text-3xl font-bold"
                  defaultValue={String(averageYield)}
                  onBlur={(e) => handleYieldChange(Number(e.target.value))}
                /> t/ha
              </p>
              <span className="text-green-600 text-sm font-medium flex items-center ml-3">
                <TrendingUp className="h-4 w-4 mr-1" /> +
                <input
                  type="number"
                  className="inline-block w-16 border rounded px-1 py-0.5"
                  defaultValue={String(yieldGrowth)}
                  onBlur={(e) => handleYieldGrowthChange(Number(e.target.value))}
                />%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
