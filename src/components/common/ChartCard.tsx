import React, { useState } from 'react';
import { View, Text, LayoutChangeEvent } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

interface ChartCardProps {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: any;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, type, data }) => {
  const [containerWidth, setContainerWidth] = useState(0);

  // Dynamically capture the width of the card
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // Subtract internal padding (p-2 is roughly 8px per side)
    setContainerWidth(width - 16);
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6366f1',
    },
  };

  return (
    <View 
      onLayout={onLayout} 
      className="bg-white p-2 rounded-xl shadow-md flex-1"
    >
      <Text className="text-gray-900 font-bold mb-2 ml-2">{title}</Text>
      
      {containerWidth > 0 && (
        <View className="items-center justify-center">
          {type === 'line' && (
            <LineChart
              data={data}
              width={containerWidth}
              height={200}
              chartConfig={chartConfig}
              bezier // Smoother lines
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          )}

          {type === 'bar' && (
            <BarChart
              data={data}
              width={containerWidth}
              height={200}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              style={{ marginVertical: 8, borderRadius: 16 }}
              fromZero
            />
          )}

          {type === 'pie' && (
            <PieChart
              data={data}
              width={containerWidth}
              height={200}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft={(containerWidth / 20).toString()} 
              absolute // Shows absolute values
            />
          )}
        </View>
      )}
    </View>
  );
};