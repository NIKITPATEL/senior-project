import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,SafeAreaView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
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
            }, 5000); // Navigate to the main screen after 3 seconds


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

    
      <View style={styles.container} >
        {/* Video component */}
        
        <Video
          source={require('../assets/AppLogo.mp4')} // Replace 'your-video.mp4' with the path to your MP4 video file
          style={{ width: 400, height: 400 }} // Set the desired dimensions for the video
          controls={false} // Show playback controls
          //resizeMode="cover" // Adjust video size to cover its container
          shouldPlay={true} // Start playing the video automatically
          
        />
        
        
        
        
        <Text style={styles.title}>Welcome, {username}</Text>
        
        <Text tyle={styles.title}>{userId}</Text>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'white',
    fontFamily: 'Noteworthy', // Specify the font family name
 
  },


});

export default WelcomeScreen;