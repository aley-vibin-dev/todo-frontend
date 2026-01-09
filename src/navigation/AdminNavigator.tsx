import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHome } from '@/screens/admin/AdminHome';
import { AssignResources } from '@/screens/admin/AssignResources';
import { ApproveResources } from '@/screens/admin/ApproveResources';
import { ManageResources } from '@/screens/admin/ManageResources';
import { ResourceProgress } from '@/screens/admin/ResourceProgress';
import {AdminSettings} from '@/screens/admin/AdminSettings';

export type AdminStackParamList = {
  AdminHome: undefined;
  AssignResources: undefined;
  ApproveResources: undefined;
  ManageResources: undefined;
  ResourceProgress: undefined;
  AdminSettings: undefined;
};

const Stack = createNativeStackNavigator();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="AssignResources" component={AssignResources} />
      <Stack.Screen name="ApproveResources" component={ApproveResources} />
      <Stack.Screen name="ManageResources" component={ManageResources} />
      <Stack.Screen name="ResourceProgress" component={ResourceProgress} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
    </Stack.Navigator>
  );
};