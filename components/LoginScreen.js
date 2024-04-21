import React,{useState} from "react";
import { View, TextInput, Button, Alert,StyleSheet,Text } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { path } from "./path";

import axios from 'axios';

const LoginScreen = () => {
    const navigation = useNavigation();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    
    try {
      // Your login logic here
      //Alert.alert('Checking');

      const response = await axios.post(path+'/login', { email, password });
        const token = response.data.token;

        // Save token to AsyncStorage
        await AsyncStorage.setItem('token', token);
        // Navigate to the main app screen
        navigation.replace('welcome');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaProvider >
      <View style={styles.container}>
      <View style={{alignItems:'center',marginBottom:100,}}>
          <Text style={{fontSize:40,fontFamily:'Avenir',fontWeight:'bold'}}>EatWise</Text>
          <Text style={{fontSize:16,fontFamily:'Avenir'}}>Smart Eating Made Simple </Text>
      </View>

      
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />
        <Button title ='Create Account' onPress={()=> navigation.navigate('register')} />

      </View>
      

    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    width:'100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
});

export default LoginScreen;

