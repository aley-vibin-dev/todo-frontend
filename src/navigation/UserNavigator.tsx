import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserHome } from '@/screens/user/UserHome';
import { UserSettings } from '@/screens/user/UserSettings';

const Stack = createNativeStackNavigator();

export type UserStackParamList = {
  UserHome: undefined;
  UserSettings: undefined;
};
export const UserNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserHome" component={UserHome} />
      <Stack.Screen name="UserSettings" component={UserSettings} />

    </Stack.Navigator>
  );
};
