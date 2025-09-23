import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Globe, Database, User, Shield, Palette, Download } from 'lucide-react';
import { toast } from 'sonner';

const ParametresPage = () => {
  const handleSave = () => {
    toast.success('Lưu cài đặt thành công');
  };

  const handleExport = () => {
    toast.success('Xuất dữ liệu thành công');
  };

  const handleImport = () => {
    toast.success('Nhập dữ liệu thành công');
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Cài đặt</h1>
            <p className="text-muted-foreground">Cấu hình ứng dụng </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Profil Utilisateur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Hồ sơ người dùng
              </CardTitle>
              <CardDescription>
                Quản lý thông tin 
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên người dùng</Label>
                <Input id="username" placeholder="Tên của bạn" defaultValue="Nông dân chuyên nghiệp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@ví dụ.com" defaultValue="contact@exemple.com" />
              </div>
            </CardContent>
          </Card>

          
          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Vị trí & Ngôn ngữ
              </CardTitle>
              <CardDescription>
                Cài đặt vùng và ngôn ngữ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Khu vực</Label>
                <Select defaultValue="guadeloupe">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guadeloupe">Guadeloupe</SelectItem>
                    <SelectItem value="martinique">Martinique</SelectItem>
                    <SelectItem value="guyane">Guyane</SelectItem>
                    <SelectItem value="reunion">La Réunion</SelectItem>
                    <SelectItem value="mayotte">Mayotte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tiền tệ</Label>
                <Select defaultValue="eur">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="usd">Đô la Mỹ ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Đơn vị đo lường</Label>
                <Select defaultValue="metric">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Hệ mét (ha, kg, °C)</SelectItem>
                    <SelectItem value="imperial">Hệ Anh (acre, lb, °F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          
          {/* Données */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Quản lý dữ liệu
              </CardTitle>
              <CardDescription>
                Sao lưu, nhập và xuất dữ liệu của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Sao lưu tự động</h4>
                  <p className="text-sm text-muted-foreground">Sao lưu gần nhất: 2 phút trước</p>
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    Bật
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Xuất dữ liệu</h4>
                  <p className="text-sm text-muted-foreground">Tải xuống tất cả dữ liệu của bạn</p>
                  <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Xuất
                  </Button>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Nhập dữ liệu</h4>
                  <p className="text-sm text-muted-foreground">Phục hồi từ bản sao lưu</p>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    Importer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Bảo mật & Quyền riêng tư
              </CardTitle>
              <CardDescription>
                Quản lý cài đặt bảo mật của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Thay đổi mật khẩu</Label>
                  <Input type="password" placeholder="Mật khẩu mới" />
                </div>
                <div className="space-y-2">
                  <Label>Xác nhận mật khẩu</Label>
                  <Input type="password" placeholder="Xác nhận mật khẩu" />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Tăng cường bảo mật cho tài khoản của bạn</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Chia sẻ dữ liệu ẩn danh</Label>
                  <p className="text-sm text-muted-foreground">Giúp cải thiện ứng dụng</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Hủy</Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ParametresPage;