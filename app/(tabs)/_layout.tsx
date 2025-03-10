import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function TabLayout() {
   const { darkMode } = useTheme();

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: darkMode ? '#10B981' : '#4F46E5',
            tabBarInactiveTintColor: darkMode ? '#6B7280' : '#9CA3AF',
            tabBarStyle: {
               backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
               borderTopColor: darkMode ? '#374151' : '#E5E7EB',
            },
            headerStyle: {
               backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
            },
            headerTintColor: darkMode ? '#F9FAFB' : '#111827',
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: 'Tasks',
               tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
            }}
         />
         <Tabs.Screen
            name="settings"
            options={{
               title: 'Settings',
               tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
            }}
         />
      </Tabs>
   );
}
