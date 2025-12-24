import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {LoginScreen} from '@/screens/generic/LoginScreen';
import {SignupScreen} from '@/screens/generic/SignupScreen';
import {UserNavigator} from './UserNavigator';
import {AdminNavigator} from './AdminNavigator';
import {ManagerNavigator} from './ManagerNavigator';
import {LandingPage} from '@/screens/generic/LandingPage';
import {RoleErrorScreen} from '@/screens/generic/RoleErrorScreen';

export type RootStackParamList = {
  Login: { sessionout_error?: boolean };
  Signup: undefined;
  User: undefined;
  Manager: undefined;
  Admin: undefined;
  Landing: undefined;
  ForgotPassword: undefined;
  RoleError: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="User" component={UserNavigator} />
        <Stack.Screen name="Manager" component={ManagerNavigator} />
        <Stack.Screen name="Admin" component={AdminNavigator} />
        <Stack.Screen name="RoleError" component={RoleErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
