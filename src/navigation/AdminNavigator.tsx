import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHome } from '@/screens/admin/AdminHome';
import { ManageResources } from '@/screens/admin/ManageResources';
import { DeleteResource } from '@/screens/admin/DeleteResource';
import { ResourceProgress } from '@/screens/admin/ResourceProgress';
import { AdminSettings } from '@/screens/admin/AdminSettings';
import { ApproveResources } from '@/screens/admin/ApproveResource'

const Stack = createNativeStackNavigator();

export type AdminStackParamList = {
  AdminHome: undefined;
  ManageResources: undefined;
  DeleteResource: undefined;
  ResourceProgress: undefined;
  AdminSettings: undefined;
  ApproveResources: undefined;
};
export const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName = "AdminHome">
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="ManageResources" component={ManageResources} />
      <Stack.Screen name="DeleteResource" component={DeleteResource} />
      <Stack.Screen name="ResourceProgress" component={ResourceProgress} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
      <Stack.Screen name="ApproveResources" component={ApproveResources}/>
    </Stack.Navigator>
  );
};
