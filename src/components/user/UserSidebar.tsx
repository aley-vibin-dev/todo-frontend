import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getSideBarManager } from '@/services/user'
import { useAuth } from '@/context/AuthContext';
import { UserStackParamList } from '@/navigation/UserNavigator';

interface UserSidebarProps {
  collapsed: boolean;
  sidebarWidth: Animated.Value;
  pendingCount: number;
}

type UserNavProp = NativeStackNavigationProp<UserStackParamList>

export const UserSidebar: React.FC<UserSidebarProps> = ({
  collapsed,
  sidebarWidth,
  pendingCount,
}) => {
  const { user } = useAuth();
  const navigation = useNavigation<UserNavProp>();
  const route = useRoute<RouteProp<UserStackParamList>>();

  const animatedStyle = { width: sidebarWidth };

  interface MenuItemProps {
    label: string;
    icon: string;
    routeName: keyof UserStackParamList;
    badgeCount?: number;
    marginTop?: string;
  }

  const [managerName, setManagerName] = React.useState<string>('');

  useEffect(() => {
  const fetchManagerName = async () => {
    try {
      const data = await getSideBarManager();
      setManagerName(data?.managerName || '');
    } catch (error) {
      console.error('Failed to fetch manager name:', error);
    }
  };
  fetchManagerName();
  }, []);

  const MenuItem: React.FC<MenuItemProps> = React.memo(
    ({ label, icon = '', routeName, badgeCount = 0, marginTop = 'mt-4' }) => {
      const isActive = route.name === routeName;

      return (
        <TouchableOpacity
          onPress={() => navigation.navigate(routeName)}
          className={`mb-4 flex-row items-center justify-between ${marginTop}`}
        >
          {/* Wrap everything in a single Text */}
          <Text
            className={`text-lg ${isActive ? 'text-green-400 font-bold' : 'text-white'}`}
          >
            {`${icon} ${label}`}
          </Text>

          {badgeCount > 0 && (
            <View className="bg-red-500 rounded-full h-6 min-w-[24px] px-1 items-center justify-center">
              <Text className="text-white text-[10px] font-bold">
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
  );

  if (collapsed) return null;

  return (
    <Animated.View
      className="bg-gray-800 flex-1 p-4 justify-between"
      style={animatedStyle}
    >
      <View>
        {/* User info */}
        <View className="mt-24 mb-6">
          <Image
            source={require('./../../../assets/avatar.png')}
            className="w-16 h-16 rounded-full  mb-2"
          />
          <Text className="text-white font-bold text-lg" numberOfLines={1}>
            {user?.name || 'User'}
          </Text>
          <Text className="text-gray-300 text-sm" numberOfLines={1}>
            {user?.email}
          </Text>
          <Text className="text-yellow-400 text-md" numberOfLines={1}>
            {managerName ? `Managed by - ${managerName}` : 'Manager: N/A'}
          </Text>
        </View>

        {/* Menu items */}
        <View className="border-t border-gray-500 pt-8">
          <MenuItem label="Home" icon="🏠" routeName="UserHome" marginTop="mt-4" />
        </View>
        <View className="border-t border-gray-500 pt-8">
          <MenuItem label="Assigned Tasks" icon=":)" routeName="AssignedTasks" marginTop="mt-4" />
        </View>
      </View>

      {/* Footer */}
      <View className="mb-4">
        <View className="border-t border-gray-500 mb-2" />
        <Text className="text-gray-400 text-center text-[10px] tracking-widest uppercase">
          Powered by CodingCops ©
        </Text>
      </View>
    </Animated.View>
  );
};
