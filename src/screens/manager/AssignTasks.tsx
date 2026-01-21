import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Eye, ArrowLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { ManagerLayout } from '@/components/manager/ManagerLayout';
import { getAssignTasks, Resources, updateAssignTasks } from '@/services/manager';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

/* ---------------- TYPES ---------------- */
type Priority = 'low' | 'medium' | 'high';

type ApiTask = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  points: number;
};

type UiTask = ApiTask & {
  isExpanded: boolean;
  assignedResourceId?: number;
  isDirty: boolean;
  isPickerChanged: boolean;
};

/* ---------------- Fetch Tasks ---------------- */
const fetchAssignTasks = async (): Promise<{ tasks: ApiTask[]; resources: Resources[] }> => {
  const data = await getAssignTasks();
  return { tasks: data.Tasks, resources: data.myResources };
};

/* ---------------- SCREEN ---------------- */
  export const AssignTasks = () => {
    const [tasks, setTasks] = useState<UiTask[]>([]);
    const [resources, setResources] = useState<Resources[]>([]);
    const [originalTasks, setOriginalTasks] = useState<UiTask[]>([]);

  const loadData = async () => {
    const { tasks: apiTasks, resources: apiResources } = await fetchAssignTasks();

    setResources(apiResources);

    const uiTasks = apiTasks.map(task => ({
      ...task,
      isExpanded: false,
      isDirty: false,
      assignedResourceId: undefined,
      isPickerChanged: false,
    }));

    setTasks(uiTasks);
    setOriginalTasks(uiTasks);
  };

  /* ---------- Initial Fetch ---------- */
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );


  /* ---------- Derived Flags ---------- */
  const hasChanges = useMemo(
    () => tasks.some(t => t.isDirty),
    [tasks]
  );

  /* ---------- Helpers ---------- */
  const updateTask = (id: number, updater: (t: UiTask) => UiTask) => {
    setTasks(prev => prev.map(t => (t.id === id ? updater(t) : t)));
  };

  const undoAllChanges = () => {
    setTasks(
      originalTasks.map(t => ({
        ...t,
        isExpanded: false,
        isDirty: false,
        isPickerChanged: false,
      }))
    );
  };

  /* ---------- Submit Assigned Tasks ---------- */
  const submitAssignedTasks = async () => {
    try {
      const payload = tasks
        .filter(
          (t): t is UiTask & { assignedResourceId: number } =>
            t.isDirty && t.assignedResourceId !== undefined
        )
        .map(t => ({
          taskId: t.id,
          resourceId: t.assignedResourceId,
        }));

      if (!payload.length) {
        Alert.alert('Info', 'No tasks have been assigned yet.');
        return;
      }

      await updateAssignTasks(payload);
      await loadData();

      Alert.alert('Success', 'Tasks assigned successfully!');
    } catch (err: any) {
      console.error('Submit assigned tasks error:', err);
      Alert.alert('Error', err?.message || 'Failed to assign tasks');
    }
  };

  /* ---------------- EMPTY STATES ---------------- */
  if (tasks.length === 0 && resources.length === 0) {
    return (
      <ManagerLayout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg text-center">
            There are no tasks and resources to get assigned.
          </Text>
        </View>
      </ManagerLayout>
    );
  }

  if (tasks.length === 0) {
    return (
      <ManagerLayout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg text-center">
            There are no tasks to be assigned to the resources.
          </Text>
        </View>
      </ManagerLayout>
    );
  }

  if (resources.length === 0) {
    return (
      <ManagerLayout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg text-center">
            There are no resources to get assigned.
          </Text>
        </View>
      </ManagerLayout>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <ManagerLayout>
      <View className="flex-1 bg-gray-50 p-4">
        {hasChanges && (
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-200 rounded-lg"
              onPress={undoAllChanges}
            >
              <Text className="font-medium">Undo Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-4 py-2 bg-indigo-600 rounded-lg"
              onPress={submitAssignedTasks}
            >
              <Text className="text-white font-medium">Submit Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          {tasks.map(task => (
            <View
              key={task.id}
              className={`bg-white rounded-2xl p-4 mb-5 shadow ${
                task.isDirty ? 'border border-green-800 bg-green-100' : ''
              }`}
            >
              {/* SIMPLE VIEW */}
              {!task.isExpanded && (
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className={`text-base ${task.isDirty ? 'font-bold' : 'font-medium'}`}>
                      {task.title}
                    </Text>
                    <Text
                      className={`text-sm font-medium ${
                        task.priority === 'high'
                          ? 'text-red-600'
                          : task.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-green-600'
                      }`}
                    >
                      {task.priority} - {task.points} pts
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => updateTask(task.id, t => ({ ...t, isExpanded: true }))}
                  >
                    <Eye size={22} color="green" />
                  </TouchableOpacity>
                </View>
              )}

              {/* EXPANDED VIEW */}
              {task.isExpanded && (
                <View>
                  <TouchableOpacity
                    className="flex-row items-center mb-2"
                    onPress={() => updateTask(task.id, t => ({ ...t, isExpanded: false }))}
                  >
                    <ArrowLeft size={18} />
                    <Text className="ml-1 text-indigo-600 font-semibold">Go Back</Text>
                  </TouchableOpacity>

                  <Text className="text-xl mb-2 font-semibold">{task.title}</Text>
                  <Text className="text-gray-600 mb-2">
                    <Text className="font-semibold">Description:</Text> {task.description}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    <Text className="font-semibold">Priority:</Text> {task.priority}
                  </Text>
                  <Text className="text-gray-600 mb-2">
                    <Text className="font-semibold">Points:</Text> {task.points}
                  </Text>

                  <Text className="text-gray-700 font-semibold mt-2">Assign to</Text>
                  <Picker
                    selectedValue={task.assignedResourceId}
                    onValueChange={val =>
                      updateTask(task.id, t => ({
                        ...t,
                        assignedResourceId: val,
                        isPickerChanged: true,
                      }))
                    }
                    itemStyle={{ fontSize: 12, height: 100, color: '#000' }}
                  >
                    <Picker.Item label="Select Resource" value={undefined} />
                    {resources.map(r => (
                      <Picker.Item key={r.id} label={r.name} value={r.id} />
                    ))}
                  </Picker>

                  {task.isPickerChanged && (
                    <TouchableOpacity
                      className="mt-2 px-4 py-2 bg-indigo-600 rounded-lg"
                      onPress={() =>
                        updateTask(task.id, t => ({
                          ...t,
                          isDirty: true,
                          isPickerChanged: false,
                          isExpanded: false,
                        }))
                      }
                    >
                      <Text className="text-white font-medium text-center">
                        Submit
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </ManagerLayout>
  );
};
