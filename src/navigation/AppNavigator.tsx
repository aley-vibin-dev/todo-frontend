import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import {LoginScreen} from '@/screens/generic/LoginScreen';
import {SignupScreen} from '@/screens/generic/SignupScreen';
import {UserNavigator} from './UserNavigator';
import {AdminNavigator, AdminStackParamList} from './AdminNavigator';
import {ManagerNavigator} from './ManagerNavigator';
import {LandingPage} from '@/screens/generic/LandingPage';
import {RoleErrorScreen} from '@/screens/generic/RoleErrorScreen';

export type RootStackParamList = {
  Login: { sessionout_error?: boolean };
  Signup: undefined;
  User: undefined;
  Manager: undefined;
  Admin: { screen?: keyof AdminStackParamList } | undefined; // <-- allow nested screens
  Landing: undefined;
  ForgotPassword: undefined;
  RoleError: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { loading } = useAuth();

  // Show a loader while checking AsyncStorage for an existing token
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="User" component={UserNavigator} />
      <Stack.Screen name="Manager" component={ManagerNavigator} />
      <Stack.Screen name="Admin" component={AdminNavigator} />
      <Stack.Screen name="RoleError" component={RoleErrorScreen} />
    </Stack.Navigator>
  );
};