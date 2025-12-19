import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const UserDashboard = () => {
  return (
    <View style={styles.container}>
      <Text>User Dashboard</Text>
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
