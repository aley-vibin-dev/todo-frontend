import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Eye, ArrowLeft, Send } from 'lucide-react-native';
import { UserLayout } from '@/components/user/UserLayout';
import { getAssignedTasks, submitAssignedTask } from '@/services/user';

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
  isSubmitting: boolean;
};

/* ---------------- Fetch ---------------- */
const fetchTasks = async (): Promise<ApiTask[]> => {
  const data = await getAssignedTasks();
  return data;
};

/* ---------------- SCREEN ---------------- */
export const AssignedTasks = () => {
  const [tasks, setTasks] = useState<UiTask[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = async () => {
    setRefreshing(true);
    const data = await fetchTasks();
    setTasks(
      data.map(task => ({
        ...task,
        isExpanded: false,
        isSubmitting: false,
      }))
    );
    setRefreshing(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  /* ---------- Helpers ---------- */
  const updateTask = (id: number, updater: (t: UiTask) => UiTask) => {
    setTasks(prev => prev.map(t => (t.id === id ? updater(t) : t)));
  };

  const priorityBadge = (priority: Priority) => {
    const map = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };

    return (
      <Text className={`px-2 py-1 rounded-full text-xs font-medium ${map[priority]}`}>
        {priority.toUpperCase()}
      </Text>
    );
  };

  const confirmSubmit = (task: UiTask) => {
    Alert.alert(
      'Confirm Submission',
      `Are you sure you want to submit "${task.title}" task?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            updateTask(task.id, t => ({ ...t, isSubmitting: true }));

            try {
              await submitAssignedTask({ id: task.id });

              Alert.alert('Success', 'Task submitted successfully');
              await loadTasks(); // 🔄 refresh list
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Submission failed');
              updateTask(task.id, t => ({ ...t, isSubmitting: false }));
            }
          },
        },
      ]
    );
  };

  /* ---------------- UI ---------------- */

   if (tasks.length === 0 && !refreshing) {
      return (
        <UserLayout>
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg text-center">
              Wohoo! No tasks assigned today 😊
            </Text>
          </View>
        </UserLayout>
      );
    }
  return (
    <UserLayout>
      <View className="flex-1 bg-gray-50 p-4">
        {refreshing && <ActivityIndicator className="mb-4" />}

        <ScrollView>
          {tasks.map(task => (
            <View
              key={task.id}
              className="bg-white rounded-2xl p-4 mb-5 shadow"
            >
              {/* COLLAPSED */}
              {!task.isExpanded && (
                <View className="flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center mb-1">
                      <Text className="text-base font-medium mr-2">
                        {task.title}
                      </Text>
                      {priorityBadge(task.priority)}
                    </View>

                    <Text className="text-sm text-gray-600">
                      {task.points} pts
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      updateTask(task.id, t => ({ ...t, isExpanded: true }))
                    }
                  >
                    <Eye size={22} color="green" />
                  </TouchableOpacity>
                </View>
              )}

              {/* EXPANDED */}
              {task.isExpanded && (
                <View>
                  <Text className="text-xl font-semibold mb-2">
                    {task.title}
                  </Text>

                  <Text className="text-gray-600 mb-2">
                    <Text className="font-semibold">Description:</Text>{' '}
                    {task.description}
                  </Text>

                  <Text className="text-gray-600 mb-2">
                    <Text className="font-semibold">Priority:</Text>{' '}
                    {task.priority}
                  </Text>

                  <Text className="text-gray-600 mb-4">
                    <Text className="font-semibold">Points:</Text>{' '}
                    {task.points}
                  </Text>

                  <View className="flex-row justify-between mt-4">
                    <TouchableOpacity
                      onPress={() =>
                        updateTask(task.id, t => ({ ...t, isExpanded: false }))
                      }
                      className="px-4 py-2 bg-gray-200 rounded-lg flex-row items-center"
                      disabled={task.isSubmitting}
                    >
                      <ArrowLeft size={16} />
                      <Text className="ml-2 font-medium">Go Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => confirmSubmit(task)}
                      disabled={task.isSubmitting}
                      className={`px-4 py-2 rounded-lg flex-row items-center ${
                        task.isSubmitting ? 'bg-gray-400' : 'bg-indigo-600'
                      }`}
                    >
                      {task.isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <>
                          <Send size={16} color="#fff" />
                          <Text className="ml-2 text-white font-medium">
                            Submit
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </UserLayout>
  );
};
