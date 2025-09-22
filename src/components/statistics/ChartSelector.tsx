
import React from 'react';
import { BarChart2, LineChart, PieChart, BarChart3, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ChartSelectorProps {
  currentChart: 'yields' | 'financial' | 'environmental';
  setCurrentChart: (chart: 'yields' | 'financial' | 'environmental') => void;
}

const ChartSelector = ({ currentChart, setCurrentChart }: ChartSelectorProps) => {
  const handleChartChange = (chart: 'yields' | 'financial' | 'environmental') => {
    setCurrentChart(chart);
    
    const chartNames = {
      yields: 'Năng suất',
      financial: 'Tài chính',
      environmental: 'Môi trường'
    };
    
    toast.info(`Hiển thị dữ liệu: ${chartNames[chart]}`, {
      description: `Biểu đồ đã được cập nhật với dữ liệu ${chartNames[chart].toLowerCase()}`
    });
  };
  
  const handleNextChart = () => {
    if (currentChart === 'yields') {
      handleChartChange('financial');
    } else if (currentChart === 'financial') {
      handleChartChange('environmental');
    } else {
      handleChartChange('yields');
    }
  };
  
  const handlePrevChart = () => {
    if (currentChart === 'yields') {
      handleChartChange('environmental');
    } else if (currentChart === 'financial') {
      handleChartChange('yields');
    } else {
      handleChartChange('financial');
    }
  };

  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">Chọn biểu đồ</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevChart}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Biểu đồ trước</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextChart}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Biểu đồ tiếp theo</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          className={`relative px-4 py-2 rounded-lg transition-colors flex-1 overflow-hidden ${
            currentChart === 'yields' 
              ? 'bg-agri-primary text-white' 
              : 'bg-white border border-input text-foreground hover:bg-muted/10 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleChartChange('yields')}
        >
          {currentChart === 'yields' && (
            <motion.div 
              layoutId="highlight"
              className="absolute inset-0 bg-agri-primary -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <div className="flex items-center justify-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            <span>Năng suất</span>
          </div>
        </button>
        <button 
          className={`relative px-4 py-2 rounded-lg transition-colors flex-1 overflow-hidden ${
            currentChart === 'financial' 
              ? 'bg-agri-primary text-white' 
              : 'bg-white border border-input text-foreground hover:bg-muted/10 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleChartChange('financial')}
        >
          {currentChart === 'financial' && (
            <motion.div 
              layoutId="highlight"
              className="absolute inset-0 bg-agri-primary -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <div className="flex items-center justify-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span>Tài chính</span>
          </div>
        </button>
        <button 
          className={`relative px-4 py-2 rounded-lg transition-colors flex-1 overflow-hidden ${
            currentChart === 'environmental' 
              ? 'bg-agri-primary text-white' 
              : 'bg-white border border-input text-foreground hover:bg-muted/10 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
          }`}
          onClick={() => handleChartChange('environmental')}
        >
          {currentChart === 'environmental' && (
            <motion.div 
              layoutId="highlight"
              className="absolute inset-0 bg-agri-primary -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <div className="flex items-center justify-center">
            <PieChart className="h-5 w-5 mr-2" />
            <span>Môi trường</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChartSelector;
