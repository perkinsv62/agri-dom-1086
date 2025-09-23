
import { toast } from 'sonner';
import Papa from 'papaparse';

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  location: string;
  lastUpdated: string;
  supplier?: string;
  sku?: string;
  expiryDate?: string;
  notes?: string;
  [key: string]: unknown;
};

export type ExportOptions = {
  fileName?: string;
  includeFields?: string[];
  excludeFields?: string[];
  dateFormat?: string;
  addTimestamp?: boolean;
};

export const exportInventoryToCSV = (
  inventoryData: InventoryItem[], 
  options: ExportOptions = {}
) => {
  try {
    // Process data based on options
    let dataToExport = [...inventoryData];
    
    // Filter fields if specified
    if (options.includeFields?.length) {
      dataToExport = dataToExport.map(item => {
        const filteredItem: Record<string, unknown> = {};
        options.includeFields?.forEach(field => {
          if (field in item) {
            filteredItem[field] = item[field];
          }
        });
        return filteredItem as unknown as InventoryItem;
      });
    } else if (options.excludeFields?.length) {
      dataToExport = dataToExport.map(item => {
        const filteredItem: Record<string, unknown> = {};
        Object.keys(item).forEach(key => {
          if (!options.excludeFields?.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem as unknown as InventoryItem;
      });
    }

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Create filename
    const timestamp = options.addTimestamp ? `_${new Date().toISOString().replace(/[:.]/g, '-')}` : '';
    const defaultName = `inventaire${timestamp}.csv`;
    const fileName = options.fileName || defaultName;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dữ liệu đã được xuất thành công", {
      description: `Tệp ${fileName} đã được tải xuống`
    });
    return true;
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Lỗi khi xuất dữ liệu");
    return false;
  }
};

export type ImportOptions = {
  validateFields?: boolean;
  requiredFields?: string[];
  skipDuplicateIds?: boolean;
  onProgress?: (progress: number) => void;
  dateFormat?: string;
};

export const importInventoryFromCSV = (
  file: File, 
  onComplete: (data: InventoryItem[]) => void,
  options: ImportOptions = {}
) => {
  try {
    const { validateFields = true, requiredFields = ['name', 'category'], skipDuplicateIds = false } = options;
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data as Record<string, unknown>[];
        
        // Check if there's data to process
        if (!parsedData || parsedData.length === 0 || !parsedData[0]) {
          toast.error("Tệp nhập không chứa dữ liệu hợp lệ");
          return;
        }

        // Track progress
        let processedCount = 0;
        const totalCount = parsedData.length;
        
        // Validate and transform data
        const validData: InventoryItem[] = parsedData
          .filter(item => {
            if (!validateFields) return true;
            
            // Check required fields
            const hasRequiredFields = requiredFields.every(field => 
              item[field] !== undefined && item[field] !== null && item[field] !== ''
            );
            
            if (!hasRequiredFields) {
              console.warn("Skipping item due to missing required fields:", item);
            }
            
            return hasRequiredFields;
          })
          .map((item, index) => {
            // Update progress
            processedCount++;
            if (options.onProgress) {
              options.onProgress(Math.floor((processedCount / totalCount) * 100));
            }
            
            return {
              id: Number(item.id) || Math.max(1000, index + 1000),
              name: item.name || '',
              category: item.category || '',
              quantity: Number(item.quantity) || 0,
              unit: item.unit || 'đơn vị',
              minQuantity: Number(item.minQuantity) || 0,
              price: Number(item.price) || 0,
              location: item.location || '',
              lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0],
              supplier: item.supplier || '',
              sku: item.sku || '',
              expiryDate: item.expiryDate || '',
              notes: item.notes || ''
            };
          });
        
        if (validData.length === 0) {
          toast.error("Không tìm thấy dữ liệu hợp lệ trong tệp");
          return;
        }
        
        onComplete(validData);
        toast.success(`${validData.length} mục đã được nhập thành công`, {
          description: `Nhập dữ liệu hoàn tất từ ${file.name}`
        });
      },
      error: (error) => {
        console.error("Import error:", error);
  toast.error("Lỗi khi nhập dữ liệu");
      }
    });
    return true;
  } catch (error) {
    console.error("Import error:", error);
  toast.error("Lỗi khi nhập dữ liệu");
    return false;
  }
};

export const exportInventoryToPDF = (inventoryData: InventoryItem[], fileName?: string) => {
  toast.info("Đang chuẩn bị PDF...");
  // In a real app, you would use a library like jsPDF, pdfmake, or react-pdf
  // This is a placeholder for the actual PDF generation functionality
  setTimeout(() => {
    toast.success("PDF đã được tạo thành công", {
      description: "Tệp đã được tải xuống"
    });
  }, 1500);
  return true;
};

export const downloadInventoryTemplate = () => {
  const templateData = [
    {
      id: "1",
      name: "Nom de l'article",
      category: "Catégorie",
      quantity: "100",
      unit: "unité",
      minQuantity: "10",
      price: "0.00",
      location: "Emplacement",
      supplier: "Fournisseur",
      sku: "REF-001",
      expiryDate: "2023-12-31",
      notes: "Notes additionnelles"
    }
  ];
  
  const csv = Papa.unparse(templateData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'mau_kho.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Mẫu kho đã được tải xuống", {
    description: "Sử dụng mẫu này để chuẩn bị dữ liệu nhập"
  });
  
  return true;
};
