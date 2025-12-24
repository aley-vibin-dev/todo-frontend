// src/components/dashboard/DashboardSection.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-900 mb-4">{title}</Text>
      <View className="space-y-4">{children}</View>
    </View>
  );
};
