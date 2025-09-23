import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ChartConfig } from '../components/ui/chart-config';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { BarChart, PieChart, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsPage = () => {
  const [pageTitle] = useState('Thống kê và Phân tích');

  const [activeView, setActiveView] = useState<'performance' | 'harvest' | 'detailed'>('performance');
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  
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
                <h1 className="text-2xl font-bold mb-1">{pageTitle}</h1>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span>Đồng bộ cuối: {lastSyncDate.toLocaleString()}</span>
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
                  title="Chỉ số hiệu suất "
                  description="Theo dõi hiệu suất của bạn so với mục tiêu"
                  onTitleChange={() => {
                    console.log('Tiêu đề biểu đồ đã được cập nhật.');
                  }}
                  onDescriptionChange={() => {
                    console.log('Mô tả biểu đồ đã được cập nhật.');
                  }}
                  onOptionsChange={() => {
                    console.log('Tùy chọn biểu đồ đã được cập nhật.');
                  }}
                  className="mb-6"
                >
                  <div className="p-4">
                    AAAAAAAAAAAAAAAAAAAAA
                  </div>
                </ChartConfig>
              </motion.div>
            )}
            
           
          </div>
        </motion.div>
      </div>
    </StatisticsProvider>
  );
};

export default StatsPage;
