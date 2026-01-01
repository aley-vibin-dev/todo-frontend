import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/navigation/AdminNavigator';
import { RootStackParamList } from '@/navigation/AppNavigator';

interface AdminNavbarProps {
  collapsed: boolean;
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  }

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  collapsed,
  showDropdown,
  setShowDropdown,
}) => {
  const { user, logout } = useAuth();
  const navigationAdmin =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const navigationRoot =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Redirect if no roles
  React.useEffect(() => {
    if (!user?.roles || user.roles.length === 0) {
      logout();
      navigationRoot.navigate('Login', { sessionout_error: true });
    }
  }, [user]);

  return (
    <View
      className="h-32 bg-gray-800 flex-row items-center justify-between border-b border-gray-700 pt-12"
      style={{ paddingHorizontal: collapsed ? 12 : 20 }}
    >
      <View style={{ width: 24 }} />
      <Text className="text-xl font-bold text-white">Admin Portal</Text>

      <View style={{ position: 'relative' }}>
        {collapsed && (
          <TouchableOpacity
            onPress={() => setShowDropdown(prev => !prev)}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">
              👨🏻‍💼 {user?.roles?.join(', ')} {showDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
        )}

        {showDropdown && (
          <View
            className="absolute mt-9 bg-gray-100 rounded shadow-xxl z-50 w-44"
            style={{ right: -5 }}
          >
            <TouchableOpacity
              className="px-5 py-3 border-b border-gray-300"
              onPress={() => {
                setShowDropdown(false);
                navigationAdmin.navigate('AdminSettings');
              }}
            >
              <Text>⚙️ Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-5 py-3"
              onPress={() => {
                setShowDropdown(false);
                logout();
                navigationRoot.navigate('Landing');
              }}
            >
              <Text className="text-red-500 font-semibold">🚪 Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
