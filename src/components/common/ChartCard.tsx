// src/components/dashboard/ChartCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any;
  labels?: string[];
}

const screenWidth = Dimensions.get('window').width * 0.5;

export const ChartCard: React.FC<ChartCardProps> = ({ title, type, data, labels }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-md mb-4">
      <Text className="text-gray-900 font-bold mb-2">{title}</Text>
      {type === 'line' && <LineChart data={data} width={screenWidth} height={220} chartConfig={{
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
      }} />}
      {type === 'bar' && <BarChart data={data} width={screenWidth} height={220} yAxisLabel="" yAxisSuffix="" chartConfig={{
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
      }} />}
      {type === 'pie' && <PieChart data={data} width={screenWidth} height={220} chartConfig={{
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
      }} accessor="value" backgroundColor="transparent" paddingLeft="15" />}
    </View>
  );
};
