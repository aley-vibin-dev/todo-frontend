import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardSection } from '@/components/common/DashboardSection';
import { ActionTable, TableAction } from '@/components/common/Table';
import { PendingResources, ResourceUpdate, getPendingResources, updateResourceStatus } from '@/services/admin';

export const ApproveResources = () => {
  const [resources, setResources] = useState<PendingResources[]>([]);
  const [loading, setLoading] = useState(true);

  const actions: TableAction[] = [
    { label: 'Approve as Manager', value: 'manager' },
    { label: 'Approve as User', value: 'user' },
    { label: 'Reject', value: 'reject' },
  ];

  // Fetch pending resources from backend
  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getPendingResources();
      setResources(data); // ✅ array of resources
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch pending resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Handle save from table
  const handleSaveChanges = async (updates: Record<number, TableAction>) => {
    try {
      const payload: ResourceUpdate[] = Object.entries(updates).map(([id, action]) => ({
        id: Number(id),
        status: action.value as 'manager' | 'user' | 'reject',
      }));

      await updateResourceStatus(payload);

      // Remove updated resources from table
      const updatedIds = payload.map(p => p.id);
      setResources(prev => prev.filter(r => !updatedIds.includes(r.id)));

      Alert.alert('Success', 'Resource statuses updated successfully');
    } catch (err: any) {
      console.error("DEBUG API ERROR:", err.response?.data || err.message);
      Alert.alert('Error', 'Failed to update resource statuses');
    }
  };

  return (
    <AdminLayout>
      <View className="flex-1 p-4">
        <DashboardSection title="Approve Resources">
          {loading && (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="mt-4 text-slate-500">Loading resources...</Text>
            </View>
          )}

          {!loading && resources.length === 0 && (
            <View className="py-12 items-center">
              <Text className="text-slate-400">No pending resources to approve</Text>
            </View>
          )}

          {!loading && resources.length > 0 && (
            <ActionTable<PendingResources>
              columns={[
                { key: 'name', label: 'Name', flex: 1.2 },
                { key: 'email', label: 'Email', flex: 1.8 },
              ]}
              data={resources}
              actions={actions}
              onSaveChanges={handleSaveChanges}
            />
          )}
        </DashboardSection>
      </View>
    </AdminLayout>
  );
};
