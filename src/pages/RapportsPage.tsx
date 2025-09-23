import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  DollarSign,
  Package,
  Sprout,
  CloudRain,
  Users,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Printer,
  Share2,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const RapportsPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleGenerateReport = (reportType: string) => {
    toast.success(`Báo cáo "${reportType}" đã tạo thành công`);
  };

  const handleExportAll = () => {
    toast.success('Đã bắt đầu xuất tất cả báo cáo');
  };

  const rapportTypes = [
    {
      id: 'production',
      title: 'Rapport de Production',
      description: 'Analyse des rendements et de la productivité',
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'Disponible',
      lastUpdate: '2024-01-15'
    },
    {
      id: 'financier',
      title: 'Rapport Financier',
      description: 'Revenus, dépenses et analyse de rentabilité',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'Disponible',
      lastUpdate: '2024-01-14'
    },
    {
      id: 'inventaire',
      title: 'Rapport d\'Inventaire',
      description: 'Stock des équipements et produits',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      status: 'En cours',
      lastUpdate: '2024-01-12'
    },
    {
      id: 'meteorologique',
      title: 'Rapport Météorologique',
      description: 'Conditions climatiques et impact sur les cultures',
      icon: CloudRain,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      status: 'Disponible',
      lastUpdate: '2024-01-15'
    },
    {
      id: 'activites',
      title: 'Rapport d\'Activités',
      description: 'Suivi des tâches et interventions',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      status: 'Disponible',
      lastUpdate: '2024-01-13'
    },
    {
      id: 'cultures',
      title: 'Rapport des Cultures',
      description: 'État sanitaire et planning cultural',
      icon: Sprout,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      status: 'Disponible',
      lastUpdate: '2024-01-15'
    }
  ];

  const rapportTemplates = [
    {
      id: 'mensuel',
      title: 'Rapport Mensuel Complet',
      description: 'Synthèse complète de toutes les activités du mois',
      includes: ['Production', 'Finances', 'Météo', 'Activités']
    },
    {
      id: 'trimestriel',
      title: 'Rapport Trimestriel',
      description: 'Analyse des performances sur 3 mois',
      includes: ['Analyse comparative', 'Tendances', 'Prévisions']
    },
    {
      id: 'annuel',
      title: 'Rapport Annuel',
      description: 'Bilan complet de l\'année agricole',
      includes: ['Bilan financier', 'Rendements', 'Investissements']
    }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">Báo cáo</h1>
                  <p className="text-muted-foreground">Tạo và xem các báo cáo vận hành của bạn</p>
                </div>
              </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportAll}>
              <Download className="h-4 w-4 mr-2" />
              Xuất tất cả
            </Button>
            <Button>
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
          </div>
        </div>

        <Tabs defaultValue="individuels" className="space-y-4">
          <TabsList>
            <TabsTrigger value="individuels">Báo cáo riêng lẻ</TabsTrigger>
            <TabsTrigger value="templates">Báo cáo mẫu</TabsTrigger>
            <TabsTrigger value="personnalises">Báo cáo tuỳ chỉnh</TabsTrigger>
          </TabsList>

          <TabsContent value="individuels" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bộ lọc & Tùy chọn</CardTitle>
                <CardDescription>Cấu hình tham số báo cáo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Khoảng thời gian</label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="quarter">Quý này</SelectItem>
                        <SelectItem value="year">Năm nay</SelectItem>
                        <SelectItem value="custom">Tùy chỉnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ngày cụ thể</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "Chọn ngày"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Định dạng</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rapportTypes.map((rapport) => {
                const Icon = rapport.icon;
                return (
                  <Card key={rapport.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={cn("p-2 rounded-lg", rapport.bgColor)}>
                          <Icon className={cn("h-6 w-6", rapport.color)} />
                        </div>
                        <Badge variant={rapport.status === 'Disponible' ? 'default' : 'secondary'}>
                          {rapport.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{rapport.title}</CardTitle>
                      <CardDescription>{rapport.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Cập nhật lần cuối: {format(new Date(rapport.lastUpdate), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleGenerateReport(rapport.title)}
                            disabled={rapport.status !== 'Disponible'}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Tạo
                          </Button>
                          <Button size="sm" variant="outline">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {rapportTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      {template.title}
                    </CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Bao gồm :</h4>
                        <div className="flex flex-wrap gap-1">
                          {template.includes.map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleGenerateReport(template.title)}>
                          <FileSpreadsheet className="h-4 w-4 mr-1" />
                          Tạo
                        </Button>
                        <Button size="sm" variant="outline">
                          <PieChart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="personnalises" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tạo Báo cáo Tuỳ chỉnh</CardTitle>
                <CardDescription>Cấu hình báo cáo theo nhu cầu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tên báo cáo</label>
                      <input 
                        type="text" 
                        placeholder="Ví dụ: Báo cáo Chuối Tháng 1 2024"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Loại dữ liệu</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="inventaire">Inventaire</SelectItem>
                          <SelectItem value="meteorologie">Météorologie</SelectItem>
                          <SelectItem value="mix">Données mixtes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Các phần cần bao gồm</label>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        'Tóm tắt điều hành',
                        'Dữ liệu sản xuất',
                        'Phân tích tài chính',
                        'Tình trạng cây trồng',
                        'Điều kiện thời tiết',
                        'Tồn kho',
                        'Khuyến nghị',
                        'Biểu đồ',
                        'Bảng chi tiết'
                      ].map((section) => (
                        <label key={section} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">{section}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Tạo báo cáo
                    </Button>
                    <Button variant="outline">
                      Lưu mẫu
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mẫu báo cáo đã lưu</CardTitle>
                <CardDescription>Mẫu báo cáo tuỳ chỉnh của bạn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có mẫu báo cáo tùy chỉnh nào được lưu</p>
                  <p className="text-sm">Tạo mẫu báo cáo đầu tiên của bạn phía trên</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default RapportsPage;