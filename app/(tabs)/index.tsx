import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
   requestNotificationPermissions,
   showTaskAddedNotification,
   showTaskDeletedNotification,
   showAllTasksClearedNotification
} from '../services/NotificationService';

export default function Home() {
   const { darkMode } = useTheme();
   const [task, setTask] = useState('');
   const [tasks, setTasks] = useState<string[]>([]);

   useEffect(() => {
      // Request notification permissions when the app loads
      const setupNotifications = async () => {
         await requestNotificationPermissions();
      };

      setupNotifications();

      const loadTasks = async () => {
         try {
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks !== null) {
               setTasks(JSON.parse(storedTasks));
            }
         } catch (error) {
            console.error('Error loading tasks:', error);
         }
      };

      loadTasks();
   }, []);

   useEffect(() => {
      const saveTasks = async () => {
         try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
         } catch (error) {
            console.error('Error saving tasks:', error);
         }
      };

      saveTasks();
   }, [tasks]);

   const handleAddTask = async () => {
      if (task.trim()) {
         setTasks([...tasks, task]);
         setTask('');

         // Show notification when task is added
         await showTaskAddedNotification(task);
      }
   };

   const handleDeleteTask = async (index: number) => {
      const deletedTask = tasks[index];
      setTasks(tasks.filter((_, i) => i !== index));

      // Show notification when task is deleted
      await showTaskDeletedNotification();
   };

   const handleClearAllTasks = async () => {
      setTasks([]);

      // Show notification when all tasks are cleared
      await showAllTasksClearedNotification();
   };

   return (
      <SafeAreaView className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-white"}>
         <View className={darkMode ? "flex-1 bg-gray-900 px-4" : "flex-1 bg-white px-4"}>
            <Text className={darkMode ? "text-2xl font-bold mt-6 mb-6 text-white" : "text-2xl font-bold mt-6 mb-6"}>
               My Tasks
            </Text>

            {/* Add Task Input */}
            <View className="mb-4">
               <View className="flex-row items-center gap-2">
                  <TextInput
                     value={task}
                     onChangeText={setTask}
                     placeholder="Add a new task..."
                     placeholderTextColor={darkMode ? "#9CA3AF" : "#9CA3AF"}
                     className={darkMode
                        ? "flex-1 bg-gray-800 text-white p-4 rounded-lg"
                        : "flex-1 bg-gray-100 p-4 rounded-lg"
                     }
                  />
                  <TouchableOpacity
                     onPress={handleAddTask}
                     className="bg-indigo-600 p-3 rounded-lg"
                     activeOpacity={0.7}
                  >
                     <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
               </View>
            </View>

            {/* Clear All Tasks */}
            {tasks.length > 2 && (
               <View className="flex-row items-center justify-end gap-3 mb-4">
                  <TouchableOpacity
                     onPress={handleClearAllTasks}
                     className="bg-red-500 p-2 px-4 rounded-lg flex-row items-center gap-2"
                     activeOpacity={0.7}
                  >
                     <Ionicons name="trash-outline" size={18} color="white" />
                     <Text className="text-white font-medium">Clear All</Text>
                  </TouchableOpacity>
               </View>
            )}

            {/* Task List - Now outside the input section */}
            <ScrollView
               className="flex-1"
               showsVerticalScrollIndicator={false}
               contentContainerClassName="pb-6"
            >
               {tasks.length === 0 ? (
                  <View className="items-center justify-center py-10">
                     <Ionicons name="list-outline" size={64} color={darkMode ? "#4B5563" : "#D1D5DB"} />
                     <Text className={darkMode ? "text-gray-500 text-lg mt-4" : "text-gray-400 text-lg mt-4"}>
                        No tasks yet. Add one!
                     </Text>
                  </View>
               ) : (
                  <View className="space-y-3 gap-4">
                     {tasks.map((task, index) => (
                        <View
                           key={index}
                           className={darkMode
                              ? "flex-row items-center bg-gray-800 p-4 rounded-lg shadow-xs border border-gray-700"
                              : "flex-row items-center bg-gray-50 p-4 rounded-lg shadow-xs border border-gray-200"
                           }
                        >
                           <View className="flex-1">
                              <Text className={darkMode ? "text-white" : "text-gray-800"}>
                                 {task}
                              </Text>
                           </View>
                           <TouchableOpacity
                              onPress={() => handleDeleteTask(index)}
                              className="p-2"
                           >
                              <Ionicons name="trash-outline" size={20} color={darkMode ? "#F87171" : "#EF4444"} />
                           </TouchableOpacity>
                        </View>
                     ))}
                  </View>
               )}
            </ScrollView>
         </View>
      </SafeAreaView>
   );
}