
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';

const Index = () => {
  const [userName, setUserName] = useState('Nông dân');
  
  // Sử dụng context CRM
  const { lastSync, isRefreshing, syncDataAcrossCRM } = useCRM();

  // (export/import/print handlers removed — not used on this page)


  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Bảng điều khiển</h1>
              <p className="text-gray-500">
                Chào mừng, {userName} — Đồng bộ lần cuối: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={syncDataAcrossCRM}
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Đồng bộ dữ liệu
            </Button>
          </div>
          </div>
          
          <Dashboard />
          
          
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
