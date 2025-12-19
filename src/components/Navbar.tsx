import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Navbar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Navbar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
