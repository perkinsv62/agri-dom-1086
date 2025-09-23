
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Printer, FileText } from 'lucide-react';
import { useCRM } from '../../contexts/CRMContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ReportGenerationButton from './ReportGenerationButton';

interface ImportExportButtonsProps {
  moduleName: string;
  className?: string;
  onImportComplete?: () => void;
  showPrint?: boolean;
  showTechnicalSheet?: boolean;
  showReportGeneration?: boolean;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  moduleName,
  className = "",
  onImportComplete,
  showPrint = true,
  showTechnicalSheet = false,
  showReportGeneration = true
}) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');

  const { exportModuleData, importModuleData, printModuleData } = useCRM();

  const handleExportClick = () => setExportDialogOpen(true);

  const handleExportConfirm = async () => {
    try {
      await exportModuleData(moduleName, exportFormat);
    } catch (error) {
      console.error(`Error exporting ${moduleName}:`, error);
    }
    setExportDialogOpen(false);
  };

  const handleImportClick = () => setImportDialogOpen(true);

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("Không có tệp được chọn");
      return;
    }

    try {
      const success = await importModuleData(moduleName, selectedFile);
      if (success && onImportComplete) onImportComplete();
    } catch (error) {
      console.error(`Error importing ${moduleName}:`, error);
    }

    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintClick = async () => {
    try {
      await printModuleData(moduleName);
    } catch (error) {
      console.error(`Error printing ${moduleName}:`, error);
    }
  };

  const handleTechnicalSheetClick = async () => {
    // Placeholder - module-specific technical sheet export
    try {
      await exportModuleData(moduleName, 'pdf');
    } catch (error) {
      console.error('Error exporting technical sheet', error);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showReportGeneration && (
        <ReportGenerationButton
          moduleName={moduleName}
          variant="outline"
          className="flex items-center gap-2"
        />
      )}

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleExportClick}
      >
        <Download className="h-4 w-4" />
        Xuất
      </Button>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleImportClick}
      >
        <Upload className="h-4 w-4" />
        Nhập
      </Button>

      {showPrint && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handlePrintClick}
        >
          <Printer className="h-4 w-4" />
          In
        </Button>
      )}

      {showTechnicalSheet && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleTechnicalSheetClick}
        >
          <FileText className="h-4 w-4" />
          Bản kỹ thuật
        </Button>
      )}

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập dữ liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Tệp CSV</Label>
              <input
                type="file"
                id="file"
                accept=".csv"
                onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                className="w-full border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Dữ liệu sẽ được nhập vào module {moduleName}. Vui lòng đảm bảo tệp ở định dạng CSV.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleImportConfirm}>Nhập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
          <DialogHeader>
            <DialogTitle>Xuất dữ liệu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Định dạng xuất</Label>
              <div className="flex gap-2">
                <Button
                  variant={exportFormat === 'csv' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('csv')}
                  className="flex-1"
                >
                  CSV
                </Button>
                <Button
                  variant={exportFormat === 'excel' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('excel')}
                  className="flex-1"
                >
                  Excel
                </Button>
                <Button
                  variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                  onClick={() => setExportFormat('pdf')}
                  className="flex-1"
                >
                  PDF
                </Button>
              </div>
            </div>
          </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleExportConfirm}>Xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportButtons;
