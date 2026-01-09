import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminNavigator } from './AdminNavigator';
import { LoginScreen } from '@/screens/generic/LoginScreen';
import { SignupScreen } from '@/screens/generic/SignupScreen';
import { LandingPage } from '@/screens/generic/LandingPage';
import { RoleErrorScreen } from '@/screens/generic/RoleErrorScreen';
import { UserNavigator } from './UserNavigator';
import { ManagerNavigator } from './ManagerNavigator';

export type RootStackParamList = {
  Landing: undefined;
  Login: { sessionout_error?: boolean };
  Signup: undefined;
  Admin: undefined;
  User: undefined;
  Manager: undefined;
  RoleError: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Admin" component={AdminNavigator} />
        <Stack.Screen name="User" component={UserNavigator} />
        <Stack.Screen name="Manager" component={ManagerNavigator} />
        <Stack.Screen name="RoleError" component={RoleErrorScreen} />
      </Stack.Navigator>
  );
};
