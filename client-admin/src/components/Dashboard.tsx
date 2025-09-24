import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dữ liệu mẫu theo tháng cho biểu đồ - Phù hợp cho Guadeloupe
const revenueData = [
  { month: 'Tháng 1', revenue: 1500 },
  { month: 'Tháng 2', revenue: 2200 },
  { month: 'Tháng 3', revenue: 2500 },
  { month: 'Tháng 4', revenue: 2800 },
  { month: 'Tháng 5', revenue: 3200 },
  { month: 'Tháng 6', revenue: 3500 },
  { month: 'Tháng 7', revenue: 4000 },
];

// Mở rộng dữ liệu theo tháng thành chuỗi theo ngày bằng cách chia mỗi tháng thành 30 ngày.
// Đây là dữ liệu giả lập (proxy); thay bằng dữ liệu ngày thực tế khi có sẵn.
const dailyRevenueData = revenueData.flatMap((m, idx) => {
  const perDay = m.revenue / 30;
  // create label as DD/MM (zero-padded). We approximate each month as 30 days.
  return Array.from({ length: 30 }).map((_, dayIndex) => {
    const day = dayIndex + 1;
    const month = idx + 1;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      day: `${pad(day)}/${pad(month)}`,
      revenue: Math.round(perDay),
    };
  });
});

// Chỉ sử dụng 10 ngày gần nhất cho chế độ hiển thị nhỏ gọn
const last10Daily = dailyRevenueData.slice(-10);

// Compute min/max for revenue to set YAxis domain (start near min, not 0)
const revenueValues = last10Daily.map(d => d.revenue);
const minRevenue = Math.min(...revenueValues);
const maxRevenue = Math.max(...revenueValues);
const revenuePadding = Math.max(1, Math.round((maxRevenue - minRevenue) * 0.1));
const revenueDomainMin = Math.max(0, minRevenue - revenuePadding);
const revenueDomainMax = maxRevenue + revenuePadding;

// Simulated users series for the last 10 days (small daily fluctuations around usersCount)
const last10Users = last10Daily.map((d, i) => ({
  day: d.day,
  users: Math.round(3500 + (i - 5) * 10 + (i % 2 === 0 ? 5 : -5)),
}));

// Compute min/max for users to set YAxis domain (start near min, not 0)
const usersValues = last10Users.map(u => u.users);
const minUsers = Math.min(...usersValues);
const maxUsers = Math.max(...usersValues);
const usersPadding = Math.max(5, Math.round((maxUsers - minUsers) * 0.1));
const usersDomainMin = Math.max(0, minUsers - usersPadding);
const usersDomainMax = maxUsers + usersPadding;

// (productionData removed — not used in Dashboard)

// Các kiểu và formatter dùng chung cho biểu đồ
const axisTickStyle = { fontSize: 12, fill: '#6b7280' };
const tooltipContentStyle = { fontSize: 12, padding: '6px 8px', background: '#ffffff', border: '1px solid #e5e7eb' };
const tooltipItemStyle = { fontSize: 12 };
const tooltipLabelStyle = { fontSize: 11, color: '#6b7280' };
const formatCurrency = (value: number | string, opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'EUR', ...(opts || {}) }).format(Number(value));
const formatNumber = (value: number | string) => new Intl.NumberFormat('vi-VN').format(Number(value));
const formatVND = (value: number | string) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value));

// (weather/alerts removed — not used in this Dashboard)

// Sample recent donations (Quyên góp gần nhất)
const initialDonations = [
  { id: 1, donor: 'Nguyễn Văn A', amount: 500000, datetime: '2025-09-20 14:32', method: 'Thẻ', message: 'Ủng hộ dự án trồng chuối' },
  { id: 2, donor: 'Công ty ABC', amount: 2000000, datetime: '2025-09-18 09:10', method: 'Chuyển khoản', message: 'Quyên góp máy tưới' },
  { id: 3, donor: 'Trần Thị B', amount: 250000, datetime: '2025-09-15 18:45', method: 'Tiền mặt', message: 'Hỗ trợ cộng đồng' },
];

// (weather alerts removed — replaced by donations table)

const Dashboard = () => {
  // Stats cards
  // Users stats (display and growth)
  const usersCount = 3500;
  const usersGrowth = 0.05; // 5% growth
  // Calculate average monthly revenue per user
  const avgMonthlyRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0) / revenueData.length;
  const revenuePerUser = avgMonthlyRevenue / usersCount;
  // Latest month revenue and growth vs previous month
  const latestRevenue = revenueData.length ? revenueData[revenueData.length - 1].revenue : 0;
  const prevRevenue = revenueData.length > 1 ? revenueData[revenueData.length - 2].revenue : latestRevenue;
  const revenueGrowth = prevRevenue ? (latestRevenue - prevRevenue) / prevRevenue : 0;
  // Estimate today's revenue by dividing latest monthly revenue by 30
  const todayRevenue = 132;
  // Estimate yesterday's revenue similarly (use previous month's revenue as a proxy)
  const yesterdayRevenue = 400;
  // Compute growth vs yesterday (use proxy values); guard division by zero
  const todayGrowth = yesterdayRevenue ? (todayRevenue - yesterdayRevenue) / yesterdayRevenue : 0;
  
  // Tasks
  const donations = initialDonations;
  
  // (weather alert dialog/state removed)
  
  // (alerts management removed - moved to AlertsPanel component)
  
  return (
    <div className="p-6 space-y-6 animate-enter">
      

      {/* Hàng Thống Kê Nhanh - phù hợp với nông nghiệp địa phương */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card card-hover">
          <p className="stat-label">Doanh thu hôm nay</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {formatCurrency(todayRevenue, { maximumFractionDigits: 0 })}
            </p>
            <span className={`text-sm font-medium flex items-center ${todayGrowth > 0 ? 'text-agri-success' : todayGrowth < 0 ? 'text-agri-danger' : 'text-agri-primary'}`}>
              {todayGrowth < 0 ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-1" />
              )}
              {todayGrowth > 0 ? '+' : ''}{(todayGrowth * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">So sánh với hôm qua</div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Người dùng</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {formatNumber(usersCount)}
            </p>
            <span className={`text-sm font-medium flex items-center ${usersGrowth > 0 ? 'text-agri-success' : usersGrowth < 0 ? 'text-agri-danger' : 'text-agri-primary'}`}>
              {usersGrowth < 0 ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-1" />
              )}
              {usersGrowth > 0 ? '+' : ''}{Math.round(usersGrowth * 100)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">So với tháng trước</div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Doanh thu trung bình</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {formatCurrency(revenuePerUser, { maximumFractionDigits: 2 })}
            </p>
            <span className="text-agri-success text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" /> +
              5.2%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Trung bình hàng tháng / người</div>
        </div>
        
        <div className="stat-card card-hover">
          <p className="stat-label">Doanh thu hàng tháng</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="stat-value">
              {formatCurrency(latestRevenue, { maximumFractionDigits: 0 })}
            </p>
            <span className={`text-sm font-medium flex items-center ${revenueGrowth > 0 ? 'text-agri-success' : revenueGrowth < 0 ? 'text-agri-danger' : 'text-agri-primary'}`}>
              {revenueGrowth < 0 ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-1" />
              )}
              {revenueGrowth > 0 ? '+' : ''}{(revenueGrowth * 100).toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">So với tháng trước</div>
        </div>
      </div>

      {/* Recent Donations section (Quyên góp gần nhất) */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Hoạt động Nạp thẻ </h2>
        </div>
        <p className="text-muted-foreground mb-6">Danh sách các khoản nạp thẻ mới nhất</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Người quyên góp</th>
                <th className="px-4 py-3 text-left">Số tiền</th>
                <th className="px-4 py-3 text-left">Ngày</th>
                <th className="px-4 py-3 text-left">Phương thức</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">{d.donor}</td>
                  <td className="px-4 py-3">{formatVND(d.amount)}</td>
                  <td className="px-4 py-3">{d.datetime}</td>
                  <td className="px-4 py-3">{d.method}</td>
                  
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">Không có khoản quyên góp nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart (daily proxy) */}
        <div className="dashboard-card col-span-full lg:col-span-1 card-hover">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Doanh thu theo ngày</h2>
          </div>
          <p className="text-muted-foreground mb-6">
          Theo dõi doanh thu hàng ngày trong 10 ngày qua
        </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={last10Daily}
                syncId="dashboard-sync"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTickStyle} />
                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} tickFormatter={(value) => `${value} €`} domain={[revenueDomainMin, revenueDomainMax]} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value))]}
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
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

        {/* Users small chart */}
          <div className="dashboard-card col-span-full sm:col-span-1 card-hover">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Người dùng</h2>
            </div>
            <p className="text-muted-foreground mb-6">
          Theo dõi tốc độ tăng trưởng người dùng trong 10 ngày qua
        </p>
            {/* Keep a matching visual height ratio to the revenue chart for alignment */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last10Users} syncId="dashboard-sync" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTickStyle} />
                    <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} tickFormatter={(v) => formatNumber(v)} domain={[usersDomainMin, usersDomainMax]} />
                    <Tooltip
                      formatter={(value) => [formatNumber(Number(value))]}
                      contentStyle={tooltipContentStyle}
                      itemStyle={tooltipItemStyle}
                      labelStyle={tooltipLabelStyle}
                    />
                  <Area type="monotone" dataKey="users" stroke="#2196F3" fillOpacity={0.2} fill="#BBDEFB" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

      </div>


    </div>
  );
};

export default Dashboard;
