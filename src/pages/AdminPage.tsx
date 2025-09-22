import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Users, Settings, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import usePageMetadata from '../hooks/use-page-metadata';
import UserManagement from '../components/admin/UserManagement';

const AdminPage = () => {
  const { isAdmin, setCurrentRole, currentRole } = useUser();
  const { toast } = useToast();

  const {
    title,
    description,
    handleTitleChange,
    handleDescriptionChange
  } = usePageMetadata({
    defaultTitle: 'Quản Lý Tài Khoản',
    defaultDescription: 'Quản lý người dùng, vai trò và quyền truy cập của hệ thống'
  });

  const handleSwitchToAdmin = () => {
    setCurrentRole('admin');
    toast({
      title: "Đã chuyển sang chế độ Admin",
      description: "Bạn có thể quản lý tài khoản người dùng."
    });
  };

  const handleSwitchToUser = () => {
    setCurrentRole('user');
    toast({
      title: "Đã chuyển sang chế độ Người dùng",
      description: "Bạn đang ở chế độ người dùng thông thường."
    });
  };

  if (!isAdmin) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <Shield className="h-16 w-16 text-gray-400" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Truy cập bị hạn chế
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn cần quyền Admin để truy cập trang quản lý tài khoản.
            </p>
            <Button onClick={handleSwitchToAdmin} className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Chuyển sang Admin
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={title}
        description={description}
        onTitleChange={handleTitleChange}
        onDescriptionChange={handleDescriptionChange}
        icon={<Users className="h-6 w-6" />}
      />

      <div className="space-y-6">
        {/* Role Switcher */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Chế độ hiện tại</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Vai trò hiện tại: <strong>{currentRole === 'admin' ? 'Admin' : 'Người dùng'}</strong>
            </span>
            <Button
              variant="outline"
              onClick={currentRole === 'admin' ? handleSwitchToUser : handleSwitchToAdmin}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {currentRole === 'admin' ? 'Chuyển sang Người dùng' : 'Chuyển sang Admin'}
            </Button>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <UserManagement />
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPage;