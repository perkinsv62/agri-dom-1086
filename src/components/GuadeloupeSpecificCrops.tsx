
import React, { useState } from 'react';
import { CultureDetailTable } from './CultureDetailTable';
import { Button } from './ui/button';
import { Plus, Download, Upload, Filter, Search, FileUp } from 'lucide-react';
import { Input } from './ui/input';
import { useCRM } from '../contexts/CRMContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import PreviewPrintButton from './common/PreviewPrintButton';

const GuadeloupeSpecificCrops = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { exportModuleData, importModuleData, getModuleData } = useCRM();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Get cultures data for preview/print
  const culturesData = getModuleData('cultures').items || [];

  const handleAddCulture = () => {
    setShowAddForm(true);
    console.log("Mở biểu mẫu thêm cây trồng");
  };

  const handleExportData = async (format: 'csv' | 'pdf' = 'csv') => {
    console.log(`Đang xuất theo định dạng ${format}...`);
    const success = await exportModuleData('cultures', format);
    
    if (success) {
      console.log(`Dữ liệu cây trồng đã được xuất ra ${format.toUpperCase()}`);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Import ${file.name} en cours...`);
      const success = await importModuleData('cultures', file);
      
      if (success) {
        console.log("Nhập thành công - Dữ liệu cây trồng đã được cập nhật");
      }
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả cây trồng' },
    { value: 'fruits', label: 'Trái cây' },
    { value: 'vegetables', label: 'Rau củ' },
    { value: 'tubers', label: 'Củ' },
    { value: 'cash', label: 'Cây trồng kinh tế' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Cây trồng Đặc biệt của Guadeloupe</h2>
          <p className="text-muted-foreground">Quản lý thông tin về các loại cây trồng địa phương của bạn</p>
        </div>
        <div className="flex space-x-2">
          <PreviewPrintButton 
            data={culturesData}
            moduleName="cultures"
            title="Cây trồng Đặc biệt của Guadeloupe"
            columns={[
              { key: "nom", header: "Tên" },
              { key: "variete", header: "Giống" },
              { key: "dateDebut", header: "Ngày bắt đầu" },
              { key: "dateFin", header: "Ngày kết thúc" }
            ]}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="transition-colors hover:bg-gray-100">
                <Download className="mr-2 h-4 w-4" />
                Xuất dữ liệu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              <DropdownMenuItem onClick={() => handleExportData('csv')} className="cursor-pointer">
                Xuất CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData('pdf')} className="cursor-pointer">
                Xuất PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="transition-colors hover:bg-gray-100">
                <Upload className="mr-2 h-4 w-4" />
                Nhập dữ liệu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg">
              <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
                <FileUp className="mr-2 h-4 w-4" />
                Chọn tệp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />
          
          <Button 
            onClick={handleAddCulture} 
            className="transition-colors hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm cây trồng
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Tìm kiếm cây trồng..." 
            className="pl-10 transition-all focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className={cn(
              "h-10 appearance-none pl-3 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-white transition-all"
            )}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border p-6 mb-6 shadow-sm"
      >
        <CultureDetailTable 
          showAddForm={showAddForm} 
          setShowAddForm={setShowAddForm} 
          searchTerm={searchTerm}
          filterType={filterType}
        />
      </motion.div>
    </motion.div>
  );
};

export default GuadeloupeSpecificCrops;
