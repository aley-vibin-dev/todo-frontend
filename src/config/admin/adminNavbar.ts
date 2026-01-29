// src/config/adminNavbar.ts
import type { NavbarAction } from '@/components/layout/Navbar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { AdminStackParamList } from '@/navigation/AdminNavigator';

export const getAdminNavbarActions = ({
  logout,
  navigationAdmin,
  navigationRoot,
}: {
  logout: () => void;
  navigationAdmin?: NativeStackNavigationProp<AdminStackParamList>;
  navigationRoot?: NativeStackNavigationProp<RootStackParamList>;
}): NavbarAction[] => [
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️',
    onPress: () => navigationAdmin?.navigate('AdminSettings'),
  },
  {
    key: 'logout',
    label: 'Sign Out',
    icon: '🚪',
    danger: true,
    onPress: () => {
      logout();
      navigationRoot?.navigate('Landing');
    },
  },
];