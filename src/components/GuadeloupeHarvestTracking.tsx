
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EditableTable, Column } from './ui/editable-table';
import { Tractor, Carrot, ArrowUp, ArrowDown } from 'lucide-react';
import { useStatistics } from '../contexts/StatisticsContext';
import PreviewPrintButton from './common/PreviewPrintButton';

interface HarvestData {
  crop: string;
  currentYield: number;
  previousYield: number;
  unit: string;
  harvestArea: number;
  quality: 'Xuất sắc' | 'Tốt' | 'Trung bình' | 'Kém';
}

const GuadeloupeHarvestTracking = () => {
  const { yieldData } = useStatistics();
  
  // Convertir les données de rendement pour les adapter au format attendu
  const [harvestData, setHarvestData] = useState<HarvestData[]>(
    yieldData.map(item => ({
      crop: item.name,
      currentYield: item.current,
      previousYield: item.previous,
      unit: item.unit,
      harvestArea: item.name === 'Canne à Sucre' ? 12500 :
                   item.name === 'Banane' ? 2300 :
                   item.name === 'Ananas' ? 350 :
                   item.name === 'Igname' ? 420 : 180,
      quality: item.name === 'Banane' ? 'Xuất sắc' :
               item.name === 'Ananas' || item.name === 'Canne à Sucre' || item.name === 'Madère' ? 'Tốt' : 'Trung bình'
    }))
  );
  
  // Colonnes pour le tableau éditable
  const columns: Column[] = [
    { id: 'crop', header: 'Cây trồng', accessorKey: 'crop', isEditable: true },
    { id: 'currentYield', header: 'Năng suất hiện tại', accessorKey: 'currentYield', type: 'number', isEditable: true },
    { id: 'previousYield', header: 'Năng suất trước đó', accessorKey: 'previousYield', type: 'number', isEditable: true },
    { id: 'unit', header: 'Đơn vị', accessorKey: 'unit', isEditable: true },
    { id: 'harvestArea', header: 'Diện tích (ha)', accessorKey: 'harvestArea', type: 'number', isEditable: true },
    { id: 'quality', header: 'Chất lượng', accessorKey: 'quality', isEditable: true }
  ];
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...harvestData];
    const updatedRow = { ...newData[rowIndex] };
    
    if (columnId === 'currentYield' || columnId === 'previousYield' || columnId === 'harvestArea') {
      (updatedRow as any)[columnId] = Number(value);
    } else if (columnId === 'crop' || columnId === 'unit' || columnId === 'quality') {
      (updatedRow as any)[columnId] = String(value);
    }
    
    newData[rowIndex] = updatedRow as HarvestData;
    setHarvestData(newData);
    console.log('Dữ liệu thu hoạch đã được cập nhật');
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...harvestData];
    newData.splice(rowIndex, 1);
    setHarvestData(newData);
    console.log('Cây trồng đã được xóa khỏi theo dõi');
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: HarvestData = {
      crop: String(newRow.crop || ''),
      currentYield: Number(newRow.currentYield || 0),
      previousYield: Number(newRow.previousYield || 0),
      unit: String(newRow.unit || 't/ha'),
      harvestArea: Number(newRow.harvestArea || 0),
      quality: (newRow.quality as HarvestData['quality']) || 'Trung bình'
    };
    setHarvestData([...harvestData, typedRow]);
    console.log('Cây trồng mới đã được thêm vào theo dõi');
  };
  
  // Données pour le graphique comparatif
  const chartData = harvestData.map(item => ({
    name: item.crop,
    actuel: item.currentYield,
    précédent: item.previousYield,
    différence: item.currentYield - item.previousYield,
    unité: item.unit
  }));

  // Prepare data for preview/print
  const printData = harvestData.map(item => ({
    culture: item.crop,
    rendement_actuel: `${item.currentYield} ${item.unit}`,
    rendement_precedent: `${item.previousYield} ${item.unit}`,
    surface: `${item.harvestArea} ha`,
    qualite: item.quality,
    evolution: `${item.currentYield > item.previousYield ? '+' : ''}${(item.currentYield - item.previousYield)} ${item.unit}`
  }));
  
  // Columns for preview/print
  const printColumns = [
    { key: "culture", header: "Cây trồng" },
    { key: "rendement_actuel", header: "Năng suất hiện tại" },
    { key: "rendement_precedent", header: "Năng suất trước đó" },
    { key: "surface", header: "Diện tích (ha)" },
    { key: "qualite", header: "Chất lượng" },
    { key: "evolution", header: "Sự thay đổi" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Tractor className="h-6 w-6 mr-2 text-agri-primary" />
              Theo dõi Thu hoạch tại Guadeloupe
            </h2>
            <p className="text-muted-foreground">
              Theo dõi năng suất và chất lượng thu hoạch cho các loại cây trồng chính của Guadeloupe
            </p>
          </div>
          
          <PreviewPrintButton 
            data={printData} 
            moduleName="harvest_data"
            title="Theo dõi Thu hoạch tại Guadeloupe"
            columns={printColumns}
            variant="outline"
          />
        </div>
        
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (name === 'différence') {
                    return [`${Number(value) > 0 ? '+' : ''}${value} ${props.payload.unité}`, 'Sự thay đổi'];
                  }
                  return [`${value} ${props.payload.unité}`, name];
                }}
              />
              <Legend />
              <Bar name="Năng suất hiện tại" dataKey="actuel" fill="#4CAF50" />
              <Bar name="Năng suất trước đó" dataKey="précédent" fill="#8D6E63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {harvestData.map(item => {
            const change = item.currentYield - item.previousYield;
            const changePercent = ((change / item.previousYield) * 100).toFixed(1);
            const isPositive = change >= 0;
            
            return (
              <div key={item.crop} className="bg-muted/30 rounded-lg p-4 border">
                <h3 className="font-medium mb-1 flex items-center">
                  <Carrot className="h-4 w-4 mr-1.5 text-agri-primary" />
                  {item.crop}
                </h3>
                <div className="text-2xl font-bold">{item.currentYield} {item.unit}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-agri-success' : 'text-agri-danger'}`}>
                  {isPositive ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Chất lượng: <span className="font-medium">{item.quality}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <EditableTable
          data={harvestData}
          columns={columns}
          onUpdate={handleTableUpdate}
          onDelete={handleDeleteRow}
          onAdd={handleAddRow}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default GuadeloupeHarvestTracking;
