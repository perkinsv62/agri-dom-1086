
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import GuadeloupeSpecificCrops from '../components/GuadeloupeSpecificCrops';
import CropPlanning from '../components/CropPlanning';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from '@/components/ui/button';
import { Download, Plus, Upload, Filter, RefreshCw, CalendarRange, Eye, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { CRMProvider } from '../contexts/CRMContext';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PreviewPrintButton from '@/components/common/PreviewPrintButton';
import { useCRM } from '@/contexts/CRMContext';

const CropsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('harvest');
  const { getModuleData } = useCRM();
  
  // Get harvest data for preview/print
  const harvestData = getModuleData('cultures').items || [];
  
  // Print columns for different tabs
  const printColumns = {
    harvest: [
      { key: "nom", header: "Cây trồng" },
      { key: "rendement", header: "Năng suất (t/ha)" },
      { key: "surface", header: "Diện tích (ha)" },
      { key: "date", header: "Ngày thu hoạch" }
    ],
    specific: [
      { key: "nom", header: "Tên" },
      { key: "variete", header: "Giống" },
      { key: "dateDebut", header: "Ngày bắt đầu" },
      { key: "dateFin", header: "Ngày kết thúc" }
    ],
    planning: [
      { key: "nom", header: "Cây trồng" },
      { key: "activite", header: "Hoạt động" },
      { key: "dateDebut", header: "Ngày bắt đầu" },
      { key: "dateFin", header: "Ngày kết thúc" },
      { key: "statut", header: "Trạng thái" }
    ]
  };

  // Actions based on the active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'harvest':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={harvestData}
              moduleName="harvest"
              title="Theo dõi Thu hoạch"
              columns={printColumns.harvest}
              variant="outline"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 transition-colors">
                  <Download className="h-4 w-4" />
                  Xuất dữ liệu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => console.log("Export CSV des données de récolte")}
                  className="cursor-pointer"
                >
                  Xuất CSV
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export Excel des données de récolte")}
                  className="cursor-pointer"
                >
                  Xuất Excel
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => console.log("Export PDF des données de récolte")}
                  className="cursor-pointer"
                >
                  Xuất PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Synchronisation des données de récolte");
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Đồng bộ
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Filtres appliqués aux données de récolte");
              }}
            >
              <Filter className="h-4 w-4" />
              Lọc
            </Button>
          </div>
        );
      case 'specific':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={getModuleData('cultures').items || []}
              moduleName="cultures"
              title="Cây trồng Đặc biệt"
              columns={printColumns.specific}
              variant="outline"
            />
            
            <Button 
              className="flex items-center gap-2 bg-agri-primary hover:bg-agri-primary-dark transition-colors"
              onClick={() => {
                console.log("Ajout de nouvelle culture");
              }}
            >
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Export des données des cultures");
              }}
            >
              <Download className="h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        );
      case 'planning':
        return (
          <div className="flex flex-wrap gap-2">
            <PreviewPrintButton 
              data={[]}
              moduleName="planning"
              title="Lập kế hoạch Cây trồng"
              columns={printColumns.planning}
              variant="outline"
            />
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Planification du calendrier des cultures");
              }}
            >
              <CalendarRange className="h-4 w-4" />
              Lập kế hoạch
            </Button>
            <Button 
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                console.log("Ajout de nouvelle tâche culturale");
              }}
            >
              <Plus className="h-4 w-4" />
              Tác vụ mới
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabLabels = {
      harvest: 'Theo dõi Thu hoạch',
      specific: 'Cây trồng Đặc biệt',
      planning: 'Lập kế hoạch'
    };
    
    const label = tabLabels[value as keyof typeof tabLabels] || value;
    console.log(`${label} được kích hoạt - Hiển thị dữ liệu tương ứng`);
  };

  const tabs: TabItem[] = [
    {
      value: 'harvest',
      label: 'Theo dõi Thu hoạch',
      content: <GuadeloupeHarvestTracking />
    },
    {
      value: 'specific',
      label: 'Cây trồng Đặc biệt',
      content: <GuadeloupeSpecificCrops />
    },
    {
      value: 'planning',
      label: 'Lập kế hoạch',
      content: <CropPlanning />
    }
  ];

  return (
    <CRMProvider>
      <StatisticsProvider>
        <PageLayout>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 animate-enter"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Quản lý Cây trồng</h1>
                <p className="text-muted-foreground">
                  Quản lý các loại cây trồng nhiệt đới và theo dõi năng suất của chúng
                </p>
              </div>
              {getTabActions()}
            </div>
            
            <TabContainer 
              tabs={tabs}
              defaultValue={activeTab}
              onValueChange={handleTabChange}
            />
          </motion.div>
        </PageLayout>
      </StatisticsProvider>
    </CRMProvider>
  );
};

export default CropsPage;
