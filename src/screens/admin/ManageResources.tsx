import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { getUsers, getManagers, bulkAssignUsers } from '@/services/admin';

/* -------------------- TYPES -------------------- */
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

type ActionMode = 'assign' | 'unassign';

export const ManageResources = () => {
  /* -------------------- STATE -------------------- */
  const [resources, setResources] = useState<Resource[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>('assign');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* -------------------- DATA FETCH -------------------- */
  const fetchData = useCallback(async () => {
    try {
      // Fetching both in parallel for better performance
      const [usersData, mgrsData] = await Promise.all([getUsers(), getManagers()]);

      setResources(
        usersData.map((u: any) => ({
          id: Number(u.id),
          name: u.name,
          email: u.email,
          managerId: u.manager_id ? Number(u.manager_id) : null,
        }))
      );

      setManagers(
        mgrsData.map((m: any) => ({
          id: Number(m.id),
          name: m.name,
          email: m.email,
        }))
      );
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load users or managers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* -------------------- LOGIC -------------------- */
  const filteredResources = useMemo(() => {
    if (!selectedManager) return [];

    return resources.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase());

      const matchesMode =
        actionMode === 'assign'
          ? (r.managerId !== selectedManager && r.id != selectedManager) // Show users NOT assigned to this manager
          : r.managerId === selectedManager; // Show users ALREADY assigned to this manager

      return matchesSearch && matchesMode;
    });
  }, [resources, selectedManager, actionMode, search]);

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!selectedManager || selectedUsers.length === 0) return;

    try {
      const targetManagerId = actionMode === 'assign' ? selectedManager : null;
      
      await bulkAssignUsers({
        userIds: selectedUsers,
        managerId: targetManagerId,
      });

      // Optimistic Update: Update local state so UI reflects change immediately
      setResources((prev) =>
        prev.map((r) =>
          selectedUsers.includes(r.id) ? { ...r, managerId: targetManagerId } : r
        )
      );

      setSelectedUsers([]);
      Alert.alert('Success', 'Resources updated successfully');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Bulk operation failed');
    }
  };

  /* -------------------- UI RENDERERS -------------------- */
  const renderResourceItem = ({ item }: { item: Resource }) => (
    <View className="flex-row items-center bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100">
      <CheckBox
        value={selectedUsers.includes(item.id)}
        onValueChange={() => toggleUser(item.id)}
        color={selectedUsers.includes(item.id) ? '#4f46e5' : undefined}
      />
      <TouchableOpacity 
        onPress={() => toggleUser(item.id)} 
        className="ml-3 flex-1"
      >
        <Text className="font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-gray-500 text-xs">{item.email}</Text>
      </TouchableOpacity>
    </View>
  );

  const ListHeader = () => (
    <View className="mb-4">
      <Text className="text-2xl font-bold mb-4">Manage Resources</Text>

      <Text className="font-semibold mb-2">Select a Manager</Text>
      
      {/* Improved Picker Wrapper for Visibility */}
      <View 
        style={{ 
          backgroundColor: '#f3f4f6', // gray-100
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb', // gray-200
          overflow: 'hidden', // Ensures the picker stays inside the rounded corners
          marginBottom: 16
        }}
      >
        <Picker
          selectedValue={selectedManager}
          onValueChange={(val) => {
            // Ensure we are storing the ID as a number to match the data type
            const numericVal = val ? Number(val) : null;
            setSelectedManager(numericVal);
            setSelectedUsers([]);
          }}
          // On iOS, the picker often needs a specific style to show text
          itemStyle={{ fontSize: 16, height: 120, color: '#000000' }}
          mode="dropdown" // Force dropdown mode on Android
        >
          <Picker.Item label="-- Choose a Manager --" value={null} color="#a3aab6ff" />
          {managers.map((m) => (
            <Picker.Item 
              key={m.id.toString()} 
              label={`${m.name} (${m.email})`} 
              value={m.id} 
              color="#1f2937"           />
          ))}
        </Picker>
      </View>

      {selectedManager && (
        <>
          <Text className="font-semibold mb-2">Please select one of the following</Text>
          <View className="flex-row space-x-2 mb-4">
            {(['assign', 'unassign'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                onPress={() => {
                  setActionMode(mode);
                  setSelectedUsers([]);
                }}
                className={`flex-1 p-3 rounded-lg border ${
                  actionMode === mode ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`text-center font-medium ${actionMode === mode ? 'text-white' : 'text-gray-600'}`}>
                  {mode === 'assign' ? 'Assign' : 'Remove'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            className="bg-white p-3 rounded-xl border border-gray-200 mb-2"
            placeholder="Search by name or email"
            value={search}
            onChangeText={setSearch}
          />
        </>
      )}
    </View>
  );

  if (loading) {
    return (
      <AdminLayout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <FlatList
        data={filteredResources}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResourceItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View className="py-20 items-center">
            <Text className="text-gray-400">
              {!selectedManager ? "Please select a manager to see resources" : "No resources matching your criteria"}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />
        }
      />

      {/* Persistent Footer Button */}
      {selectedUsers.length > 0 && (
        <View className="p-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            className="bg-indigo-600 py-4 rounded-2xl shadow-md"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-bold text-lg">
              Confirm {actionMode === 'assign' ? 'Assignment' : 'Removal'} ({selectedUsers.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </AdminLayout>
  );
};