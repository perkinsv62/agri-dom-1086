
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Download, 
  Upload, 
  AlertTriangle, 
  Plus,
  FileBarChart,
  Layers 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReportGenerationButton from "../common/ReportGenerationButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// useToast intentionally removed — not used in this component

interface ParcelAlert {
  id: number;
  parcel: string;
  type: string;
  severity: string;
}

interface ParcelActionButtonsProps {
  onExportData: () => void;
  onImportData: () => void;
  onOpenMap: () => void;
  onAddParcel?: () => void;
  onGenerateStatistics?: () => void;
  onOpenLayerManager?: () => void;
  activeParcelAlerts: ParcelAlert[];
  weatherAlertsOpen: boolean;
  setWeatherAlertsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getSeverityColor: (_severity: string) => string;  
}

const ParcelActionButtons = ({
  onExportData,
  onImportData,
  onOpenMap,
  onAddParcel,
  onGenerateStatistics,
  onOpenLayerManager,
  activeParcelAlerts,
  weatherAlertsOpen,
  setWeatherAlertsOpen,
  getSeverityColor
}: ParcelActionButtonsProps) => {
  // toast not used here; omit destructure

  return (
    <div className="flex flex-wrap gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              onClick={onOpenMap}
              className="bg-white border-gray-200 hover:bg-gray-50"
            >
              <Map className="mr-2 h-4 w-4 text-gray-600" />
              Carte
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Afficher la carte des parcelles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {activeParcelAlerts.length > 0 && (
        <Popover open={weatherAlertsOpen} onOpenChange={setWeatherAlertsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="relative bg-white border-gray-200 hover:bg-gray-50"
            >
              <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
              Cảnh báo
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeParcelAlerts.length}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="p-4 border-b">
              <h4 className="font-semibold flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Cảnh báo lô đất
              </h4>
            </div>
            <div className="divide-y max-h-80 overflow-auto">
              {activeParcelAlerts.map(alert => (
                <div key={alert.id} className="p-3 hover:bg-muted/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{alert.parcel}</span>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.type}</p>
                </div>
              ))}
            </div>
            <div className="p-2 border-t bg-muted/10">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setWeatherAlertsOpen(false)}>
                Đóng
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      <ReportGenerationButton 
        moduleName="parcelles" 
        variant="outline" 
        className="bg-white border-gray-200 hover:bg-gray-50 text-gray-800"
      />

      {onGenerateStatistics && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onGenerateStatistics}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                <FileBarChart className="mr-2 h-4 w-4 text-gray-600" />
                Thống kê
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tạo thống kê về lô đất của bạn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onOpenLayerManager && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={onOpenLayerManager}
                className="bg-white border-gray-200 hover:bg-gray-50"
              >
                <Layers className="mr-2 h-4 w-4 text-gray-600" />
                Lớp
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quản lý các lớp bản đồ</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <Button 
        variant="outline" 
        onClick={onExportData}
        className="bg-white border-gray-200 hover:bg-gray-50"
      >
        <Download className="mr-2 h-4 w-4 text-gray-600" />
        Xuất
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onImportData}
        className="bg-white border-gray-200 hover:bg-gray-50"
      >
        <Upload className="mr-2 h-4 w-4 text-gray-600" />
        Nhập
      </Button>

      {onAddParcel && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white" 
                onClick={onAddParcel}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm lô đất
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tạo lô đất mới</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ParcelActionButtons;
