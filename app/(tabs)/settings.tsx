import { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Switch, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { requestNotificationPermissions } from '../services/NotificationService';

export default function Settings() {
   const { darkMode, toggleDarkMode } = useTheme();
   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
   const [taskCount, setTaskCount] = useState(0);

   useEffect(() => {
      // Load user preferences
      const loadPreferences = async () => {
         try {
            const storedNotifications = await AsyncStorage.getItem('notifications');

            if (storedNotifications !== null) {
               setNotificationsEnabled(JSON.parse(storedNotifications));
            }

            // Get task count for stats
            const storedTasks = await AsyncStorage.getItem('tasks');
            if (storedTasks !== null) {
               setTaskCount(JSON.parse(storedTasks).length);
            }
         } catch (error) {
            console.error('Error loading preferences:', error);
         }
      };

      loadPreferences();
   }, []);

   const handleToggleDarkMode = async (value: boolean) => {
      await toggleDarkMode(value);
   };

   const handleToggleNotifications = async (value: boolean) => {
      setNotificationsEnabled(value);
      try {
         await AsyncStorage.setItem('notifications', JSON.stringify(value));

         // If enabling notifications, request permissions
         if (value) {
            await requestNotificationPermissions();
         }
      } catch (error) {
         console.error('Error saving notification preference:', error);
      }
   };

   const handleClearAllData = () => {
      Alert.alert(
         "Clear All Data",
         "Are you sure you want to clear all tasks and settings? This cannot be undone.",
         [
            {
               text: "Cancel",
               style: "cancel"
            },
            {
               text: "Clear All",
               onPress: async () => {
                  try {
                     await AsyncStorage.clear();
                     setTaskCount(0);
                     setNotificationsEnabled(true);
                     Alert.alert("Success", "All data has been cleared.");
                  } catch (error) {
                     console.error('Error clearing data:', error);
                  }
               },
               style: "destructive"
            }
         ]
      );
   };

   return (
      <SafeAreaView className={darkMode ? "flex-1 bg-gray-900" : "flex-1 bg-white"}>
         <View className={darkMode ? "flex-1 bg-gray-900 px-4" : "flex-1 bg-white px-4"}>
            <Text className={darkMode ? "text-2xl font-bold mt-6 mb-6 text-white" : "text-2xl font-bold mt-6 mb-6"}>Settings</Text>

            {/* Appearance Section */}
            <View className="mb-6">
               <Text className={darkMode ? "text-lg font-semibold mb-2 text-gray-300" : "text-lg font-semibold mb-2 text-gray-800"}>Appearance</Text>
               <View className={darkMode ? "bg-gray-800 rounded-lg p-4" : "bg-gray-100 rounded-lg p-4"}>
                  <View className="flex-row justify-between items-center">
                     <View className="flex-row items-center">
                        <Ionicons name="moon-outline" size={22} color={darkMode ? "#D1D5DB" : "#4B5563"} />
                        <Text className={darkMode ? "ml-2 text-gray-300" : "ml-2 text-gray-800"}>Dark Mode</Text>
                     </View>
                     <Switch
                        value={darkMode}
                        onValueChange={handleToggleDarkMode}
                        trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                     />
                  </View>
               </View>
            </View>

            {/* Notifications Section */}
            <View className="mb-6">
               <Text className={darkMode ? "text-lg font-semibold mb-2 text-gray-300" : "text-lg font-semibold mb-2 text-gray-800"}>Notifications</Text>
               <View className={darkMode ? "bg-gray-800 rounded-lg p-4" : "bg-gray-100 rounded-lg p-4"}>
                  <View className="flex-row justify-between items-center">
                     <View className="flex-row items-center">
                        <Ionicons name="notifications-outline" size={22} color={darkMode ? "#D1D5DB" : "#4B5563"} />
                        <Text className={darkMode ? "ml-2 text-gray-300" : "ml-2 text-gray-800"}>Enable Notifications</Text>
                     </View>
                     <Switch
                        value={notificationsEnabled}
                        onValueChange={handleToggleNotifications}
                        trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                     />
                  </View>
               </View>
            </View>

            {/* Stats Section */}
            <View className="mb-6">
               <Text className={darkMode ? "text-lg font-semibold mb-2 text-gray-300" : "text-lg font-semibold mb-2 text-gray-800"}>Stats</Text>
               <View className={darkMode ? "bg-gray-800 rounded-lg p-4" : "bg-gray-100 rounded-lg p-4"}>
                  <View className="flex-row justify-between items-center">
                     <View className="flex-row items-center">
                        <Ionicons name="stats-chart-outline" size={22} color={darkMode ? "#D1D5DB" : "#4B5563"} />
                        <Text className={darkMode ? "ml-2 text-gray-300" : "ml-2 text-gray-800"}>Total Tasks</Text>
                     </View>
                     <Text className={darkMode ? "font-semibold text-gray-300" : "font-semibold"}>{taskCount}</Text>
                  </View>
               </View>
            </View>

            {/* Data Management Section */}
            <View className="mb-6">
               <Text className={darkMode ? "text-lg font-semibold mb-2 text-gray-300" : "text-lg font-semibold mb-2 text-gray-800"}>Data Management</Text>
               <TouchableOpacity
                  className={darkMode ? "bg-gray-800 rounded-lg p-4" : "bg-gray-100 rounded-lg p-4"}
                  onPress={handleClearAllData}
               >
                  <View className="flex-row items-center">
                     <Ionicons name="trash-outline" size={22} color={darkMode ? "#EF4444" : "#EF4444"} />
                     <Text className={darkMode ? "ml-2 font-medium text-gray-300" : "ml-2 font-medium text-red-600"}>Clear All Data</Text>
                  </View>
               </TouchableOpacity>
            </View>

            {/* About Section */}
            <View className="mt-auto mb-6">
               <View className="items-center">
                  <Text className={darkMode ? "text-gray-500" : "text-gray-500"}>Todo App v1.0.0</Text>
               </View>
            </View>
         </View>
      </SafeAreaView>
   );
}