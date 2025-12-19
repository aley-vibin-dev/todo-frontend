import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TaskCard = () => {
  return (
    <View style={styles.card}>
      <Text>Task Card</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
});
