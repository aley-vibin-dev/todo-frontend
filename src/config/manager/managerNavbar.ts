// src/config/managerNavbar.ts
import type { NavbarAction } from '@/components/layout/Navbar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { ManagerStackParamList } from '@/navigation/ManagerNavigator';

export const getManagerNavbarActions = ({
  logout,
  navigationManager,
  navigationRoot,
}: {
  logout: () => void;
  navigationManager?: NativeStackNavigationProp<ManagerStackParamList>;
  navigationRoot?: NativeStackNavigationProp<RootStackParamList>;
}): NavbarAction[] => [
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️',
    onPress: () => navigationManager?.navigate('ManagerSettings'),
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