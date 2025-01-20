import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Homescreen from './components/Homescreen';
import Loginscreen from './components/Loginscreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check login status on app load
    const checkLoginStatus = async () => {
      const storedStatus = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(storedStatus === 'true');
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = async () => {
    // Save login status and update state
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    // Remove login status and update state
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (isLoading) {
    // Show a blank screen while loading
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }} // Hide the header for the Home screen
          >
            {(props) => <Homescreen {...props} onLogout={handleLogout} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }} // Hide the header for the Login screen
          >
            {(props) => <Loginscreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
