import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
   darkMode: boolean;
   toggleDarkMode: (value: boolean) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType>({
   darkMode: false,
   toggleDarkMode: async () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
   const [darkMode, setDarkMode] = useState(false);

   useEffect(() => {
      // Load theme preference when the app starts
      const loadThemePreference = async () => {
         try {
            const storedDarkMode = await AsyncStorage.getItem('darkMode');
            if (storedDarkMode !== null) {
               setDarkMode(JSON.parse(storedDarkMode));
            }
         } catch (error) {
            console.error('Error loading theme preference:', error);
         }
      };

      loadThemePreference();
   }, []);

   const toggleDarkMode = async (value: boolean) => {
      setDarkMode(value);
      try {
         await AsyncStorage.setItem('darkMode', JSON.stringify(value));
      } catch (error) {
         console.error('Error saving theme preference:', error);
      }
   };

   return (
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
         {children}
      </ThemeContext.Provider>
   );
}; 