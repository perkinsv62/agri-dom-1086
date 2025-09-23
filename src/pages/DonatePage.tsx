import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heart, Plus, Search, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Donation {
  id: string;
  donorName: string;
  email: string;
  username?: string;
  method?: string; // normalized method key: 'credit_card' | 'bank_transfer' | 'paypal' | etc.
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  message?: string;
  campaign?: string;
  isAnonymous: boolean;
}


// Dữ liệu giả lập
const mockDonations: Donation[] = [
  {
    id: '1',
    donorName: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    username: 'marie.d',
  method: 'credit_card',
    amount: 100,
    currency: 'EUR',
    date: '2024-01-15T14:35:00',
    status: 'completed',
    message: 'Cảm ơn vì công việc tuyệt vời cho nông nghiệp bền vững!',
    campaign: 'Nông nghiệp Hữu cơ 2024',
    isAnonymous: false
  },
  {
    id: '5',
    donorName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    username: 'nguyenvana',
    method: 'bank_transfer',
    amount: 500,
    currency: 'EUR',
    date: '2024-02-10T10:00:00',
    status: 'completed',
    message: 'Ủng hộ dự án địa phương',
    campaign: 'Thiết bị nông nghiệp',
    isAnonymous: false
  },
  {
    id: '6',
    donorName: 'Lê Thị B',
    email: 'lethib@example.com',
    username: 'lethib',
    method: 'paypal',
    amount: 20,
    currency: 'EUR',
    date: '2024-03-01T08:15:00',
    status: 'completed',
    message: 'Ủng hộ nhỏ nhưng chân thành',
    campaign: 'Đào tạo Nông nghiệp',
    isAnonymous: false
  },
  {
    id: '2',
    donorName: 'Ẩn danh',
    email: 'anonymous@anonymous.com',
    username: 'anon250',
  method: 'bank_transfer',
    amount: 250,
    currency: 'EUR',
    date: '2024-01-14T09:10:00',
    status: 'completed',
    campaign: 'Thiết bị nông nghiệp',
    isAnonymous: true
  },
  {
    id: '7',
    donorName: 'Tran C',
    email: 'tranc@example.com',
    username: 'tranc',
    method: 'credit_card',
    amount: 1500,
    currency: 'EUR',
    date: '2024-03-05T12:30:00',
    status: 'completed',
    message: 'Ủng hộ máy móc nông nghiệp',
    campaign: 'Thiết bị nông nghiệp',
    isAnonymous: false
  },
  {
    id: '3',
    donorName: 'Pierre Martin',
    email: 'pierre.martin@email.com',
    username: 'p.martin',
  method: 'paypal',
    amount: 50,
    currency: 'EUR',
    date: '2024-01-13T19:45:00',
    status: 'pending',
    message: 'Ủng hộ cho nông dân trẻ',
    campaign: 'Đào tạo Nông nghiệp',
    isAnonymous: false
  },
  {
    id: '8',
    donorName: 'Maria Gomez',
    email: 'maria.g@example.com',
    username: 'mariag',
    method: 'credit_card',
    amount: 300,
    currency: 'EUR',
    date: '2024-02-20T16:45:00',
    status: 'completed',
    message: 'Good luck!',
    campaign: 'Nông nghiệp Hữu cơ 2024',
    isAnonymous: false
  },
  {
    id: '4',
    donorName: 'Sophie Leroy',
    email: 'sophie.leroy@email.com',
    username: 'sophie.l',
  method: 'credit_card',
    amount: 75,
    currency: 'EUR',
    date: '2024-01-12T07:20:00',
    status: 'failed',
    campaign: 'Nông nghiệp Hữu cơ 2024',
    isAnonymous: false
  }
  ,
  {
    id: '9',
    donorName: 'John Doe',
    email: 'john@example.com',
    username: 'johnd',
    method: 'paypal',
    amount: 40,
    currency: 'EUR',
    date: '2024-04-01T09:00:00',
    status: 'completed',
    message: 'Keep it up',
    campaign: 'Đào tạo Nông nghiệp',
    isAnonymous: false
  },
  {
    id: '10',
    donorName: 'Anna Smith',
    email: 'anna@example.com',
    username: 'annas',
    method: 'bank_transfer',
    amount: 600,
    currency: 'EUR',
    date: '2024-04-10T11:20:00',
    status: 'completed',
    message: 'Support for the community',
    campaign: 'Thiết bị nông nghiệp',
    isAnonymous: false
  }
];

// Mapping of normalized payment method keys to display labels/icons
const paymentMethods: Record<string, { label: string; icon: string }> = {
  credit_card: { label: 'Thẻ tín dụng', icon: '💳' },
  bank_transfer: { label: 'Chuyển khoản', icon: '🏦' },
  paypal: { label: 'PayPal', icon: '📧' },
};

function formatMethod(key?: string) {
  if (!key) return '—';
  const entry = paymentMethods[key];
  if (!entry) return key;
  return (
    <span className="inline-flex items-center space-x-2">
      <span>{entry.icon}</span>
      <span>{entry.label}</span>
    </span>
  );
}

function formatCurrency(value: number, currency = 'EUR') {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}


const DonatePage: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>(mockDonations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  // Dialog form state for adding a donation
  const [newUsername, setNewUsername] = useState<string | undefined>(undefined);
  const [newAmountDisplay, setNewAmountDisplay] = useState<string>(''); // user-facing formatted string
  const [newAmountValue, setNewAmountValue] = useState<number>(0); // numeric value used when creating donation
  const [newMethod, setNewMethod] = useState<string | undefined>(undefined);

  function parseCurrencyInput(input: string) {
    // remove everything except digits, dot and comma
    const cleaned = input.replace(/[^0-9,.-]/g, '');
    // replace comma with dot if comma seems to be decimal separator
    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    let normalized = cleaned;
    if (lastComma > -1 && lastComma > lastDot) {
      // treat comma as decimal separator: replace dots (thousand) and comma -> dot
      normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // remove commas as thousand separators
      normalized = cleaned.replace(/,/g, '');
    }
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function formatCurrencyForInput(value: number) {
    try {
      // show without currency symbol for input clarity, but with thousand separators
      return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value);
    } catch {
      return String(value);
    }
  }

  const filteredDonations = donations.filter(donation => {
    const methodLabel = paymentMethods[donation.method ?? '']?.label ?? '';
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.username ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         methodLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (donation.campaign?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRaised = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredDonations.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDonations = filteredDonations.slice(startIndex, endIndex);

  const goToNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const goToPrevPage = () => setCurrentPage(p => Math.max(1, p - 1));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportDonations = () => {
    toast.success('Export des donations en cours...');
  };

  return (
    <PageLayout>
      <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Quản lý Quyên góp</h1>
            <p className="text-muted-foreground">Quản lý chiến dịch và quyên góp của bạn</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExportDonations}>
            <Download className="h-4 w-4 mr-2" />
            Xuất
          </Button>
          <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm Quyên góp
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm Quyên góp mới</DialogTitle>
                <DialogDescription>
                  Thêm thông tin quyên góp nhanh
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Tên đăng nhập</Label>
                  <Input
                    id="username"
                    list="username-suggestions"
                    value={newUsername ?? ''}
                    onChange={(e) => setNewUsername(e.target.value || undefined)}
                    placeholder="Nhập Tên đăng nhập"
                  />
                  <datalist id="username-suggestions">
                    {Array.from(new Set(donations.map(d => d.username).filter(Boolean))).map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="amount">Số tiền ({mockDonations[0].currency})</Label>
                  <Input
                    id="amount"
                    type="text"
                    value={newAmountDisplay}
                    onChange={(e) => {
                      const display = e.target.value;
                      setNewAmountDisplay(display);
                      const parsed = parseCurrencyInput(display);
                      setNewAmountValue(parsed);
                    }}
                    onBlur={() => {
                      // format on blur for clarity
                      setNewAmountDisplay(formatCurrencyForInput(newAmountValue));
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="method">Phương thức</Label>
                  <Select value={newMethod} onValueChange={(v) => setNewMethod(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(paymentMethods).map(([key, v]) => (
                        <SelectItem key={key} value={key}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewCampaignOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={() => {
                    const amountNum = newAmountValue || 0;
                    const newDonation: Donation = {
                      id: String(Date.now()),
                      donorName: newUsername ?? 'Người dùng',
                      email: 'unknown@example.com',
                      username: newUsername ?? 'guest',
                      method: newMethod ?? 'credit_card',
                      amount: amountNum,
                      currency: mockDonations[0].currency,
                      date: new Date().toISOString(),
                      status: 'completed',
                      isAnonymous: false
                    };
                    setDonations([newDonation, ...donations]);
                    // reset form
                    setNewUsername(undefined);
                    setNewAmountDisplay('');
                    setNewAmountValue(0);
                    setNewMethod(undefined);
                    toast.success('Quyên góp đã được thêm');
                    setIsNewCampaignOpen(false);
                  }}>
                    Thêm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số đã quyên góp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRaised}€</div>
            <p className="text-xs text-muted-foreground">+12% trong tháng</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Số lượt quyên góp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">+3 trong tuần</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chiến dịch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(donations.map(d => d.campaign).filter(Boolean))).length}
            </div>
            <p className="text-xs text-muted-foreground">Số chiến dịch hiện có</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thành công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Quyên góp thành công</p>
          </CardContent>
        </Card>
      </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bảng donations */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên đăng nhập</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">
                        {donation.username ?? (donation.isAnonymous ? 'Ẩn danh' : donation.donorName)}
                      </TableCell>
                      <TableCell>{formatMethod(donation.method)}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(donation.amount, donation.currency)}
                      </TableCell>
                      <TableCell>
                        {new Date(donation.date).toLocaleString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(donation.status)}>
                          {donation.status === 'completed' ? 'Hoàn thành' : 
                           donation.status === 'pending' ? 'Đang chờ' : 'Thất bại'}
                        </Badge>
                      </TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-3 border-t">
              <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-600">/ {filteredDonations.length} dòng</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => goToPrevPage()} disabled={currentPage === 1}>
              Trước
            </Button>
            <span className="text-sm">{currentPage} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => goToNextPage()} disabled={currentPage === totalPages}>
              Sau
            </Button>
          </div>
        </div>
            </CardContent>
          </Card>



      </div>
    </PageLayout>
  );
};

export default DonatePage;