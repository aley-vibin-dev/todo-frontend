// src/components/dashboard/StatsCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => {
  return (
    <View className="bg-white py-4 px-3 rounded-xl shadow-md flex-row items-center justify-between">
      <View>
        <Text className="text-gray-500 font-medium">{title}</Text>
        <Text className="text-2xl font-bold text-gray-900">{value}</Text>
        {description && <Text className="text-gray-400 mt-1">{description}</Text>}
      </View>
      {icon && <Text>icon</Text>}
    </View>
  );
};
