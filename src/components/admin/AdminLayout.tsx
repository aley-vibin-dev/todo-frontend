import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { AdminStackParamList } from '@/navigation/AdminNavigator'
import { RootStackParamList } from '@/navigation/AppNavigator'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useAdminPendingCount } from '@/hooks/useAdminPendingCount';
import { getAdminSidebarItems } from '@/config/admin/adminSidebar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAdminNavbarActions } from '@/config/admin/adminNavbar';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const adminNavigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user, logout } = useAuth();

  const pendingCount = useAdminPendingCount();

  const sidebarItems = getAdminSidebarItems({
    pendingCount,
  });

  const navbarActions = getAdminNavbarActions({
    logout,
    navigationAdmin: adminNavigation,
    navigationRoot: rootNavigation,
  });

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          user={{
            name: user?.name,
            email: user?.email,
            avatar: require('@/../assets/avatar.png'),
          }}
          menuItems={sidebarItems}
          navigation={adminNavigation}
        />
      }
      navbar={
        <Navbar
          title="Admin Portal"
          userLabel={`👨🏻‍💼 ${(user?.role ?? '')?.charAt(0).toUpperCase() + (user?.role ?? '')?.slice(1)}`}
          actions={navbarActions}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
};
