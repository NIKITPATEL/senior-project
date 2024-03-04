import React,{useState} from "react";
import { View, TextInput, Button, Alert,StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native'
import { path } from "./path";

import axios from 'axios';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [username,setUsername] =  React.useState('');
    const [email,setEmail] =  React.useState('');
    const [password,setPassword] =  React.useState('');
    const [firstname,setFirstName] = React.useState('');
    const [lastname,setLastName] = React.useState('');


    const handleRegister = async () => {
        try {
            await axios.post(path+'/register', { username, email, password,firstname,lastname });
            Alert.alert('Success', 'User registered successfully');
            // Navigate to the login screen
            navigation.navigate('login');

        } catch (error){
            Alert.alert('Error', 'Failed to register user');
        }
    }
    return (
        <SafeAreaProvider style={styles.container}>
            <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TextInput
          placeholder="First Name"
          
          value={firstname}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          
          value={lastname}
          onChangeText={setLastName}
          style={styles.input}
        />
        <Button title="Register" onPress={handleRegister} />
      </View>
            
        </SafeAreaProvider>
    )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
    },
    input: {
      height: 40,
      width: '80%',
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
  });

export default RegisterScreen;