
import { useState } from 'react';
import { useCRM } from '@/contexts/CRMContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { generatePreviewHTML } from '@/utils/preview-generator';
import { toast } from 'sonner';

interface UsePreviewActionsProps {
  data: any[];
  moduleName: string;
  columns?: { key: string, header: string }[];
  title?: string;
}

export const usePreviewActions = ({ 
  data, 
  moduleName, 
  columns, 
  title 
}: UsePreviewActionsProps) => {
  const { printModuleData, exportModuleData } = useCRM();
  const { settings } = useAppSettings();
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHTML, setPreviewHTML] = useState<string>('');

  const handlePrint = async () => {
    if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để in", {
        description: "Vui lòng kiểm tra bộ lọc hoặc chọn khoảng thời gian khác."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      await printModuleData(moduleName, {
        columns: columns,
        title: title || `Xem trước - ${moduleName}`
      });
      toast.success("Tài liệu đã gửi để in", {
        description: "Tài liệu của bạn đã được gửi đến máy in."
      });
    } catch (error) {
      console.error("Lỗi khi in:", error);
      toast.error("Lỗi in ấn", {
        description: "Đã xảy ra lỗi khi in tài liệu."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleShowPreview = () => {
    if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để hiển thị", {
        description: "Vui lòng kiểm tra bộ lọc hoặc chọn khoảng thời gian khác."
      });
      return;
    }
    
    const html = generatePreviewHTML(data, moduleName, title, columns, settings.locale);
    setPreviewHTML(html);
    setPreviewOpen(true);
  };

  const handleExportPDF = async () => {
    if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để xuất", {
        description: "Vui lòng kiểm tra bộ lọc hoặc chọn khoảng thời gian khác."
      });
      return;
    }

    setIsActionInProgress(true);
    
    try {
      await exportModuleData(moduleName, 'pdf', data);
      toast.success("PDF đã được tạo thành công", {
        description: "Tài liệu đã được tải xuống."
      });
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
      toast.error("Lỗi xuất dữ liệu", {
        description: "Đã xảy ra lỗi khi tạo file PDF."
      });
    } finally {
      setIsActionInProgress(false);
    }
  };

  return {
    isActionInProgress,
    previewOpen,
    setPreviewOpen,
    previewHTML,
    handlePrint,
    handleShowPreview,
    handleExportPDF
  };
};
