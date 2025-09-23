import { toast } from 'sonner';
import Papa from 'papaparse';

/**
 * Export any module data to CSV format
 */
export const exportToCSV = (data: Record<string, unknown>[], fileName: string): boolean => {
  try {
    // Convert data to CSV format
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Dữ liệu đã được xuất thành công ở định dạng CSV");
    return true;
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Lỗi khi xuất dữ liệu");
    return false;
  }
};

/**
 * Export data to Excel format (simulated with CSV for now)
 */
export const exportToExcel = (data: Record<string, unknown>[], fileName: string): boolean => {
  try {
    // For now, we'll use CSV as a stand-in for Excel
    // In a production app, you'd use a library like xlsx
    return exportToCSV(data, fileName);
  } catch (error) {
    console.error("Export error:", error);
    toast.error("Erreur lors de l'exportation des données");
    return false;
  }
};

/**
 * Export data to PDF format
 */
export const exportToPDF = async (data: Record<string, unknown>[], fileName: string, options: Record<string, unknown> = {}): Promise<boolean> => {
  try {
    // Show toast notification
    toast.info("Đang tạo PDF...");
    
    // Create HTML content based on template type
    let htmlContent = '';
    
    if (options.template === 'technical_sheet' && data.length > 0) {
      // Create technical sheet layout
      const item = data[0];
      const opt = options as Record<string, unknown>;
      const title = typeof opt.title === 'string' ? opt.title : 'Fiche Technique';
      htmlContent = createTechnicalSheetHTML(item, title);
    } else if ((options as Record<string, unknown>).template === 'report' && data.length > 0) {
      // Create report layout
      const opt2 = options as Record<string, unknown>;
      const title = typeof opt2.title === 'string' ? opt2.title : fileName;
      const cols = Array.isArray(opt2.columns) ? (opt2.columns as any[]) : [];
      htmlContent = createReportHTML(data, title, cols);
    } else {
      // Create standard table-based layout
      const opt3 = options as Record<string, unknown>;
      const title = typeof opt3.title === 'string' ? opt3.title : fileName;
      const cols = Array.isArray(opt3.columns) ? (opt3.columns as any[]) : [];
      htmlContent = createTableBasedHTML(data, title, cols);
    }
    
    // Create and open print window
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in");
      return false;
    }
    
    // Write content and trigger print
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait a moment for styles to load then print
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
        toast.success("PDF được tạo thành công");
      } catch (printError) {
        console.error("Print error:", printError);
        toast.error("Lỗi khi in PDF");
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    toast.error("Lỗi khi tạo PDF");
    return false;
  }
};

// Helper function to create technical sheet HTML
const createTechnicalSheetHTML = (item: Record<string, unknown>, title: string): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .technical-sheet { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
          .technical-sheet-header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2e7d32; }
          .section { margin-bottom: 20px; }
          .section h2 { color: #1565c0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .property-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .property { margin-bottom: 10px; }
          .property-label { font-weight: bold; display: block; }
          .notes { background: #f5f5f5; padding: 15px; border-radius: 5px; }
          @media print {
            body { padding: 0; }
            .technical-sheet { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="technical-sheet">
          <div class="technical-sheet-header">
            <h1>${item.nom || 'Culture'}</h1>
            <p><em>${item.nomScientifique || ''}</em></p>
          </div>
          
          <div class="section">
            <h2>Informations générales</h2>
            <div class="property-grid">
              <div class="property">
                <span class="property-label">Famille:</span>
                ${item.famille || ''}
              </div>
              <div class="property">
                <span class="property-label">Origine:</span>
                ${item.origine || ''}
              </div>
              <div class="property">
                <span class="property-label">Type:</span>
                ${item.type || ''}
              </div>
              <div class="property">
                <span class="property-label">Saison de culture:</span>
                ${item.saisonCulture || ''}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Conditions de culture</h2>
            <div class="property-grid">
              <div class="property">
                <span class="property-label">Type de sol:</span>
                ${item.typeSol || ''}
              </div>
              <div class="property">
                <span class="property-label">Besoin en eau:</span>
                ${item.besoinEau || ''}
              </div>
              <div class="property">
                <span class="property-label">Fertilisation:</span>
                ${item.fertilisation || ''}
              </div>
              <div class="property">
                <span class="property-label">Période de récolte:</span>
                ${item.periodeRecolte || ''}
              </div>
              <div class="property">
                <span class="property-label">Rendement par hectare:</span>
                ${item.rendementHectare || ''}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Problèmes phytosanitaires</h2>
            <div class="property-grid">
              <div class="property">
                <span class="property-label">Ravageurs:</span>
                ${item.ravageurs || ''}
              </div>
              <div class="property">
                <span class="property-label">Maladies:</span>
                ${item.maladies || ''}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h2>Notes</h2>
            <div class="notes">
              ${item.notes || 'Aucune note disponible'}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to create enhanced report HTML
const createReportHTML = (data: Record<string, unknown>[], title: string, columns: { key: string, header: string }[]): string => {
  // Generate table headers
  const tableHeaders = columns
    .map(col => `<th>${col.header}</th>`)
    .join('');
    
  // Generate table rows
  const tableRows = data.map((row) => {
    const cells = columns.map((column) => {
      const value = (row as Record<string, unknown>)[column.key];
      return `<td>${typeof value === 'object' ? JSON.stringify(value) : value || ''}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .report { max-width: 100%; margin: 0 auto; }
          .report-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
          .report-title { margin: 0; color: #2e7d32; }
          .report-date { text-align: right; color: #666; }
          .report-summary { background-color: #f9f9f9; padding: 15px; margin-bottom: 20px; border-radius: 4px; }
          h1 { color: #2e7d32; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #4CAF50; color: white; text-align: left; padding: 10px; }
          td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; border-top: 1px solid #ddd; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .report { border: none; }
          }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="report-header">
            <h1 class="report-title">${title}</h1>
            <div class="report-date">
              <p>Date: ${currentDate}</p>
            </div>
          </div>
          
          <div class="report-summary">
            <p>Ce rapport contient ${data.length} enregistrement${data.length > 1 ? 's' : ''} au total.</p>
          </div>
          
          <table>
            <thead>
              <tr>${tableHeaders}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Agri Dom - Rapport généré le ${currentDate}</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Helper function to create table-based HTML
const createTableBasedHTML = (data: Record<string, unknown>[], title: string, columns: { key: string, header: string }[]): string => {
  // Generate table headers
  const tableHeaders = columns
    .map(col => `<th>${col.header}</th>`)
    .join('');
    
  // Generate table rows
  const tableRows = data.map((row) => {
    const cells = columns.map((column) => {
      const value = (row as Record<string, unknown>)[column.key];
      return `<td>${typeof value === 'object' ? JSON.stringify(value) : value || ''}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .print-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .print-date { text-align: right; font-size: 0.9em; color: #666; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1>${title}</h1>
          <div class="print-date">
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};

/**
 * Import data from CSV file
 */
export const importFromCSV = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
  const parsedData = results.data as Record<string, unknown>[];
        
        if (parsedData.length === 0) {
          toast.error("Không tìm thấy dữ liệu hợp lệ trong tệp");
          reject("No valid data found");
          return;
        }
        
        toast.success(`${parsedData.length} bản ghi đã được nhập thành công`);
        resolve(parsedData);
      },
      error: (error) => {
        console.error("Import error:", error);
        toast.error("Lỗi khi nhập dữ liệu");
        reject(error);
      }
    });
  });
};

/**
 * Print data
 */
export const printData = (
  data: Record<string, unknown>[], 
  title: string, 
  columns: { key: string, header: string }[],
  options: Record<string, unknown> = {}
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      let htmlContent;
      
      // For technical sheet template
      if (options.template === 'technical_sheet' && data.length > 0) {
        // For technical sheet
        htmlContent = createTechnicalSheetHTML(data[0], title);
      } else if (options.template === 'report' && data.length > 0) {
        // For report
        htmlContent = createReportHTML(data, title, columns);
      } else {
        // Default table-based print template
        htmlContent = createTableBasedHTML(data, title, columns);
      }
      
      // Create print window
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error("Impossible d'ouvrir la fenêtre d'impression");
        resolve(false);
        return;
      }
      
      // Write to print window
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Auto print after a short delay
      setTimeout(() => {
        try {
          printWindow.focus();
          printWindow.print();
          toast.success("Document prêt pour impression");
          resolve(true);
        } catch (printError) {
          console.error("Print error:", printError);
          toast.error("Erreur lors de l'impression");
          resolve(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Erreur lors de la préparation de l'impression");
      resolve(false);
    }
  });
};
