import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import { Users } from 'lucide-react';
import usePageMetadata from '../hooks/use-page-metadata';
import UserManagement from '../components/admin/UserManagement';

const AdminPage = () => {
  const {
    title,
    description,
    handleTitleChange,
    handleDescriptionChange
  } = usePageMetadata({
    defaultTitle: 'Quản Lý Tài Khoản',
    defaultDescription: 'Quản lý người dùng, vai trò và quyền truy cập của hệ thống'
  });


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
        

        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <UserManagement />
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminPage;