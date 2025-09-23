import React, { useState } from 'react';
import { EditableTable, Column } from './ui/editable-table';
import { CloudLightning, CloudRain, Wind, Thermometer, Sun, AlertTriangle, Filter, Calendar, PlusCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface WeatherAlert {
  id: number;
  date: string;
  type: 'Mưa lớn' | 'Bão nhiệt đới' | 'Hạn hán' | 'Nóng quá mức' | 'Ngập lụt';
  region: string;
  severity: 'Thấp' | 'Trung bình' | 'Cao' | 'Cực cao';
  impactCrops: 'Nhẹ' | 'Trung bình' | 'Nặng';
  description: string;
  recommendation: string;
  status: 'Hoạt động' | 'Kết thúc' | 'Dự kiến';
}

const alertFormSchema = z.object({
  date: z.string().min(1, { message: "Ngày là bắt buộc" }),
  type: z.enum(['Mưa lớn', 'Bão nhiệt đới', 'Hạn hán', 'Nóng quá mức', 'Ngập lụt']),
  region: z.string().min(1, { message: "Vùng là bắt buộc" }),
  severity: z.enum(['Thấp', 'Trung bình', 'Cao', 'Cực cao']),
  impactCrops: z.enum(['Nhẹ', 'Trung bình', 'Nặng']),
  description: z.string().min(5, { message: "Mô tả quá ngắn" }),
  recommendation: z.string().min(5, { message: "Khuyến nghị quá ngắn" }),
  status: z.enum(['Hoạt động', 'Kết thúc', 'Dự kiến']),
});

const GuadeloupeWeatherAlerts = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      type: 'Mưa lớn',
      region: 'Vùng thấp',
      severity: 'Trung bình',
      impactCrops: 'Trung bình',
      description: '',
      recommendation: '',
      status: 'Hoạt động',
    },
  });
  
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      id: 1,
      date: '2024-06-15',
      type: 'Mưa lớn',
      region: 'Vùng thấp',
      severity: 'Cao',
      impactCrops: 'Trung bình',
      description: 'Dự kiến mưa lớn trong 48 giờ với nguy cơ ngập lụt ở vùng thấp.',
      recommendation: 'Kiểm tra hệ thống thoát nước và bảo vệ cây con. Tạm ngừng tưới tiêu.',
      status: 'Hoạt động'
    },
    {
      id: 2,
      date: '2024-06-20',
      type: 'Bão nhiệt đới',
      region: 'Vùng cao',
      severity: 'Cực cao',
      impactCrops: 'Nặng',
      description: 'Bão nhiệt đới Emily đang tiếp cận với gió có thể vượt quá 120 km/h và mưa lớn.',
      recommendation: 'Thu hoạch dự phòng các cây trồng đã chín. Củng cố giá đỡ chuối. Bảo vệ trang thiết bị nông nghiệp.',
      status: 'Dự kiến'
    },
    {
      id: 3,
      date: '2024-05-25',
      type: 'Hạn hán',
      region: 'Vùng cao',
      severity: 'Trung bình',
      impactCrops: 'Trung bình',
      description: 'Thời gian dài không có mưa đáng kể gây căng thẳng nước cho một số cây trồng.',
      recommendation: 'Ưu tiên tưới tiêu cho cây trồng nhạy cảm. Sử dụng lớp phủ để giữ độ ẩm đất.',
      status: 'Kết thúc'
    },
    {
      id: 4,
      date: '2024-07-05',
      type: 'Nóng quá mức',
      region: 'Các đảo nhỏ',
      severity: 'Trung bình',
      impactCrops: 'Trung bình',
      description: 'Đợt nóng với nhiệt độ vượt quá 35°C trong nhiều ngày liên tiếp.',
      recommendation: 'Che bóng cho cây trồng nhạy cảm. Tăng tần suất tưới, ưu tiên sáng sớm hoặc tối muộn.',
      status: 'Dự kiến'
    },
    {
      id: 5,
      date: '2024-06-10',
      type: 'Ngập lụt',
      region: 'Vùng thấp',
      severity: 'Cao',
      impactCrops: 'Nặng',
      description: 'Tràn sông suối sau những cơn mưa lớn những ngày qua ảnh hưởng đến các lô đất ở vùng thấp.',
      recommendation: 'Di chuyển cây trồng có thể thu hoạch. Chuẩn bị đơn đền bù. Giám sát bệnh nấm.',
      status: 'Kết thúc'
    }
  ]);
  
  const columns: Column[] = [
    { id: 'date', header: 'Ngày', accessorKey: 'date', isEditable: true },
    { id: 'type', header: 'Loại cảnh báo', accessorKey: 'type', isEditable: true },
    { id: 'region', header: 'Vùng', accessorKey: 'region', isEditable: true },
    { id: 'severity', header: 'Mức độ', accessorKey: 'severity', isEditable: true },
    { id: 'status', header: 'Trạng thái', accessorKey: 'status', isEditable: true },
  ];
  
  const filteredAlerts = weatherAlerts.filter(alert => {
    const matchesSearch = 
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });
  
  const handleTableUpdate = (
    rowIndex: number,
    columnId: keyof WeatherAlert,
    value: string | number | boolean | null
  ) => {
    const newData = [...weatherAlerts];
    const itemId = filteredAlerts[rowIndex].id;
    const dataIndex = newData.findIndex((item) => item.id === itemId);

    if (dataIndex !== -1) {
      const updatedItem: WeatherAlert = {
        ...newData[dataIndex],
        // dynamic key update - cast to Partial<WeatherAlert> to keep type safety
        ...({ [columnId]: value } as Partial<WeatherAlert>),
      };

      newData[dataIndex] = updatedItem;
      setWeatherAlerts(newData);

      toast({
        title: "Cảnh báo đã cập nhật",
        description: `Thông tin cảnh báo đã được cập nhật`,
      });
    }
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const itemId = filteredAlerts[rowIndex].id;
    const newData = weatherAlerts.filter(item => item.id !== itemId);
    setWeatherAlerts(newData);
    
    toast({
      title: "Cảnh báo đã xóa",
      description: "Cảnh báo đã được xóa thành công"
    });
  };
  
  const onSubmit = (data: z.infer<typeof alertFormSchema>) => {
    const newId = Math.max(0, ...weatherAlerts.map(item => item.id)) + 1;
    
    const newAlert: WeatherAlert = {
      id: newId,
      date: data.date,
      type: data.type,
      region: data.region,
      severity: data.severity,
      impactCrops: data.impactCrops,
      description: data.description,
      recommendation: data.recommendation,
      status: data.status
    };
    
    setWeatherAlerts([...weatherAlerts, newAlert]);
    setDialogOpen(false);
    form.reset();
    
    toast({
      title: "Cảnh báo đã thêm",
      description: `Cảnh báo thời tiết mới đã thêm cho ${data.region}`
    });
  };
  
  const handleExpandAlert = (id: number) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Mưa lớn':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'Bão nhiệt đới':
        return <Wind className="h-6 w-6 text-purple-500" />;
      case 'Hạn hán':
        return <Sun className="h-6 w-6 text-orange-500" />;
      case 'Nóng quá mức':
        return <Thermometer className="h-6 w-6 text-red-500" />;
      case 'Ngập lụt':
        return <CloudLightning className="h-6 w-6 text-indigo-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Thấp':
        return 'bg-green-100 text-green-800';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cao':
        return 'bg-orange-100 text-orange-800';
      case 'Cực cao':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
        return 'bg-blue-100 text-blue-800';
      case 'Kết thúc':
        return 'bg-gray-100 text-gray-800';
      case 'Dự kiến':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <CloudLightning className="h-6 w-6 mr-2 text-purple-500" />
            Cảnh báo Thời tiết
          </h2>
          <p className="text-muted-foreground">
            Theo dõi các cảnh báo thời tiết ảnh hưởng đến cây trồng và chuẩn bị hành động phòng ngừa
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-grow max-w-sm">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une alerte..."
              className="pl-10"
            />
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[150px]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="Basse">Basse</SelectItem>
              <SelectItem value="Moyenne">Moyenne</SelectItem>
              <SelectItem value="Haute">Haute</SelectItem>
              <SelectItem value="Extrême">Extrême</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Terminée">Terminée</SelectItem>
              <SelectItem value="Prévue">Prévue</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nouvelle alerte
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle alerte météo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type d'alerte</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pluie intense">Pluie intense</SelectItem>
                                <SelectItem value="Tempête tropicale">Tempête tropicale</SelectItem>
                                <SelectItem value="Sécheresse">Sécheresse</SelectItem>
                                <SelectItem value="Chaleur excessive">Chaleur excessive</SelectItem>
                                <SelectItem value="Inondation">Inondation</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Région</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une région" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Basse-Terre">Basse-Terre</SelectItem>
                                <SelectItem value="Grande-Terre">Grande-Terre</SelectItem>
                                <SelectItem value="Marie-Galante">Marie-Galante</SelectItem>
                                <SelectItem value="Les Saintes">Les Saintes</SelectItem>
                                <SelectItem value="La Désirade">La Désirade</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="severity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sévérité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner une sévérité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Basse">Basse</SelectItem>
                                <SelectItem value="Moyenne">Moyenne</SelectItem>
                                <SelectItem value="Haute">Haute</SelectItem>
                                <SelectItem value="Extrême">Extrême</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="impactCrops"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Impact sur les cultures</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un impact" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Faible">Faible</SelectItem>
                                <SelectItem value="Modéré">Modéré</SelectItem>
                                <SelectItem value="Sévère">Sévère</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Statut</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Terminée">Terminée</SelectItem>
                                <SelectItem value="Prévue">Prévue</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="recommendation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommandation</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit">Enregistrer</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Aucune alerte ne correspond aux critères de recherche</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div 
                key={alert.id} 
                className="border rounded-lg overflow-hidden hover:border-blue-200 transition-all"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => handleExpandAlert(alert.id)}
                >
                  <div className="flex items-center space-x-4">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="font-semibold">{alert.type} - {alert.region}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                    {expandedAlertId === alert.id ? (
                      <ArrowUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {expandedAlertId === alert.id && (
                  <div className="p-4 bg-muted/20 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Description</h4>
                        <p className="text-sm">{alert.description}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Recommandations</h4>
                        <p className="text-sm">{alert.recommendation}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-1">Impact sur les cultures</h4>
                      <Badge className={alert.impactCrops === 'Nặng' ? 'bg-red-100 text-red-800' : 
                                      alert.impactCrops === 'Trung bình' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800'}>
                        {alert.impactCrops}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <h3 className="text-lg font-semibold p-4 bg-muted/20 border-b">Gérer les alertes</h3>
          <EditableTable
            data={filteredAlerts}
            columns={columns}
            onUpdate={handleTableUpdate}
            onDelete={handleDeleteRow}
            sortable={true}
            className="border-none"
          />
        </div>
      </div>
    </div>
  );
};

export default GuadeloupeWeatherAlerts;
