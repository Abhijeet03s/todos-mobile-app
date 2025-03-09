import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
   const [task, setTask] = useState('');
   const [tasks, setTasks] = useState<string[]>([]);

   useEffect(() => {
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

   const handleAddTask = () => {
      if (task.trim()) {
         setTasks([...tasks, task]);
         setTask('');
      }
   };

   const handleDeleteTask = (index: number) => {
      setTasks(tasks.filter((_, i) => i !== index));
   };

   const handleClearAllTasks = () => {
      setTasks([]);
   };

   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="flex-1 bg-white">
            {/* Header */}
            <View className="py-4 bg-indigo-600">
               <Text className="text-3xl font-bold text-white text-center">My Tasks</Text>
            </View>

            {/* Main Content */}
            <View className="flex-1 px-4 py-6">
               {/* Input Area */}
               <View className="flex-row items-center gap-3 mb-6">
                  <TextInput
                     placeholder="Add your task"
                     placeholderTextColor="#9CA3AF"
                     className="flex-1 border border-gray-300 rounded-lg p-4 bg-white text-gray-800 text-base"
                     value={task}
                     onChangeText={setTask}
                  />
                  <TouchableOpacity
                     onPress={handleAddTask}
                     className="bg-indigo-600 p-4 rounded-lg"
                     activeOpacity={0.7}
                  >
                     <Ionicons name="add" size={24} color="white" />
                  </TouchableOpacity>
               </View>

               {/* Clear All Tasks */}
               <View className="flex-row items-center justify-end gap-3 mb-6">
                  <TouchableOpacity
                     onPress={handleClearAllTasks}
                     className="bg-red-500 p-2 px-4 rounded-lg flex-row items-center gap-2"
                     activeOpacity={0.7}
                  >
                     <Ionicons name="trash-outline" size={18} color="white" />
                     <Text className="text-white font-medium">Clear All</Text>
                  </TouchableOpacity>
               </View>

               {/* Task List */}
               <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="pb-6"
               >
                  {tasks.length === 0 ? (
                     <View className="items-center justify-center py-10">
                        <Ionicons name="list-outline" size={64} color="#D1D5DB" />
                        <Text className="text-gray-400 text-lg mt-4">No tasks yet. Add one!</Text>
                     </View>
                  ) : (
                     <View className="space-y-3 gap-4">
                        {tasks.map((task, index) => (
                           <View
                              key={index}
                              className="flex-row items-center bg-gray-50 p-4 rounded-lg shadow-xs border border-gray-200"
                           >
                              <View className="flex-1">
                                 <Text className="text-base text-gray-800">{task}</Text>
                              </View>
                              <TouchableOpacity
                                 onPress={() => handleDeleteTask(index)}
                                 className="bg-red-500 p-2 rounded-full"
                                 activeOpacity={0.7}
                              >
                                 <Ionicons name="trash-outline" size={18} color="white" />
                              </TouchableOpacity>
                           </View>
                        ))}
                     </View>
                  )}
               </ScrollView>
            </View>
         </View>
      </SafeAreaView>
   );
}