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
  const { username, userId,userEmail, setUser } = useUser(); 
  

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
            setUser(userData); 
      
            setTimeout(() => {
              navigation.replace('main');
            }, 5000); 


          } catch (error) {
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
              // Handle 403 or 401 error
             
              navigation.replace('login'); 
            } else {
              
              //console.error('Error fetching user information:', error);
            }
          }
        } else {
          // Handle case where token is missing
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
      
    };

    
    checkToken();
  }, [navigation]);

  return (

    
      <View style={styles.container} >
        
        
        <Video
          source={require('../assets/AppLogo.mp4')} 
          style={{ width: 400, height: 400 }} 
          controls={false} 
          //resizeMode="cover" 
          shouldPlay={true} 
          
        />
        
        
        
        
        <Text style={styles.title}>Welcome, {username}</Text>
        
        
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
    fontFamily: 'Noteworthy', 
 
  },


});

export default WelcomeScreen;