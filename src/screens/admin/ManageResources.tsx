import React from 'react';
import { View, Text } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const ManageResources = () => {
  return (
    <AdminLayout>
      {/* Main content area */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-slate-900">
          Welcome to Manage Resource Portal
        </Text>
        <Text className="text-slate-500 mt-2">
          Use the sidebar to navigate through your admin tasks.
        </Text>
      </View>
    </AdminLayout>
  );
};
