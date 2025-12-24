import React from 'react';
import { View, Text } from 'react-native';
import { ManagerLayout } from '@/components/manager/ManagerLayout';

export const ManagerHome = () => {
  return (
    <ManagerLayout>
      {/* Main content area */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-slate-900">
          Welcome to Manager Portal
        </Text>
        <Text className="text-slate-500 mt-2">
          Use the sidebar to navigate through your manager tasks.
        </Text>
      </View>
    </ManagerLayout>
  );
};
