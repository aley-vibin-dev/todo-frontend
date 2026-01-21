import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Eye, Trash2, ArrowLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { ManagerLayout } from '@/components/manager/ManagerLayout';
import { getViewTasks, updateViewTasks } from '@/services/manager';
import { Alert } from 'react-native';

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
  isEditing: boolean;
  isDirty: boolean;
  isDeleted: boolean;
};

/* ---------------- Fetching tasks ---------------- */
const fetchTasks = async (): Promise<ApiTask[]> => {
  const data = await getViewTasks()
  return data;
};

/* ---------------- SCREEN ---------------- */
export const ViewTasks = () => {
  const [tasks, setTasks] = useState<UiTask[]>([]);
  const [originalTasks, setOriginalTasks] = useState<ApiTask[]>([]);

  /* ---------- Initial Fetch ---------- */
  useEffect(() => {
    (async () => {
      const data = await fetchTasks();
      setOriginalTasks(data);
      setTasks(
        data.map(task => ({
          ...task,
          isExpanded: false,
          isEditing: false,
          isDirty: false,
          isDeleted: false,
        }))
      );
    })();
  }, []);

  /* ---------- Derived Flags ---------- */
  const hasChanges = useMemo(
    () => tasks.some(t => t.isDirty || t.isDeleted),
    [tasks]
  );

  /* ---------- Helpers ---------- */
  const updateTask = (id: number, updater: (t: UiTask) => UiTask) => {
    setTasks(prev => prev.map(t => (t.id === id ? updater(t) : t)));
  };

  const undoAllChanges = () => {
    setTasks(
      originalTasks.map(task => ({
        ...task,
        isExpanded: false,
        isEditing: false,
        isDirty: false,
        isDeleted: false,
      }))
    );
  };

  const submitChanges = async () => {
    try {
      const updatedTasks = tasks
        .filter(t => t.isDirty && !t.isDeleted)
        .map(t => ({
          id: t.id,
          title: t.title.trim(),
          description: t.description.trim(),
          priority: t.priority,
          points: t.points,
        }));

      const deletedTasksIds = tasks
        .filter(t => t.isDeleted)
        .map(t => t.id);

      await updateViewTasks({
        tasks: updatedTasks,
        deletedTasksIds,
      });

      Alert.alert(
        'Success',
        `Updated ${updatedTasks.length} task(s), deleted ${deletedTasksIds.length} task(s)`
      );

      // 🔹 UI refresh fix: update state so screen shows latest data immediately
      setTasks(prev =>
        prev
          .filter(t => !t.isDeleted)  // remove deleted tasks
          .map(t => ({
            ...t,
            isDirty: false,           // reset dirty flags
            isEditing: false,
            isExpanded: false,
          }))
      );

      setOriginalTasks(prev =>
        prev
          .filter(t => !deletedTasksIds.includes(t.id))  // remove deleted tasks
          .map(t => ({
            ...t,
            ...updatedTasks.find(u => u.id === t.id) || t, // merge updated values
          }))
      );

    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to submit task changes');
    }
  };


  /* ---------------- UI ---------------- */
  return (
    <ManagerLayout>
      <View className="flex-1 bg-gray-50 p-4">
        {/* Header Actions */}
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
              onPress={submitChanges}
            >
              <Text className="text-white font-medium">Submit Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView>
          {tasks.map(task => {
            if (task.isDeleted) return null;

            return (
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
                      <Text
                        className={`text-base ${
                          task.isDirty ? 'font-bold' : 'font-medium'
                        }`}
                      >
                        {task.title}
                      </Text>
                      <Text   className={`text-sm font-medium ${
                        task.priority === 'high'
                          ? 'text-red-600'
                          : task.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-green-600'
                      }`}>
                        {task.priority} - {task.points} pts
                      </Text>
                    </View>

                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={() =>
                          updateTask(task.id, t => ({ ...t, isExpanded: true }))
                        }
                        className="mr-5"
                      >
                        <Eye size={22} color={"green"} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          updateTask(task.id, t => ({ ...t, isDeleted: true }))
                        }
                      >
                        <Trash2 size={22} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* EXPANDED VIEW */}
                {task.isExpanded && (
                  <View>
                    {/* GO BACK BUTTON */}
                    <TouchableOpacity
                      className="flex-row items-center mb-2"
                      onPress={() =>
                        updateTask(task.id, t => ({
                          ...t,
                          isExpanded: false,
                          isEditing: false,
                        }))
                      }
                    >
                      <ArrowLeft size={18} />
                      <Text className="ml-1 font-medium text-indigo-600 font-semibold">Go Back</Text>
                    </TouchableOpacity>

                    {/* VIEW MODE */}
                    {!task.isEditing ? (
                      <View>
                        <Text className="text-xl mb-2 font-semibold mb-1">{task.title}</Text>
                        <Text className="text-gray-600 mb-2"><Text className="font-semibold">Description:</Text> {task.description}</Text>
                        <Text className="text-gray-600 mb-2"><Text className="font-semibold">Priority:</Text> {task.priority}</Text>
                        <Text className="text-gray-600 mb-2"><Text className="font-semibold">Points:</Text> {task.points}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            updateTask(task.id, t => ({ ...t, isEditing: true }))
                          }
                          className="mt-2 px-4 py-2 bg-indigo-600 rounded-lg"
                        >
                          <Text className="text-white font-medium text-center">Edit</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      /* EDIT MODE */
                      <View>
                        <Text className="text-sm font-semibold font-gray-800 font-medium mb-1">Title</Text>
                        <TextInput
                          value={task.title}
                          onChangeText={text =>
                            updateTask(task.id, t => ({ ...t, title: text }))
                          }
                          className="border border-gray-300 rounded-md p-2 mb-3"
                        />

                        <Text className="text-sm font-semibold font-gray-800 font-medium mb-1">Description</Text>
                        <TextInput
                          value={task.description}
                          onChangeText={text =>
                            updateTask(task.id, t => ({ ...t, description: text }))
                          }
                          multiline
                          textAlignVertical="top"
                          className="border border-gray-300 rounded-md h-24 px-2 mb-3"
                        />

                    {/* Priority */}
                    <Text className="text-gray-700 font-semibold font-gray-800 font-medium mt-2">Priority</Text>
                    <Picker
                      selectedValue={task.priority}
                      onValueChange={val =>
                        updateTask(task.id, t => ({
                          ...t,
                          priority: val as Priority,
                          pendingEdit: true,
                        }))
                      }
                      itemStyle={{ fontSize: 12, height: 100, color: '#000' }}
                    >
                      <Picker.Item label="High" value="high" />
                      <Picker.Item label="Medium" value="medium" />
                      <Picker.Item label="Low" value="low" />
                    </Picker>

                    {/* Points */}
                    <Text className="text-gray-700 font-semibold font-gray-800 font-medium mt-2">Points</Text>
                    <Picker
                      selectedValue={task.points}
                      onValueChange={val =>
                        updateTask(task.id, t => ({
                          ...t,
                          points: val as number,
                          pendingEdit: true,
                        }))
                      }
                      itemStyle={{ fontSize: 12, height: 100, color: '#000' }}
                    >
                      {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map(val => (
                        <Picker.Item key={val} label={val.toString()} value={val} />
                      ))}
                    </Picker>
                        {/* PER-TASK SUBMIT */}
                        <TouchableOpacity
                          onPress={() =>
                            updateTask(task.id, t => ({
                              ...t,
                              isEditing: false,
                              isExpanded:false,
                              isDirty: true,
                            }))
                          }
                          className="mt-2 px-4 py-2 bg-indigo-600 rounded-lg"
                        >
                          <Text className="text-white font-medium text-center">
                            Submit
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ManagerLayout>
  );
}