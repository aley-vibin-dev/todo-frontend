import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ManagerDashboard = () => {
  return (
    <View style={styles.container}>
      <Text>Manager Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
