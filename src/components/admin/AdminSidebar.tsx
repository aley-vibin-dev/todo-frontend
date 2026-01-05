import React from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/navigation/AdminNavigator';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
  collapsed: boolean;
  sidebarWidth: Animated.Value;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, sidebarWidth }) => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  // Animated style for the sidebar
  const animatedStyle = {
    width: sidebarWidth,
  };

  return (
    !collapsed && <Animated.View
      className="bg-gray-800 flex-1 p-4 justify-between"
      style={animatedStyle}
    >
      <View>
        {/* User info */}
          <View className="mt-10 ml-2 mb-6">
            <Image
              source={require('./../../../assets/avatar.png')}
              className="w-16 h-16 rounded-full mb-2"
            />
            <Text className="text-white font-bold text-lg">{user?.name}</Text>
            <Text className="text-gray-300 text-sm">{user?.email}</Text>
          </View>

        {/* Menu buttons */}
        <View className='border-t border-gray-500'>
          <TouchableOpacity onPress={() => navigation.navigate('AdminHome')} className="mb-4">
            <Text className="text-white text-lg mt-12">🏠 Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ManageResources')} className="mb-4">
            <Text className="text-white text-lg mt-2">👨🏻‍💼 Manage Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ApproveResources')} className="mb-4">
            <Text className="text-white text-lg mt-2">✅ Approve Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('DeleteResource')} className="mb-4">
            <Text className="text-white text-lg mt-2">❌ Remove Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ResourceProgress')} className="mb-4">
            <Text className="text-white text-lg mt-2">📈 Resources Progress</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
        <View className="mb-4">
          <View className="border-t border-gray-500 mb-2" />
          <Text className="text-gray-400 text-center text-sm">Powered by CodingCops ©</Text>
        </View>
    </Animated.View>
  );
};
