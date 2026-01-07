import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  ActivityIndicator, 
  RefreshControl, 
  ScrollView 
} from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardSection } from '@/components/common/DashboardSection';
import { ActionTable, TableAction } from '@/components/common/Table';
import { 
  PendingResources, 
  ResourceUpdate, 
  getPendingResources, 
  updateResourceStatus 
} from '@/services/admin';

export const ApproveResources = () => {
  const [resources, setResources] = useState<PendingResources[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const actions: TableAction[] = [
    { label: 'Approve as Manager', value: 'manager' },
    { label: 'Approve as User', value: 'user' },
    { label: 'Reject', value: 'reject' },
  ];

  const fetchResources = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const data = await getPendingResources();
      setResources(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch pending resources');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResources(true);
  };

  const handleSaveChanges = async (updates: Record<number, TableAction>) => {
    if (Object.keys(updates).length === 0) return;

    try {
      const payload: ResourceUpdate[] = Object.entries(updates).map(([id, action]) => ({
        id: Number(id),
        status: action.value as 'manager' | 'user' | 'reject',
      }));

      await updateResourceStatus(payload);

      // Remove updated resources from the list
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
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <DashboardSection title="Approve Resources">
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="mt-4 text-slate-500 font-medium">
                Loading requests...
              </Text>
            </View>
          ) : resources.length === 0 ? (
            <View className="py-12 items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100">
              <Text className="text-slate-400 text-lg">✨ All caught up!</Text>
              <Text className="text-slate-400 text-sm mt-1">
                No pending resources to approve
              </Text>
            </View>
          ) : (
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
      </ScrollView>
    </AdminLayout>
  );
};
