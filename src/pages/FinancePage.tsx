import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import FinancialTracking from '../components/FinancialTracking';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from "@/components/ui/button";
import { Download, Upload, PieChart, BarChart, CreditCard, DollarSign, Filter, Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FinancialCharts from '../components/statistics/FinancialCharts';
import BudgetPlanning from '../components/BudgetPlanning';
import { toast } from 'sonner';
import { StatisticsProvider } from '../contexts/StatisticsContext';

const FinancePage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Quản Lý Tài Chính',
    defaultDescription: 'Theo dõi doanh thu, chi phí và lợi nhuận.'
  });

  const [timeFrame, setTimeFrame] = useState('year');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);

  const handleExportData = () => {
    toast.success("Xuất dữ liệu tài chính", {
      description: "Dữ liệu của bạn đã được xuất dưới định dạng Excel"
    });
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = (importType: string) => {
    setImportDialogOpen(false);
    toast.success("Nhập dữ liệu thành công", {
      description: `Dữ liệu ${importType} đã được nhập thành công`
    });
  };

  const handleGenerateReport = () => {
    setReportGenerating(true);
    
    setTimeout(() => {
      setReportGenerating(false);
      toast.success("Tạo báo cáo", {
        description: `Báo cáo tài chính ${timeFrame} đã được tạo và sẵn sàng tải xuống`
      });
    }, 1500);
  };
  
  const handleAddIncome = () => {
    setShowAddIncomeForm(true);
    
    setTimeout(() => {
      setShowAddIncomeForm(false);
      toast.success("Đã thêm doanh thu", {
        description: "Doanh thu mới đã được thêm thành công"
      });
    }, 1000);
  };
  
  const handleAddExpense = () => {
    setShowAddExpenseForm(true);
    
    setTimeout(() => {
      setShowAddExpenseForm(false);
      toast.success("Đã thêm chi phí", {
        description: "Chi phí mới đã được thêm thành công"
      });
    }, 1000);
  };
  
  const handleActivateModule = (moduleName: string) => {
    toast.success(`Đã kích hoạt module ${moduleName}`, {
      description: `Module ${moduleName.toLowerCase()} đã được kích hoạt thành công`
    });
  };
  
  const handleCardDetailClick = (cardType: string) => {
    toast.info(`Chi tiết ${cardType}`, {
      description: `Hiển thị chi tiết của ${cardType.toLowerCase()}`
    });
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast.info("Thay đổi tab", {
      description: `Bạn đang xem tab ${value === 'overview' ? 'Tổng quan' : 
                                                        value === 'income' ? 'Doanh thu' : 
                                                        value === 'expenses' ? 'Chi phí' :
                                                        value === 'forecast' ? 'Dự báo' :
                                                        value === 'budget' ? 'Ngân sách' : 'Báo cáo'}`
    });
  };

  const renderHeaderActions = () => {
    return (
      <div className="flex flex-wrap space-x-2">
        <Button variant="outline" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Xuất dữ liệu
        </Button>
        
        <Button variant="outline" onClick={handleImportData}>
          <Upload className="mr-2 h-4 w-4" />
          Nhập dữ liệu
        </Button>
        
        <Button 
          onClick={() => {
            if (activeTab === 'overview') {
              handleGenerateReport();
            } else if (activeTab === 'income') {
              handleAddIncome();
            } else if (activeTab === 'expenses') {
              handleAddExpense();
            } else if (activeTab === 'forecast') {
              toast.info("Đã khởi chạy mô phỏng", {
                description: "Mô phỏng tài chính đang được thực hiện"
              });
            } else if (activeTab === 'budget') {
              toast.info("Đã lưu ngân sách", {
                description: "Các thay đổi của ngân sách đã được lưu"
              });
            } else {
              handleGenerateReport();
            }
          }}
        >
          {activeTab === 'overview' ? (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Tạo báo cáo
            </>
          ) : activeTab === 'income' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Thêm doanh thu
            </>
          ) : activeTab === 'expenses' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Thêm chi phí
            </>
          ) : activeTab === 'forecast' ? (
            <>
              <BarChart className="mr-2 h-4 w-4" />
              Khởi chạy mô phỏng
            </>
          ) : activeTab === 'budget' ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Báo cáo mới
            </>
          )}
        </Button>
        
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nhập dữ liệu tài chính</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">Chọn loại dữ liệu cần nhập:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" className="justify-start" onClick={() => handleImportConfirm('ngân hàng')}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Dữ liệu ngân hàng (CSV)
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleImportConfirm('kế toán')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Dữ liệu kế toán (Excel)
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => handleImportConfirm('hóa đơn')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Hóa đơn đã quét (PDF)
                </Button>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setImportDialogOpen(false)}>
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      value: 'overview',
      label: 'Tổng quan',
      content: (
        <StatisticsProvider>
          <div className="space-y-6">
            <FinancialTracking />
            <FinancialCharts />
          </div>
        </StatisticsProvider>
      )
    },
    {
      value: 'income',
      label: 'Doanh thu',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-500" />
            Quản Lý Doanh Thu
          </h2>
          <p className="text-muted-foreground mb-6">
            Theo dõi, phân loại và phân tích tất cả nguồn doanh thu
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Thu hoạch')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">Bán hàng</Badge> 
                  Bán vật phẩm
                </CardTitle>
                <CardDescription>Bán sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 860 €</div>
                <p className="text-sm text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7h-2z" clipRule="evenodd" />
                  </svg>
                  +12.5% so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Thu hoạch');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('PAC')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">Quảng cáo</Badge> 
                  Cho thuê quảng cáo
                </CardTitle>
                <CardDescription>Cho thuê đăng quảng cáo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18 500 €</div>
                <p className="text-sm text-blue-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M1 10a5 5 0 015-5h8a5 5 0 015 5v8a1 1 0 01-2 0v-8z" clipRule="evenodd" />
                  </svg>
                  Ổn định so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('PAC');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Autres revenues')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-200">Khác</Badge> 
                  Doanh thu
                </CardTitle>
                <CardDescription>Các nguồn thu khác</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 250 €</div>
                <p className="text-sm text-purple-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0114 7h-2z" clipRule="evenodd" />
                  </svg>
                  +28.3% so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Autres revenues');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Nguồn doanh thu gần đây</h3>
            <Button onClick={handleAddIncome}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm doanh thu
            </Button>
          </div>
          
          {showAddIncomeForm ? (
            <div className="animate-fade-in bg-muted/20 rounded-lg p-6 text-center border border-primary/20">
              <DollarSign className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Thêm doanh thu mới</h3>
              <p className="text-muted-foreground mb-4">Đang xử lý...</p>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 rounded-lg p-6 text-center">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-2">Module quản lý doanh thu</h3>
              <p className="text-muted-foreground mb-4">
                Kích hoạt module này để theo dõi chi tiết tất cả nguồn doanh thu
                và tạo báo cáo tùy chỉnh.
              </p>
              <Button onClick={() => handleActivateModule('quản lý doanh thu')}>Kích hoạt module</Button>
            </div>
          )}
        </div>
      )
    },
    {
      value: 'expenses',
      label: 'Chi phí',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-red-500" />
            Quản Lý Chi Phí
          </h2>
          <p className="text-muted-foreground mb-6">
            Phân loại và tối ưu hóa tất cả chi phí liên quan
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Semences & Fertilisants')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-200">Quảng Cáo</Badge> 
                  Marketing
                </CardTitle>
                <CardDescription>Chi phí quảng cáo, Chi cho cộng tác viên</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12 750 €</div>
                <p className="text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100-2H7.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 13H12z" clipRule="evenodd" />
                  </svg>
                  +8.3% so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Semences & Fertilisants');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Matériel')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-indigo-100 text-indigo-800 hover:bg-indigo-200">Thiết bị</Badge> 
                  Vật liệu
                </CardTitle>
                <CardDescription>Máy móc và công cụ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23 600 €</div>
                <p className="text-sm text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M8 7a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H4a1 1 0 110-2h3V8a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  -15.2% so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Matériel');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleCardDetailClick('Main d\'oeuvre')}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Badge className="mr-2 bg-teal-100 text-teal-800 hover:bg-teal-200">Dịch vụ</Badge> 
                  Lao động
                </CardTitle>
                <CardDescription>Lương, chi hoa hồng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15 320 €</div>
                <p className="text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100-2H7.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 13H12z" clipRule="evenodd" />
                  </svg>
                  +5.7% so với năm trước
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  handleCardDetailClick('Main d\'oeuvre');
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Chi tiết
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Chi phí gần đây</h3>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="intrants">Đầu vào</SelectItem>
                <SelectItem value="equipement">Thiết bị</SelectItem>
                <SelectItem value="services">Dịch vụ</SelectItem>
                <SelectItem value="administrative">Hành chính</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {showAddExpenseForm ? (
            <div className="animate-fade-in bg-muted/20 rounded-lg p-6 text-center border border-primary/20">
              <CreditCard className="h-12 w-12 mx-auto text-primary mb-2" />
              <h3 className="text-lg font-semibold mb-2">Thêm chi phí mới</h3>
              <p className="text-muted-foreground mb-4">Đang xử lý...</p>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/20 rounded-lg p-6 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-semibold mb-2">Module quản lý chi phí</h3>
              <p className="text-muted-foreground mb-4">
                Kích hoạt module này để phân loại, theo dõi và tối ưu hóa 
                tất cả chi phí chi tiết.
              </p>
              <Button onClick={() => handleActivateModule('quản lý chi phí')}>Kích hoạt module</Button>
            </div>
          )}
        </div>
      )
    },
    {
      value: 'budget',
      label: 'Ngân sách',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-orange-500" />
            Quản Lý Ngân Sách
          </h2>
          <p className="text-muted-foreground mb-6">
            Lập kế hoạch và theo dõi ngân sách để tối ưu hóa chi tiêu
          </p>
          
          <BudgetPlanning />
        </div>
      )
    },
    {
      value: 'reports',
      label: 'Báo cáo',
      content: (
        <div className="p-6 bg-white rounded-xl border">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <BarChart className="h-5 w-5 mr-2 text-blue-500" />
            Báo Cáo Tài Chính
          </h2>
          <p className="text-muted-foreground mb-6">
            Tạo báo cáo chi tiết để phân tích hiệu suất tài chính
          </p>
          
          <div className="mb-6">
            <div className="p-4 bg-muted/30 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Giai đoạn phân tích</h3>
              <div className="tabs tabs-boxed inline-flex p-1 bg-muted rounded-md">
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'month' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('month')}
                >
                  Tháng hiện tại
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'quarter' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('quarter')}
                >
                  Quý
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'year' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('year')}
                >
                  Năm
                </button>
                <button 
                  className={`py-1.5 px-3 rounded-sm ${timeFrame === 'custom' ? 'bg-background shadow-sm' : 'hover:bg-muted/80'}`}
                  onClick={() => setTimeFrame('custom')}
                >
                  Tùy chỉnh
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                  Báo cáo có sẵn
                </CardTitle>
                <CardDescription>
                  Chọn báo cáo cần tạo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport}>
                  <BarChart className="h-4 w-4 mr-2" />
                  Báo cáo lợi nhuận
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Phân tích chi phí
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  Tạo báo cáo
                </CardTitle>
                <CardDescription>
                  Trạng thái tạo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reportGenerating ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span>Đang tạo báo cáo {timeFrame}...</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng đợi trong khi biên soạn dữ liệu tài chính...
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="text-lg font-medium mb-2">Không có báo cáo nào đang chạy</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chọn loại báo cáo bên trái để bắt đầu tạo
                    </p>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      Tạo báo cáo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <PageHeader 
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
      />
      
      <div className="mb-6">
        {renderHeaderActions()}
      </div>
      
      <TabContainer 
        tabs={tabs} 
        defaultValue={activeTab}
        onValueChange={handleTabChange}
      />
    </PageLayout>
  );
};

export default FinancePage;
