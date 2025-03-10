import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notifications
Notifications.setNotificationHandler({
   handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
   }),
});

export const requestNotificationPermissions = async () => {
   const { status } = await Notifications.requestPermissionsAsync();
   return status === 'granted';
};

export const checkNotificationsEnabled = async () => {
   try {
      const notificationsEnabled = await AsyncStorage.getItem('notifications');
      // Default to true if not set
      return notificationsEnabled === null ? true : JSON.parse(notificationsEnabled);
   } catch (error) {
      console.error('Error checking notification settings:', error);
      return false;
   }
};

export const scheduleNotification = async (title: string, body: string) => {
   const notificationsEnabled = await checkNotificationsEnabled();

   if (!notificationsEnabled) {
      return;
   }

   try {
      await Notifications.scheduleNotificationAsync({
         content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
         },
         trigger: null, // Show immediately
      });
   } catch (error) {
      console.error('Error scheduling notification:', error);
   }
};

export const showTaskAddedNotification = async (taskName: string) => {
   await scheduleNotification(
      'Task Added',
      `"${taskName}" has been added to your tasks.`
   );
};

export const showTaskDeletedNotification = async () => {
   await scheduleNotification(
      'Task Deleted',
      'A task has been removed from your list.'
   );
};

export const showAllTasksClearedNotification = async () => {
   await scheduleNotification(
      'All Tasks Cleared',
      'All tasks have been cleared from your list.'
   );
}; 