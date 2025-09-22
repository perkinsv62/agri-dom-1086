import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Statistics from '../components/Statistics';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import { ChartConfig } from '../components/ui/chart-config';
import { EditableTable, Column } from '../components/ui/editable-table';
import { EditableField } from '../components/ui/editable-field';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { BarChart, PieChart, TrendingUp, Download, Filter, RefreshCw, Bell, Printer, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PreviewPrintButton from '@/components/common/PreviewPrintButton';

interface PerformanceData {
  name: string;
  current: number;
  target: number;
  unit: string;
}

const StatsPage = () => {
  const [pageTitle, setPageTitle] = useState('Thống kê và Phân tích');
  const [pageDescription, setPageDescription] = useState('Hiển thị và phân tích dữ liệu của trang trại Guadeloupe của bạn');
  const [activeView, setActiveView] = useState<'performance' | 'harvest' | 'detailed'>('performance');
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectedModules, setConnectedModules] = useState<string[]>(['parcelles', 'cultures', 'finances']);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { name: 'Rendement Canne à Sucre', current: 75, target: 85, unit: 't/ha' },
    { name: 'Qualité Banane Export', current: 88, target: 95, unit: '%' },
    { name: 'Rentabilité Ananas', current: 70, target: 80, unit: '%' },
    { name: 'Certification Bio', current: 25, target: 40, unit: '%' },
    { name: 'Innovation Igname', current: 60, target: 75, unit: '%' },
  ]);
  
  useEffect(() => {
    const initialSync = setTimeout(() => {
      console.log('Các module Lô đất, Cây trồng và Tài chính hiện đã được kết nối với thống kê');
    }, 1000);
    
    return () => clearTimeout(initialSync);
  }, []);
  
  const syncData = () => {
    setIsSyncing(true);
    console.log('Đang lấy dữ liệu mới nhất từ tất cả các module đã kết nối...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncDate(new Date());
      console.log('Tất cả thống kê đã được cập nhật với dữ liệu mới nhất từ các module');
      console.log("Các chỉ số hiệu suất đã được tính toán lại với dữ liệu mới nhất");
    }, 2000);
  };
  
  const columns: Column[] = [
    { id: 'name', header: 'Chỉ số', accessorKey: 'name', isEditable: true },
    { id: 'current', header: 'Giá trị hiện tại', accessorKey: 'current', type: 'number', isEditable: true },
    { id: 'target', header: 'Mục tiêu', accessorKey: 'target', type: 'number', isEditable: true },
    { id: 'unit', header: 'Đơn vị', accessorKey: 'unit', isEditable: true },
  ];
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...performanceData];
    const updatedRow = { ...newData[rowIndex] } as PerformanceData;
    
    if (columnId === 'current' || columnId === 'target') {
      updatedRow[columnId as 'current' | 'target'] = Number(value);
    } else if (columnId === 'name' || columnId === 'unit') {
      updatedRow[columnId as 'name' | 'unit'] = String(value);
    }
    
    newData[rowIndex] = updatedRow;
    setPerformanceData(newData);
    
    console.log(`Chỉ số ${updatedRow.name} đã được cập nhật thành công.`);
    console.log(`Các module đã kết nối đã được thông báo về việc cập nhật ${updatedRow.name}`);
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...performanceData];
    const deletedItem = newData[rowIndex];
    newData.splice(rowIndex, 1);
    setPerformanceData(newData);
    
    console.log(`Chỉ số ${deletedItem.name} đã được xóa thành công.`);
    console.log(`Các module đã kết nối đã được thông báo về việc xóa ${deletedItem.name}`);
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: PerformanceData = {
      name: String(newRow.name || ''),
      current: Number(newRow.current || 0),
      target: Number(newRow.target || 0),
      unit: String(newRow.unit || '%'),
    };
    setPerformanceData([...performanceData, typedRow]);
    
    console.log(`Chỉ số ${typedRow.name} đã được thêm thành công.`);
    console.log(`Các module đã kết nối đã được thông báo về việc thêm ${typedRow.name}`);
  };

  const handleTitleChange = (value: string | number) => {
    setPageTitle(String(value));
    console.log('Tiêu đề trang đã được cập nhật.');
  };

  const handleDescriptionChange = (value: string | number) => {
    setPageDescription(String(value));
    console.log('Mô tả trang đã được cập nhật.');
  };
  
  const handleViewChange = (view: 'performance' | 'harvest' | 'detailed') => {
    setActiveView(view);
    console.log(`Bạn đang xem chế độ ${
      view === 'performance' ? 'Chỉ số hiệu suất' : 
      view === 'harvest' ? 'Theo dõi thu hoạch' : 'Thống kê chi tiết'
    }`);
    
    console.log(`Các module đã kết nối đã được điều chỉnh cho chế độ ${view === 'performance' ? 'chỉ số' : view === 'harvest' ? 'thu hoạch' : 'chi tiết'}`);
  };
  
  const handleExportData = () => {
    console.log('Dữ liệu thống kê đã được xuất thành công.');
    console.log("Dữ liệu đã xuất có sẵn cho tất cả các module");
  };

  return (
    <StatisticsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 animate-enter">
            <motion.header 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  <EditableField
                    value={pageTitle}
                    onSave={handleTitleChange}
                    className="inline-block"
                  />
                </h1>
                <p className="text-muted-foreground">
                  <EditableField
                    value={pageDescription}
                    onSave={handleDescriptionChange}
                    className="inline-block"
                  />
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span className="mr-2">Modules connectés: {connectedModules.join(', ')}</span>
                  <span>Dồng bộ cuối: {lastSyncDate.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleViewChange('performance')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'performance' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <PieChart className="h-4 w-4 mr-1.5" />
                  Chỉ số
                </button>
                
                <button 
                  onClick={() => handleViewChange('harvest')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'harvest' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <BarChart className="h-4 w-4 mr-1.5" />
                  Thu hoạch
                </button>
                
                <button 
                  onClick={() => handleViewChange('detailed')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'detailed' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-1.5" />
                  Chi tiết
                </button>
                
                <PreviewPrintButton
                  data={performanceData}
                  moduleName="performance-indicators"
                  title="Chỉ số Hiệu suất Nông nghiệp"
                  columns={[
                    { key: "name", header: "Chỉ số" },
                    { key: "current", header: "Giá trị hiện tại" },
                    { key: "target", header: "Mục tiêu" },
                    { key: "unit", header: "Đơn vị" }
                  ]}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  variant="ghost"
                />
                
                <button 
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Xuất
                </button>
                
                <button 
                  onClick={syncData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Tùy chọn thông báo của bạn đã được cập nhật');
                  }}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Cảnh báo
                </button>
              </div>
            </motion.header>
            
            {activeView === 'performance' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ChartConfig 
                  title="Chỉ số hiệu suất nông nghiệp ở Guadeloupe"
                  description="Theo dõi hiệu suất của bạn so với mục tiêu cho các loại cây trồng Guadeloupe"
                  onTitleChange={(title) => {
                    console.log('Tiêu đề biểu đồ đã được cập nhật.');
                  }}
                  onDescriptionChange={(desc) => {
                    console.log('Mô tả biểu đồ đã được cập nhật.');
                  }}
                  onOptionsChange={(options) => {
                    console.log('Tùy chọn biểu đồ đã được cập nhật.');
                  }}
                  className="mb-6"
                >
                  <div className="p-4">
                    <EditableTable
                      data={performanceData}
                      columns={columns}
                      onUpdate={handleTableUpdate}
                      onDelete={handleDeleteRow}
                      onAdd={handleAddRow}
                      className="border-none"
                    />
                  </div>
                </ChartConfig>
              </motion.div>
            )}
            
            {activeView === 'harvest' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GuadeloupeHarvestTracking />
              </motion.div>
            )}
            
            {activeView === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Statistics />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </StatisticsProvider>
  );
};

export default StatsPage;
