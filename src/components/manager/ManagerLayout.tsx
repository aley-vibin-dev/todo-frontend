import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ManagerStackParamList } from '@/navigation/ManagerNavigator'
import { RootStackParamList } from '@/navigation/AppNavigator'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { getManagerSidebarItems } from '@/config/manager/managerSidebar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getManagerNavbarActions } from '@/config/manager/managerNavbar';

export const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const managerNavigation = useNavigation<NativeStackNavigationProp<ManagerStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user, logout } = useAuth();


  const sidebarItems = getManagerSidebarItems();

  const navbarActions = getManagerNavbarActions({
    logout,
    navigationManager: managerNavigation,
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
          navigation={managerNavigation}
        />
      }
      navbar={
        <Navbar
          title="Manager Portal"
          userLabel={`👨🏻‍💼 ${(user?.role ?? '')?.charAt(0).toUpperCase() + (user?.role ?? '')?.slice(1)}`}
          actions={navbarActions}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
};
