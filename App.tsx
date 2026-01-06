import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/context/AuthContext';
import { AppNavigator } from '@/navigation/AppNavigator';
import { InactivityTimer } from '@/components/common/InactivityTimer';
import { navigationRef } from '@/navigation/RootNavigation';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <InactivityTimer>
          <AppNavigator />
        </InactivityTimer>
      </NavigationContainer>
    </AuthProvider>
  );
}