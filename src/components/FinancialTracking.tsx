import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from './ui/input';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusCircle, Download, Printer, Trash2, FileText } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from './layout/PageHeader';

// Define monthly data (Vietnamese labels)
const monthlyData = [
  { name: 'Tháng 1', income: 8500, expenses: 7200 },
  { name: 'Tháng 2', income: 9200, expenses: 7800 },
  { name: 'Tháng 3', income: 8800, expenses: 7400 },
  { name: 'Tháng 4', income: 10500, expenses: 8100 },
  { name: 'Tháng 5', income: 11200, expenses: 9500 },
  { name: 'Tháng 6', income: 9800, expenses: 7900 },
  { name: 'Tháng 7', income: 12500, expenses: 10200 },
];

// Schema for transaction form
const transactionSchema = z.object({
  date: z.string().min(1, "Ngày là bắt buộc"),
  description: z.string().min(3, "Mô tả quá ngắn"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Số tiền không hợp lệ"
  }),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  type: z.enum(["income", "expense"]),
});

// Currency formatter (Vietnamese locale, Euro)
const formatCurrency = (value: number | string) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(value));

const FinancialTracking = () => {
  // State for editable content (Vietnamese)
  const [title, setTitle] = useState('Theo dõi tài chính');
  const [description, setDescription] = useState('Quản lý doanh thu và chi phí để tối ưu hóa hiệu quả kinh doanh');
  
  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-07-05', description: 'Bán vật phẩm', amount: 3200, category: 'Bán hàng', type: 'income' },
    { id: 2, date: '2023-07-10', description: 'Mua máy tính', amount: 850, category: 'Vật tư', type: 'expense' },
  { id: 3, date: '2023-07-12', description: 'Hóa đơn điện', amount: 320, category: 'Tiện ích', type: 'expense' },
    { id: 4, date: '2023-07-15', description: 'Bán vật phẩm', amount: 1500, category: 'Bán hàng', type: 'income' },
    { id: 5, date: '2023-07-20', description: 'Sửa chữa ', amount: 750, category: 'Bảo trì', type: 'expense' },
    { id: 6, date: '2023-07-25', description: 'Trợ cấp ', amount: 4200, category: 'Trợ cấp', type: 'income' },
    { id: 7, date: '2023-07-28', description: 'Lương nhân công', amount: 2800, category: 'Lương', type: 'expense' },
  ]);
  
  // Filter and stats
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form handling with react-hook-form
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      category: "",
      type: "income" as "income" | "expense",
    },
  });
  
  // Categories for filtering
  const categories = ['all', ...new Set(transactions.map(t => t.category))];
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactions
    .filter(t => {
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      date: data.date,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowAddDialog(false);
    form.reset();
    
  toast.success('Thêm giao dịch thành công');
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  toast.success('Xóa giao dịch thành công');
  };
  
  // Handle edit transaction
  // Note: inline update helper was removed because it was not used in the component.
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Ngày', 'Mô tả', 'Số tiền', 'Danh mục', 'Loại'];
    const rows = transactions.map(t => [
      t.date, 
      t.description, 
      t.amount.toString(), 
      t.category, 
      t.type === 'income' ? 'Doanh thu' : 'Chi phí'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Dữ liệu đã được xuất CSV');
  };
  
  // Print transactions
  const printTransactions = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Không thể mở cửa sổ in');
      return;
    }
    
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Giao dịch tài chính</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            h2 { margin-bottom: 5px; }
            .summary { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Giao dịch tài chính</h1>
            <div class="summary">
            <p>Tổng doanh thu: <b>${formatCurrency(totalIncome)}</b></p>
            <p>Tổng chi phí: <b>${formatCurrency(totalExpenses)}</b></p>
            <p>Số dư: <b class="${balance >= 0 ? 'income' : 'expense'}">${formatCurrency(balance)}</b></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Mô tả</th>
                <th>Số tiền</th>
                <th>Danh mục</th>
                <th>Loại</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.description}</td>
                  <td class="${t.type === 'income' ? 'income' : 'expense'}">${formatCurrency(t.amount)}</td>
                  <td>${t.category}</td>
                  <td>${t.type === 'income' ? 'Doanh thu' : 'Chi phí'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.success('Chuẩn bị in xong');
  };
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title={title}
        description={description}
          onTitleChange={(value) => {
          setTitle(String(value));
          toast.success('Tiêu đề đã được cập nhật');
        }}
        onDescriptionChange={(value) => {
          setDescription(String(value));
          toast.success('Mô tả đã được cập nhật');
        }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Doanh thu</CardTitle>
            <CardDescription>Tổng thu</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Chi phí</CardTitle>
            <CardDescription>Tổng chi</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Số dư</CardTitle>
            <CardDescription>Doanh thu - Chi phí</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Tổng quan hàng tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value))]} 
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar name="Doanh thu" dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar name="Chi phí" dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <div className="flex gap-2">
                <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4 mr-1" />
                Xuất CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={printTransactions}
              >
                <Printer className="h-4 w-4 mr-1" />
                In
              </Button>
              <Button 
                onClick={() => setShowAddDialog(true)}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-4">
              <select
                className="px-3 py-1 border rounded-md text-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="income">Doanh thu</option>
                <option value="expense">Chi phí</option>
              </select>
              
              <select
                className="px-3 py-1 border rounded-md text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                    <option key={cat} value={cat}>
                    {cat === 'all' ? 'Tất cả danh mục' : cat}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-1 border rounded-md text-sm ml-auto"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
              >
                <option value="date-desc">Ngày (mới nhất)</option>
                <option value="date-asc">Ngày (cũ nhất)</option>
                <option value="amount-desc">Số tiền (cao)</option>
                <option value="amount-asc">Số tiền (thấp)</option>
              </select>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      <FileText className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        
                        <span className="text-sm font-medium">{new Date(transaction.date).toLocaleDateString()}</span>
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">{transaction.category}</span>
						
                      </div>
					  <span className="text-muted-foreground text-sm mt-1">{transaction.description}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                     
                      <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>{formatCurrency(transaction.amount)}</span>
                      
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">Không tìm thấy giao dịch</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm giao dịch</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Loại giao dịch</FormLabel>
                      <div className="flex mt-1">
                        <Button
                          type="button"
                          variant={field.value === 'income' ? 'default' : 'outline'}
                          className={field.value === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => field.onChange('income')}
                        >
                          Doanh thu
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'expense' ? 'default' : 'outline'}
                          className={`ml-2 ${field.value === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => field.onChange('expense')}
                        >
                          Chi phí
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                          />
                          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số tiền (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Danh mục</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Bán hàng, Vật tư..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Thêm</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialTracking;
