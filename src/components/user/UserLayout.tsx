import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { UserStackParamList } from '@/navigation/UserNavigator'
import { RootStackParamList } from '@/navigation/AppNavigator'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { getUserSidebarItems } from '@/config/user/userSidebar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserNavbarActions } from '@/config/user/userNavbar';

export const UserLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const userNavigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { user, logout } = useAuth();


  const sidebarItems = getUserSidebarItems();

  const navbarActions = getUserNavbarActions({
    logout,
    navigationUser: userNavigation,
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
          navigation={userNavigation}
        />
      }
      navbar={
        <Navbar
          title="User Portal"
          userLabel={`👨🏻‍💼 ${(user?.role ?? '')?.charAt(0).toUpperCase() + (user?.role ?? '')?.slice(1)}`}
          actions={navbarActions}
        />
      }
    >
      {children}
    </DashboardLayout>
  );
};
