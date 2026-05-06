import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/ThemeContext'; // ✅ correct path
import StackNavigator from './navigation/StackNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        setUserToken(token);
      } catch (error) {
        console.log('Error reading token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (isLoading) return null;

  return (
    <ThemeProvider>
      <StackNavigator userToken={userToken} />
    </ThemeProvider>
  );
}