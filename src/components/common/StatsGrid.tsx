import React from 'react';
import { View, Dimensions } from 'react-native';
import { StatsCard } from './StatsCard';

interface StatsGridProps {
  cards: {
    id: string | number;
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    description?: string;
  }[];
  columns?: number; // optional, default based on screen size
  spacing?: number; // optional, space between cards
}

export const StatsGrid: React.FC<StatsGridProps> = ({ cards, columns, spacing = 20 }) => {
  const screenWidth = Dimensions.get('window').width;

  // Dynamic column calculation
  const numColumns = columns || (screenWidth > 600 ? 3 : screenWidth > 400 ? 2 : 1);

  // Calculate card width based on columns and spacing
  const cardWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -spacing / 2,
      }}
    >
      {cards.map((card) => (
        <View
          key={card.id}
          style={{
            width: cardWidth,
            margin: spacing / 2,
          }}
        >
          <StatsCard {...card} />
        </View>
      ))}
    </View>
  );
};
