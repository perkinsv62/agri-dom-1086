import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { useUser, User } from '../../contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';

const UserManagement = () => {
  const { users, updateUser, deleteUser } = useUser();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredUsers = users.filter(u => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // clamp page
  if (page > totalPages) setPage(totalPages);

  const start = (page - 1) * pageSize;
  const pagedUsers = filteredUsers.slice(start, start + pageSize);

  const handleStatusToggle = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    updateUser(user.id, { status: newStatus });
    toast({
      title: `Người dùng ${newStatus === 'active' ? 'đã kích hoạt' : 'đã vô hiệu hóa'}`,
      description: `Tài khoản của ${user.name} đã được cập nhật.`
    });
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ${user.name}?`)) {
      deleteUser(user.id);
      toast({
        title: "Người dùng đã được xóa",
        description: `Tài khoản của ${user.name} đã bị xóa khỏi hệ thống.`
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'destructive',
      manager: 'default',
      user: 'secondary'
    } as const;

    const labels = {
      admin: 'Admin',
      manager: 'Quản lý',
      user: 'Người dùng'
    };

    return (
      <Badge variant={variants[role as keyof typeof variants]}>
        {labels[role as keyof typeof labels]}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">Danh sách người dùng</h3>
          <p className="text-sm text-gray-600">Quản lý tài khoản và quyền truy cập</p>
        </div>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Đăng nhập cuối</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>{user.lastLogin || 'Chưa đăng nhập'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                        {user.status === 'active' ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Vô hiệu hóa
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Kích hoạt
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditingUserId(user.id); setEditDialogOpen(true); }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-600">/ {total} người</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Trước
            </Button>
            <span className="text-sm">{page} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Sau
            </Button>
          </div>
        </div>
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingUserId(null);
        }}
        userId={editingUserId}
      />
    </div>
  );
};

export default UserManagement;