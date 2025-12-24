import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '@/navigation/UserNavigator';
import { useAuth } from '@/context/AuthContext';

interface UserSidebarProps {
  collapsed: boolean;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ collapsed }) => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<UserStackParamList>>();

  return (
    <View
      className={`bg-gray-800 p-4 flex-1 justify-between`}
      style={{ width: collapsed ? 55 : 200 }} // collapsed width vs full width
    >
      <View>
        {!collapsed && (
          <>
            <View className="ml-5">
              <Image
                source={require('./../../../assets/avatar.png')}
                className="w-16 h-16 rounded-full mb-2 ml-8"
              />
              <Text className="text-white font-bold text-lg ml-2">{user?.name}</Text>
              <Text className="text-gray-300 text-sm mb-6">{user?.email}</Text>
            </View>
          </>
        )}

        {/* Menu buttons */}
        <TouchableOpacity onPress={() => navigation.navigate('UserHome')} className="mb-4">
          <Text className="text-white text-lg">{collapsed ? '' : 'Home 🏠'}</Text>
        </TouchableOpacity>
      </View>

      {!collapsed && (
        <View className="mb-4 ml-14">
          <TouchableOpacity onPress={() => navigation.navigate('UserSettings')}>
            <Text className="text-gray-400 text-xl ">Settings ⚙️</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
