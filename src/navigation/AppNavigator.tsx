import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {LoginScreen} from '@/screens/LoginScreen';
import {SignupScreen} from '@/screens/SignupScreen';
import {UserDashboard} from '@/screens/UserDashboard';
import {ManagerDashboard} from '@/screens/ManagerDashboard';
import {AdminDashboard} from '@/screens/AdminDashboard';
import {LandingPage} from '@/screens/LandingPage';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  User: undefined;
  Manager: undefined;
  Admin: undefined;
  Landing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="User" component={UserDashboard} />
        <Stack.Screen name="Manager" component={ManagerDashboard} />
        <Stack.Screen name="Admin" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
