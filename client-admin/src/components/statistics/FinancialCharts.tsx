
import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const revenueByMonth = [
  { month: 'Thg 1', revenue: 28500, expenses: 20100, profit: 8400 },
  { month: 'Thg 2', revenue: 30200, expenses: 21800, profit: 8400 },
  { month: 'Thg 3', revenue: 32800, expenses: 22400, profit: 10400 },
  { month: 'Thg 4', revenue: 35500, expenses: 23100, profit: 12400 },
  { month: 'Thg 5', revenue: 38200, expenses: 23500, profit: 14700 },
  { month: 'Thg 6', revenue: 37800, expenses: 22900, profit: 14900 },
  { month: 'Thg 7', revenue: 42500, expenses: 24200, profit: 18300 },
  { month: 'Thg 8', revenue: 44800, expenses: 25300, profit: 19500 },
  { month: 'Thg 9', revenue: 40200, expenses: 24800, profit: 15400 },
  { month: 'Thg 10', revenue: 38200, expenses: 23100, profit: 15100 },
  { month: 'Thg 11', revenue: 36500, expenses: 22500, profit: 14000 },
  { month: 'Thg 12', revenue: 41200, expenses: 25800, profit: 15400 }
];
const costAnalysis  = [
  { name: 'Thiết bị', value: 1800, color: '#4CAF50' },
  { name: 'Nhân công', value: 2200, color: '#8D6E63' },
  { name: 'Bảo trì', value: 1500, color: '#FFC107' },
  { name: 'Hoa hồng', value: 1200, color: '#2196F3' },
  { name: 'Quảng cáo', value: 3500, color: '#673AB7' },
];

  // Currency formatter for VND
  const formatCurrency = (value: number | string) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value));

  return (
    <div className="space-y-6">
      
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân tích chi phí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costAnalysis}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }} 
                    width={80} 
                  />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Số tiền']} />
                  <Bar 
                    dataKey="value" 
                    fill="#8D6E63" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu và chi phí hàng tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value))]} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#4CAF50" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" name="Chi phí" stroke="#F44336" />
                  <Line type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#2196F3" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Chỉ số tài chính chính</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">EBE (EBITDA)</p>
              <p className="text-2xl font-semibold">{formatCurrency(1062500000)}</p>
              <p className="text-xs text-green-600">32% doanh thu</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Khả năng sinh lời</p>
              <p className="text-2xl font-semibold">18%</p>
              <p className="text-xs text-green-600">+2.5% so với năm trước</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-semibold">22%</p>
              <p className="text-xs text-muted-foreground">Trên đầu tư</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
