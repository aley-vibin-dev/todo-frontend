import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManagerHome } from '@/screens/manager/ManagerHome';
import { ResourceProgress } from '@/screens/manager/ResourceProgress';
import { ManagerSettings } from '@/screens/manager/ManagerSettings';

const Stack = createNativeStackNavigator();

export type ManagerStackParamList = {
  ManagerHome: undefined;
  ResourceProgress: undefined;
  ManagerSettings: undefined;
};
export const ManagerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerHome" component={ManagerHome} />
      <Stack.Screen name="ResourceProgress" component={ResourceProgress} />
      <Stack.Screen name="ManagerSettings" component={ManagerSettings} />

    </Stack.Navigator>
  );
};
