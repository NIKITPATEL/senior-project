import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useUser } from './UserContext';
import { path } from './path';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { username, userId, setUser } = useUser(); // Access context values using useUser hook
  

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          try {
            // Retrieve JWT token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
            if (!token) {
              // Handle case where token is missing
              return;
            }
      
            // Make authenticated API request to fetch user information path+"/trendsync/addcustomer"
            const response = await axios.get(path+'/user', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            // Handle response and extract username
            const userData = response.data;
            setUser(userData); // Set user information in context
      
            setTimeout(() => {
              navigation.replace('main');
            }, 3000); // Navigate to the main screen after 3 seconds
          } catch (error) {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
              // Handle 403 or 401 error
              console.error('Error fetching user information:', error);
              navigation.replace('login'); // Navigate to the login screen
            } else {
              // Handle other errors
              console.error('Error fetching user information:', error);
            }
          }
        } else {
          // Handle case where token is missing
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
      
    };

    // Call the function to check for the token
    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp!</Text>
      <Text>This is a welcome message...</Text>
      <Text>Hello, {username}</Text>
      <Text>{userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default WelcomeScreen;
