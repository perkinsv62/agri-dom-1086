
import React from 'react';
import { 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const { financialData } = useStatistics();
  const { profitabilityByParcel, costAnalysis, revenueByMonth } = financialData;

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
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Số tiền']} />
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
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, '']} />
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
              <p className="text-2xl font-semibold">1,062,500,000 VNĐ</p>
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
