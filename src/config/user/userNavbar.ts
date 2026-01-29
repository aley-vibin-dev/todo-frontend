// src/config/userNavbar.ts
import type { NavbarAction } from '@/components/layout/Navbar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { UserStackParamList } from '@/navigation/UserNavigator';

export const getUserNavbarActions = ({
  logout,
  navigationUser,
  navigationRoot,
}: {
  logout: () => void;
  navigationUser?: NativeStackNavigationProp<UserStackParamList>;
  navigationRoot?: NativeStackNavigationProp<RootStackParamList>;
}): NavbarAction[] => [
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙️',
    onPress: () => navigationUser?.navigate('UserSettings'),
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