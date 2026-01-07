import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { navigate } from '@/navigation/RootNavigation';
import { AdminStackParamList } from '@/navigation/AdminNavigator';

interface AdminSidebarProps {
  collapsed: boolean;
  sidebarWidth: Animated.Value;
  pendingCount: number; // ✅ pass this from parent
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, sidebarWidth, pendingCount }) => {
  const { user } = useAuth();

  const animatedStyle = { width: sidebarWidth };

  interface MenuItemProps {
    label: string;
    icon: string;
    routeName: keyof AdminStackParamList;
    badgeCount?: number;
    marginTop?: string;
  }

  const MenuItem: React.FC<MenuItemProps> = ({ label, icon, routeName, badgeCount, marginTop = 'mt-2' }) => (
    <TouchableOpacity
      onPress={() => navigate('Admin', { screen: routeName })} // ✅ navigate safely via parent stack
      className={`mb-4 flex-row items-center justify-between ${marginTop}`}
    >
      <Text className="text-white text-lg">{icon} {label}</Text>
      {badgeCount && badgeCount > 0 && (
        <View className="bg-red-500 rounded-full h-6 min-w-[24px] px-1 items-center justify-center">
          <Text className="text-white text-[10px] font-bold">
            {badgeCount > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (collapsed) return null;

  return (
    <Animated.View className="bg-gray-800 flex-1 p-4 justify-between" style={animatedStyle}>
      <View>
        <View className="mt-10 ml-2 mb-6">
          <Image
            source={require('./../../../assets/avatar.png')}
            className="w-16 h-16 rounded-full mb-2"
          />
          <Text className="text-white font-bold text-lg" numberOfLines={1}>
            {user?.name || 'Admin'}
          </Text>
          <Text className="text-gray-300 text-sm" numberOfLines={1}>
            {user?.email}
          </Text>
        </View>

        <View className="border-t border-gray-500 pt-8">
          <MenuItem label="Home" icon="🏠" routeName="AdminHome" marginTop="mt-4" />
          <MenuItem label="Manage Resources" icon="👨🏻‍💼" routeName="ManageResources" />
          <MenuItem label="Approve Resources" icon="✅" routeName="ApproveResources" badgeCount={pendingCount} />
          <MenuItem label="Remove Resources" icon="❌" routeName="DeleteResource" />
          <MenuItem label="Resources Progress" icon="📈" routeName="ResourceProgress" />
        </View>
      </View>

      <View className="mb-4">
        <View className="border-t border-gray-500 mb-2" />
        <Text className="text-gray-400 text-center text-[10px] tracking-widest uppercase">
          Powered by CodingCops ©
        </Text>
      </View>
    </Animated.View>
  );
};
