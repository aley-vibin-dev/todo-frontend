import React from 'react';
import { View, Text } from 'react-native';
import { UserLayout } from '@/components/user/UserLayout';

export const UserSettings = () => {
  return (
    <UserLayout>
      {/* Main content area */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-slate-900">
          Welcome to User Settings
        </Text>
        <Text className="text-slate-500 mt-2">
          Use the sidebar to navigate through your User tasks.
        </Text>
      </View>
    </UserLayout>
  );
};
