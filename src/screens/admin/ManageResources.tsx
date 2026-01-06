import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { getUsers, getManagers, bulkAssignUsers } from '@/services/admin';

interface Resource {
  id: number;
  name: string;
  email: string;
  managerId?: number | null;
}

interface Manager {
  id: number;
  name: string;
  email: string;
}

export const ManageResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const users = await getUsers();
        const mgrs = await getManagers();

        setResources(
          users.map(u => ({
            id: Number(u.id),
            name: u.name,
            email: u.email,
            managerId: u.manage_id !== null ? Number(u.manage_id) : null, // backend field is manage_id
          }))
        );

        setManagers(
          mgrs.map(m => ({
            id: Number(m.id),
            name: m.name,
            email: m.email,
          }))
        );
      } catch (err: any) {
        console.error('Failed to fetch resources or managers:', err);
        Alert.alert('Error', 'Failed to load users or managers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id)
        ? prev.filter(uid => uid !== id)
        : [...prev, id]
    );
  };

  const handleBulkAssign = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Select at least one user');
      return;
    }

    try {
      await bulkAssignUsers({
        userIds: selectedUsers,
        managerId: selectedManager, // null allowed for unassign
      });

      setResources(prev =>
        prev.map(user =>
          selectedUsers.includes(user.id)
            ? { ...user, managerId: selectedManager }
            : user
        )
      );

      setSelectedUsers([]);
      setSelectedManager(null);
      Alert.alert('Success', 'Assignment updated');
    } catch (err: any) {
      console.error('Bulk assignment failed:', err);
      Alert.alert('Error', 'Bulk assignment failed');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <ActivityIndicator size="large" />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold mb-4">Manage Resources</Text>

        {/* Bulk Controls */}
        <View className="bg-white p-4 rounded-xl shadow mb-6">
          <Text className="font-semibold mb-2">Bulk Action</Text>

          <Picker
            selectedValue={selectedManager}
            onValueChange={val => setSelectedManager(val !== null ? Number(val) : null)}
          >
            <Picker.Item label="Remove assignment" value={null} />
            {managers.map(m => (
              <Picker.Item key={m.id} label={m.name} value={m.id} />
            ))}
          </Picker>

          <TouchableOpacity
            className={`py-3 rounded-xl mt-4 ${selectedUsers.length > 0 ? 'bg-indigo-600' : 'bg-gray-300'}`}
            onPress={handleBulkAssign}
            disabled={selectedUsers.length === 0} // enable as soon as any user is selected
          >
            <Text className="text-white text-center font-bold">
              Apply to {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Users List */}
        {resources.map(user => (
          <View
            key={user.id}
            className="flex-row items-center bg-white p-4 mb-3 rounded-xl shadow"
          >
            <CheckBox
              value={selectedUsers.includes(user.id)}
              onValueChange={() => toggleUser(user.id)}
            />

            <View className="ml-3 flex-1">
              <Text className="font-semibold">{user.name}</Text>
              <Text className="text-gray-500">{user.email}</Text>
              <Text className="text-sm text-indigo-600">
                Manager: {managers.find(m => m.id === user.managerId)?.name || 'None'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </AdminLayout>
  );
};
