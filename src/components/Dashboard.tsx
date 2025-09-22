
import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Sprout, 
  CloudRain, 
  Sun,
  Droplet,
  Wind,
  ArrowRight,
  Calendar,
  Wallet,
  Trash2,
  Plus,
  X,
  Check,
  Edit
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GuadeloupeWeatherAlerts from './GuadeloupeWeatherAlerts';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import PageHeader from './layout/PageHeader';

// Sample data for charts - Adapté pour la Guadeloupe
const revenueData = [
  { month: 'Tháng 1', revenue: 1500 },
  { month: 'Tháng 2', revenue: 2200 },
  { month: 'Tháng 3', revenue: 2500 },
  { month: 'Tháng 4', revenue: 2800 },
  { month: 'Tháng 5', revenue: 3200 },
  { month: 'Tháng 6', revenue: 3500 },
  { month: 'Tháng 7', revenue: 4000 },
];

const productionData = [
  { name: 'Đường mía', value: 40 },
  { name: 'Chuối', value: 25 },
  { name: 'Dứa', value: 15 },
  { name: 'Khoai lang', value: 10 },
  { name: 'Khác', value: 10 },
];

// Task list adapté au contexte guadeloupéen
const initialUpcomingTasks = [
  { id: 1, title: 'Thu hoạch đường mía', due: 'Hôm nay', priority: 'high' },
  { id: 2, title: 'Đặt hàng cây chuối giống', due: 'Ngày mai', priority: 'medium' },
  { id: 3, title: 'Bảo dưỡng máy kéo', due: '28/08', priority: 'low' },
  { id: 4, title: 'Tưới tiêu vườn dứa', due: '30/08', priority: 'medium' },
];

// Alerts pour les agriculteurs en Guadeloupe
const initialAlerts = [
  { id: 1, message: 'Mức cây chuối giống thấp', type: 'warning' },
  { id: 2, message: 'Nguy cơ bão lũ trong tuần tới', type: 'danger' },
  { id: 3, message: 'Hạn nộp trợ cấp vùng sắp đến', type: 'info' },
];

// Weather alerts data
const initialWeatherAlerts = [
  { 
    id: 1, 
    type: 'Bão', 
    region: 'Toàn bộ vùng', 
    startDate: '2023-09-10', 
    endDate: '2023-09-12', 
    severity: 'nghiêm trọng', 
    description: 'Bão nhiệt đới cấp 2 đang tiếp cận' 
  },
  { 
    id: 2, 
    type: 'Mưa', 
    region: 'Vùng thấp', 
    startDate: '2023-09-20', 
    endDate: '2023-09-23', 
    severity: 'trung bình', 
    description: 'Dự kiến mưa lớn' 
  }
];

const Dashboard = () => {
  // Stats cards
  const [alertsCount, setAlertsCount] = useState(3);
  
  // Tasks and alerts
  const [upcomingTasks, setUpcomingTasks] = useState(initialUpcomingTasks);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [weatherAlerts, setWeatherAlerts] = useState(initialWeatherAlerts);
  
  // New alert dialog
  const [showAddAlertDialog, setShowAddAlertDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'Cyclone',
    region: '',
    startDate: '',
    endDate: '',
    severity: 'modérée',
    description: ''
  });
  
  // Task editing state
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  
  // Task management
  const handleEditTask = (taskId: number) => {
    const task = upcomingTasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
      setEditedTaskTitle(task.title);
    }
  };
  
  const handleSaveTask = (taskId: number) => {
    if (editedTaskTitle.trim() === '') return;
    
    setUpcomingTasks(upcomingTasks.map(task => 
      task.id === taskId ? { ...task, title: editedTaskTitle } : task
    ));
    setEditingTask(null);
    toast.success('Nhiệm vụ đã được cập nhật');
  };
  
  const handleDeleteTask = (taskId: number) => {
    setUpcomingTasks(upcomingTasks.filter(task => task.id !== taskId));
    toast.success('Nhiệm vụ đã được xóa');
  };
  
  // Alert management
  const handleEditAlert = (id: number, message: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, message } : alert
    ));
    toast.success('Cảnh báo đã được cập nhật');
  };
  
  const handleDeleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    setAlertsCount(prev => prev - 1);
    toast.success('Cảnh báo đã được xóa');
  };
  
  // Weather alert management
  const handleDeleteWeatherAlert = (id: number) => {
    setWeatherAlerts(weatherAlerts.filter(alert => alert.id !== id));
    toast.success('Cảnh báo thời tiết đã được xóa');
  };
  
  const handleAddWeatherAlert = () => {
    // Validation
    if (!newAlert.region || !newAlert.startDate || !newAlert.endDate || !newAlert.description) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    const newId = Math.max(...weatherAlerts.map(a => a.id), 0) + 1;
    const alertToAdd = {
      id: newId,
      ...newAlert
    };
    
    setWeatherAlerts([...weatherAlerts, alertToAdd]);
    setShowAddAlertDialog(false);
    setNewAlert({
      type: 'Bão',
      region: '',
      startDate: '',
      endDate: '',
      severity: 'trung bình',
      description: ''
    });
    
    toast.success('Cảnh báo thời tiết mới đã được thêm');
  };
  
  // Add transaction handler (placeholder for future implementation)
  const handleAddTransaction = () => {
    toast.info('Chuyển hướng đến trang tài chính');
    // In a real app, this would navigate to the finance page
  };
  
  return (
    <div className="p-6 space-y-6 animate-enter">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Xin chào, Nông dân Việt Nam
          </h1>
          <p className="text-muted-foreground">
            Đây là tổng quan về trang trại nông nghiệp của bạn
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm text-agri-primary font-medium bg-agri-primary/10 rounded-lg hover:bg-agri-primary/20 transition-colors">
            <Calendar className="h-4 w-4 inline mr-2" />
            Tháng 8 năm 2023
          </button>
          <button 
            className="px-4 py-2 text-sm bg-agri-primary text-white rounded-lg hover:bg-agri-primary-dark transition-colors"
            onClick={handleAddTransaction}
          >
            <Wallet className="h-4 w-4 inline mr-2" />
            Thêm giao dịch
          </button>
        </div>
      </header>

      {/* Quick Stats Row - Adapté à l'agriculture guadeloupéenne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card-hover">
          <p className="stat-label">Doanh thu hàng tháng</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              15450 €
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              8.5%
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Diện tích canh tác</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              35 ha
            </p>
            <span className="text-agri-primary text-sm font-medium">
              5 lô đất
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Năng suất trung bình</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              75 t/ha
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              5.2%
            </span>
          </div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Cảnh báo</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">{alertsCount}</p>
            <span className="text-agri-warning text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" /> Gần đây
            </span>
          </div>
        </div>
      </div>

      {/* Weather alerts section */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cảnh báo Thời tiết</h2>
          <Button 
            onClick={() => setShowAddAlertDialog(true)}
            className="bg-agri-primary hover:bg-agri-primary-dark"
          >
            <Plus size={16} className="mr-2" /> Thêm cảnh báo
          </Button>
        </div>
        <p className="text-muted-foreground mb-6">
          Theo dõi các cảnh báo thời tiết ảnh hưởng đến nông nghiệp
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Loại</th>
                <th className="px-4 py-3 text-left">Vùng</th>
                <th className="px-4 py-3 text-left">Thời gian</th>
                <th className="px-4 py-3 text-left">Mức độ</th>
                <th className="px-4 py-3 text-left">Mô tả</th>
                <th className="px-4 py-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {weatherAlerts.map(alert => (
                <tr key={alert.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 flex items-center">
                    {alert.type === 'Bão' ? (
                      <span className="flex items-center text-red-500">
                        <AlertTriangle size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : alert.type === 'Mưa' ? (
                      <span className="flex items-center text-blue-500">
                        <CloudRain size={16} className="mr-1" /> {alert.type}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Wind size={16} className="mr-1" /> {alert.type}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {alert.region}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-muted-foreground">Bắt đầu:</span>
                        {alert.startDate}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Kết thúc:</span>
                        {alert.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      alert.severity === 'nghiêm trọng' 
                        ? 'bg-red-100 text-red-800' 
                        : alert.severity === 'trung bình'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {alert.description}
                  </td>
                  <td className="px-4 py-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteWeatherAlert(alert.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {weatherAlerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                    Không có cảnh báo thời tiết nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="dashboard-card col-span-full lg:col-span-2 card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Doanh thu Hàng tháng</h3>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1.5 bg-muted rounded-md text-foreground">2023</button>
              <button className="text-xs px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-md">2022</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value} €`} />
                <Tooltip formatter={(value) => [`${value} €`, 'Doanh thu']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4CAF50" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 8 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Distribution - Adapté aux cultures guadeloupéennes */}
        <div className="dashboard-card card-hover">
          <h3 className="font-semibold mb-4">Phân bổ Cây trồng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productionData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={80} 
                />
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ lệ phần trăm']} />
                <Bar 
                  dataKey="value" 
                  fill="#8D6E63" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks - Adapté au contexte agricole guadeloupéen */}
        <div className="dashboard-card card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Nhiệm vụ Sắp tới</h3>
            <button className="text-xs text-agri-primary hover:underline">Xem tất cả</button>
          </div>
          
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center p-2 rounded-lg hover:bg-muted"
              >
                <div 
                  className={`w-2 h-2 rounded-full mr-3 ${
                    task.priority === 'high' 
                      ? 'bg-agri-danger' 
                      : task.priority === 'medium' 
                        ? 'bg-agri-warning' 
                        : 'bg-agri-success'
                  }`}
                />
                <div className="flex-1">
                  {editingTask === task.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                        className="border rounded px-2 py-1 text-sm w-full"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleSaveTask(task.id)}
                        className="ml-2 p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setEditingTask(null)}
                        className="ml-1 p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Hạn: {task.due}</p>
                    </>
                  )}
                </div>
                <div className="flex">
                  {editingTask !== task.id && (
                    <>
                      <button 
                        className="p-1.5 hover:bg-muted rounded" 
                        onClick={() => handleEditTask(task.id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-muted rounded text-red-500" 
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Không có nhiệm vụ sắp tới</p>
            )}
          </div>
        </div>
        
        {/* Alerts - Adapté à l'agriculture en Guadeloupe */}
        <div className="dashboard-card card-hover">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Cảnh báo</h3>
            <button className="text-xs text-agri-primary hover:underline">Quản lý cảnh báo</button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg ${
                  alert.type === 'danger' 
                    ? 'bg-agri-danger/10 border-l-4 border-agri-danger' 
                    : alert.type === 'warning' 
                      ? 'bg-agri-warning/10 border-l-4 border-agri-warning' 
                      : 'bg-agri-info/10 border-l-4 border-agri-info'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      alert.type === 'danger' 
                        ? 'text-agri-danger' 
                        : alert.type === 'warning' 
                          ? 'text-agri-warning' 
                          : 'text-agri-info'
                    }`} />
                    <span className="text-sm">{alert.message}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Không có cảnh báo hoạt động</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Weather Alert Dialog */}
      <Dialog open={showAddAlertDialog} onOpenChange={setShowAddAlertDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm cảnh báo thời tiết</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alertType" className="text-right">
                Loại
              </Label>
              <select
                id="alertType"
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Bão">Bão</option>
                <option value="Mưa">Mưa</option>
                <option value="Hạn hán">Hạn hán</option>
                <option value="Gió">Gió</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Vùng
              </Label>
              <Input
                id="region"
                value={newAlert.region}
                onChange={(e) => setNewAlert({...newAlert, region: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newAlert.startDate}
                onChange={(e) => setNewAlert({...newAlert, startDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Ngày kết thúc
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newAlert.endDate}
                onChange={(e) => setNewAlert({...newAlert, endDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="severity" className="text-right">
                Mức độ
              </Label>
              <select
                id="severity"
                value={newAlert.severity}
                onChange={(e) => setNewAlert({...newAlert, severity: e.target.value})}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="thấp">Thấp</option>
                <option value="trung bình">Trung bình</option>
                <option value="nghiêm trọng">Nghiêm trọng</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Input
                id="description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({...newAlert, description: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAlertDialog(false)}>Hủy</Button>
            <Button onClick={handleAddWeatherAlert}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
