import React from 'react';
import { View, Text } from 'react-native';

export const UserNavbar: React.FC = () => {
  return (
    <View className="h-16 bg-gray-800 flex-row items-center justify-between px-4">
      {/* Left placeholder */}
      <View style={{ width: 30 }} /> 

      <Text className="text-xl font-bold text-white">User Portal</Text>

      {/* Profile placeholder */}
      <View>
        <Text className="text-white text-lg">👤 Profile</Text>
      </View>
    </View>
  );
};
