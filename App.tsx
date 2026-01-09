import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/context/AuthContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { InactivityTimer } from '@/components/common/InactivityTimer';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <InactivityTimer>
          <AppNavigator />
        </InactivityTimer>
      </NavigationContainer>
    </AuthProvider>
  );
}