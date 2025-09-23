import { toast } from 'sonner';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV } from './crm-data-operations';

/**
 * Format date to localized string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format currency with euro symbol
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format percentage with symbol
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Calculate total from array of objects
 */
export const calculateTotal = (items: Record<string, unknown>[], field: string): number => {
  return items.reduce((sum, item) => {
    const val = item[field];
    let n = 0;
    if (typeof val === 'number') n = val;
    else if (typeof val === 'string') n = Number(val);
    else if (val != null) n = Number(String(val));
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
};

/**
 * General search function for filtering data
 */
export const searchInData = (data: Record<string, unknown>[], searchTerm: string, fields: string[] = []): Record<string, unknown>[] => {
  if (!searchTerm || searchTerm.trim() === '') return data;

  const term = searchTerm.toLowerCase().trim();
  return data.filter(item => {
    const valueToString = (v: unknown) => (v == null ? '' : String(v).toLowerCase());

    // If specific fields are provided, search only in those fields
    if (fields.length > 0) {
      return fields.some(field => {
        const value = item[field];
        return valueToString(value).includes(term);
      });
    }

    // Otherwise search in all fields
    return Object.values(item).some(value => valueToString(value).includes(term));
  });
};

/**
 * Filter data by date range
 */
export const filterByDateRange = (
  data: Record<string, unknown>[], 
  startDate?: Date | null, 
  endDate?: Date | null, 
  dateField: string = 'date'
): Record<string, unknown>[] => {
  if (!startDate && !endDate) return data;

  return data.filter(item => {
    const raw = item[dateField];
    if (!raw) return false;

    let itemDate: Date;
    if (raw instanceof Date) itemDate = raw;
    else itemDate = new Date(String(raw));

    if (startDate && endDate) {
      return itemDate >= startDate && itemDate <= endDate;
    } else if (startDate) {
      return itemDate >= startDate;
    } else if (endDate) {
      return itemDate <= endDate;
    }

    return true;
  });
};

/**
 * Generate unique ID for new items
 */
export const generateUniqueId = (): number => {
  return Math.floor(Date.now() + Math.random() * 1000);
};

/**
 * Group data by field
 */
export const groupByField = (data: Record<string, unknown>[], field: string): Record<string, Record<string, unknown>[]> => {
  return data.reduce<Record<string, Record<string, unknown>[]>>((groups, item) => {
    const key = (item[field] as string) || 'undefined';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, Record<string, unknown>[]>);
};

/**
 * Get status color based on status value
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-red-100 text-red-800',
    'En culture': 'bg-green-100 text-green-800',
    'En récolte': 'bg-blue-100 text-blue-800',
    'En préparation': 'bg-yellow-100 text-yellow-800',
    'Atteint': 'bg-green-100 text-green-800',
    'En progrès': 'bg-blue-100 text-blue-800',
    'En retard': 'bg-red-100 text-red-800'
  };
  
  return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format phone number for French format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digits
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format as XX XX XX XX XX (French format)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phoneNumber;
};

/**
 * Enhanced data export with feedback
 */
export const enhancedExport = async (
  data: Record<string, unknown>[], 
  format: 'csv' | 'excel' | 'pdf',
  fileName: string,
  options: Record<string, unknown> = {}
): Promise<boolean> => {
  if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để xuất");
    return false;
  }
  
  toast.info(`Préparation de l'export au format ${format.toUpperCase()}...`);
  
  try {
    let success = false;
    
    switch (format) {
      case 'csv':
        success = exportToCSV(data as unknown as any[], fileName);
        break;
      case 'excel':
        success = exportToExcel(data as unknown as any[], fileName);
        break;
      case 'pdf':
        success = await exportToPDF(data as unknown as any[], fileName, options as any);
        break;
    }
    
    if (success) {
        toast.success(`Xuất ${format.toUpperCase()} thành công`);
    }
    
    return success;
  } catch (error) {
    console.error(`Error exporting data:`, error);
      toast.error(`Lỗi khi xuất định dạng ${format.toUpperCase()}`);
    return false;
  }
};

/**
 * Enhanced data import with validation
 */
export const enhancedImport = async (
  file: File,
  onComplete: (data: Record<string, unknown>[]) => void,
  requiredFields: string[] = [],
  validateRow?: (row: Record<string, unknown>) => boolean
): Promise<boolean> => {
  if (!file) {
      toast.error("Không có tệp được chọn");
    return false;
  }
  
  toast.info("Importation en cours...");
  
  try {
    const data = await importFromCSV(file) as Record<string, unknown>[];
    
    if (!data || data.length === 0) {
        toast.error("Không tìm thấy dữ liệu hợp lệ trong tệp");
      return false;
    }
    
    // Validate required fields
    if (requiredFields.length > 0) {
      const invalidRows = data.filter(row => 
        !requiredFields.every(field => {
          const v = row[field];
          return v !== undefined && v !== null && v !== '';
        })
      );
      
      if (invalidRows.length > 0) {
          toast.warning(`${invalidRows.length} dòng bị bỏ qua do thiếu trường bắt buộc`);
      }
    }
    
    // Apply custom validation
    let validData = data;
    if (validateRow) {
      validData = data.filter(validateRow as (r: Record<string, unknown>) => boolean);
      if (validData.length < data.length) {
          toast.warning(`${data.length - validData.length} dòng bị bỏ qua do không hợp lệ`);
      }
    }
    
    if (validData.length === 0) {
        toast.error("Không có dữ liệu hợp lệ sau khi xác thực");
      return false;
    }
    
    onComplete(validData);
      toast.success(`${validData.length} bản ghi đã được nhập thành công`);
    return true;
  } catch (error) {
    console.error("Import error:", error);
    toast.error("Erreur lors de l'importation des données");
    return false;
  }
};

/**
 * Debounce function for search inputs
 */
export const debounce = <F extends (...args: unknown[]) => unknown>(
  fn: F,
  delay: number
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - call with unknown args
      fn(...(args as unknown as Parameters<F>));
    }, delay);
  };
};
