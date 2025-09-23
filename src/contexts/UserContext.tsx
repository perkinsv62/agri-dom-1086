import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'user' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserContextType {
  currentUser: User | null;
  users: User[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsersByRole: (role: UserRole) => User[];
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@agri.com',
    role: 'admin',
    status: 'active',
    twoFactorEnabled: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-09-22'
  },
  {
    id: '2',
    name: 'Trần Thị Nông Dân',
    email: 'farmer@agri.com',
    role: 'user',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-02-01',
    lastLogin: '2024-09-20'
  },
  {
    id: '3',
    name: 'Lê Văn Quản Lý',
    email: 'manager@agri.com',
    role: 'manager',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-03-01',
    lastLogin: '2024-09-21'
  }
  ,
  {
    id: '4',
    name: 'Phạm Thị Hồng',
    email: 'pham.hong@example.com',
    role: 'user',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-04-12',
    lastLogin: '2024-09-18'
  },
  {
    id: '5',
    name: 'Ngô Văn B',
    email: 'ngovanb@example.com',
    role: 'user',
    status: 'inactive',
    twoFactorEnabled: false,
    createdAt: '2024-05-03',
    lastLogin: '2024-07-20'
  },
  {
    id: '6',
    name: 'Bùi Thị C',
    email: 'buitc@example.com',
    role: 'manager',
    status: 'active',
    twoFactorEnabled: true,
    createdAt: '2024-06-15',
    lastLogin: '2024-09-15'
  },
  {
    id: '7',
    name: 'Trịnh Văn D',
    email: 'trinhvd@example.com',
    role: 'user',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-07-01',
    lastLogin: '2024-08-22'
  },
  {
    id: '8',
    name: 'Lưu Thị E',
    email: 'luite@example.com',
    role: 'user',
    status: 'inactive',
    twoFactorEnabled: false,
    createdAt: '2024-07-20',
    lastLogin: '2024-07-21'
  },
  {
    id: '9',
    name: 'Hoàng Văn F',
    email: 'hoangvf@example.com',
    role: 'manager',
    status: 'active',
    twoFactorEnabled: true,
    createdAt: '2024-08-05',
    lastLogin: '2024-09-10'
  },
  {
    id: '10',
    name: 'Đặng Thị G',
    email: 'dangtg@example.com',
    role: 'user',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-08-25',
    lastLogin: '2024-09-02'
  },
  {
    id: '11',
    name: 'Phan Văn H',
    email: 'phanvh@example.com',
    role: 'user',
    status: 'active',
    twoFactorEnabled: false,
    createdAt: '2024-09-01',
    lastLogin: '2024-09-05'
  }
];

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Default to admin for demo

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      twoFactorEnabled: userData.twoFactorEnabled ?? false,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user =>
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUsersByRole = (role: UserRole) => {
    return users.filter(user => user.role === role);
  };

  const isAdmin = currentRole === 'admin';

  const value: UserContextType = {
    currentUser,
    users,
    currentRole,
    setCurrentRole,
    addUser,
    updateUser,
    deleteUser,
    getUsersByRole,
    isAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};