import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getAllResources, updateResources, UpdateResourcePayload } from '@/services/admin';

type Role = 'admin' | 'manager' | 'user';

export interface Resource {
  id: number;
  name: string;
  email: string;
  role: Role;
  manager_id: number;
}

const ALL_ROLES: Role[] = ['admin', 'manager', 'user'];

export const ManageResources = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [updatedRoles, setUpdatedRoles] = useState<Record<number, Role>>({});
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources();
        setResources(data);
      } catch {
        Alert.alert('Error', 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Role change handler
  const onRoleChange = (id: number, newRole: Role) => {
    setUpdatedRoles(prev => {
      const originalRole = resources.find(r => r.id === id)?.role;
      const copy = { ...prev };
      if (originalRole === newRole) delete copy[id];
      else copy[id] = newRole;
      return copy;
    });
    setOpenDropdownId(null);
  };

  // Remove / Undo handlers
  const onRemove = (id: number) => {
    setDeletedIds(prev => new Set(prev).add(id));
    setOpenDropdownId(null);
  };
  const onUndoRemove = (id: number) => {
    setDeletedIds(prev => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  };

  // Undo all changes
  const onUndoAllChanges = () => {
    setUpdatedRoles({});
    setDeletedIds(new Set());
    setOpenDropdownId(null);
  };

  const hasChanges = useMemo(
    () => Object.keys(updatedRoles).length > 0 || deletedIds.size > 0,
    [updatedRoles, deletedIds]
  );

  // Submit handler - single API payload
  const onSubmit = async () => {
    try {
      const payload: UpdateResourcePayload[] = resources
        .map(user => {
          const id = user.id;

          if (deletedIds.has(id)) {
            return { id, deleted: true } as UpdateResourcePayload;
          }

          const newRole = updatedRoles[id];
          if (newRole && newRole !== user.role) {
            return { id, role: newRole } as UpdateResourcePayload;
          }

          return null; // no change
        })
        .filter((r): r is UpdateResourcePayload => r !== null);

      await updateResources(payload);

      Alert.alert('Success', 'Changes updated successfully');

      setUpdatedRoles({});
      setDeletedIds(new Set());
      setOpenDropdownId(null);

      const data = await getAllResources();
      setResources(data);
    } catch {
      Alert.alert('Error', 'Failed to update changes');
    }
  };

  const renderItem = ({ item, index }: { item: Resource; index: number }) => {
    const isDeleted = deletedIds.has(item.id);
    const currentRole: Role = updatedRoles[item.id] ?? item.role;

    // Dropdown items: current role first, then remaining
    const dropdownItems = [
      { label: currentRole.charAt(0).toUpperCase() + currentRole.slice(1), value: currentRole },
      ...ALL_ROLES.filter(r => r !== currentRole).map(r => ({
        label: r.charAt(0).toUpperCase() + r.slice(1),
        value: r,
      })),
    ];

    return (
      <View
        className={`py-4 px-4 border-b border-gray-200 bg-white ${
          isDeleted ? 'opacity-40' : ''
        }`}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-semibold text-base">{item.name}</Text>
            <Text className="text-gray-500 text-sm">{item.email}</Text>
          </View>

          <View className="flex-row items-center gap-4" style={{ zIndex: 1000 - index }}>
            {!isDeleted && (
              <DropDownPicker
                open={openDropdownId === item.id}
                value={currentRole} // correct default
                items={dropdownItems}
                setOpen={() =>
                  setOpenDropdownId(prev => (prev === item.id ? null : item.id))
                }
                setValue={(val: Role | ((prev: Role) => Role)) =>
                  onRoleChange(item.id, typeof val === 'function' ? val(currentRole) : val)
                }
                containerStyle={{ width: 140 }}
                dropDownContainerStyle={{ zIndex: 1000, elevation: 20 }}
              />
            )}

            {isDeleted ? (
              <TouchableOpacity onPress={() => onUndoRemove(item.id)}>
                <Text className="text-gray-800 font-semibold">Undo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Text className="text-red-500 font-semibold">Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <AdminLayout>
      <View className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <>
            <FlatList
              data={resources}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              extraData={{ updatedRoles, deletedIds, openDropdownId }}
            />

            {/* Undo all changes button */}
            <TouchableOpacity
              onPress={onUndoAllChanges}
              disabled={!hasChanges}
              className={`mt-4 py-3 rounded-xl ${
                hasChanges ? 'bg-gray-500' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white text-center font-semibold">
                Undo All Changes
              </Text>
            </TouchableOpacity>

            {/* Update Changes button */}
            <TouchableOpacity
              disabled={!hasChanges}
              onPress={onSubmit}
              className={`mt-4 py-3 rounded-xl ${
                hasChanges ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white text-center font-semibold">
                Update Changes
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </AdminLayout>
  );
};
