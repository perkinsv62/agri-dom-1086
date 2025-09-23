import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Switch } from '../ui/switch';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const userSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  role: z.enum(['admin', 'manager', 'user'] as const),
  status: z.enum(['active', 'inactive'] as const)
});

type UserFormData = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  open: boolean;  
  onOpenChange: (open: boolean) => void;
  userId: string | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open: openProp, onOpenChange, userId }) => {
  const { users, updateUser } = useUser();
  const { toast } = useToast();

  const user = users.find(u => u.id === userId) || null;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    }
  }, [user, form, userId]);

  const onSubmit = (data: UserFormData) => {
    if (!user) return;
    updateUser(user.id, {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status
    });
    toast({
      title: 'Cập nhật người dùng',
      description: `Thông tin của ${data.name} đã được cập nhật.`
    });
    onOpenChange(false);
  };
  
  // Only allow disabling 2FA here. Enabling should be handled via a secure flow elsewhere.
  const handle2FAChange = (checked: boolean) => {
    if (!user) return;
    // If user doesn't have 2FA enabled, the switch is disabled and nothing should happen
    if (!user.twoFactorEnabled) return;
    // If checked is true, user attempted to enable — ignore
    if (checked) return;
    // Disable 2FA
    updateUser(user.id, { twoFactorEnabled: false });
    toast({
      title: '2FA đã bị tắt',
      description: `Xác thực hai yếu tố cho ${user.name} đã bị tắt.`
    });
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  };

  return (
    <Dialog open={openProp} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đầy đủ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên người dùng" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Người dùng</SelectItem>
                      <SelectItem value="manager">Quản lý</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <FormLabel>Trạng thái</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Hoạt động</SelectItem>
                            <SelectItem value="inactive">Vô hiệu hóa</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </div>

                    
                  </div>
                </FormItem>
              )}
            />
<FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
            <div className="flex-shrink-0 w-40">
                      <FormLabel className="mb-1">Xác thực hai yếu tố</FormLabel>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={!!user?.twoFactorEnabled}
                          disabled={!user?.twoFactorEnabled}
                          onCheckedChange={(val) => handle2FAChange(!!val)}
                        />
                      </div>
                    </div></FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
