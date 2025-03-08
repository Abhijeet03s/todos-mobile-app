import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
   return (
      <SafeAreaView style={{ flex: 1 }} edges={['right', 'left']}>
         <Tabs
            screenOptions={{
               tabBarActiveTintColor: 'blue',
               headerShown: false,
            }}>
            <Tabs.Screen
               name="index"
               options={{
                  title: 'Home',
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
               }}
            />
            <Tabs.Screen
               name="settings"
               options={{
                  title: 'Settings',
                  tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
               }}
            />
         </Tabs>
      </SafeAreaView>
   );
}
