import React,{useState} from 'react';
import { View, TextInput, Button, Alert, StyleSheet,Text } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { path } from "./path";

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post(`${path}/register`, { username, email, password, firstname, lastname });
            Alert.alert('Success', 'User registered successfully');
            navigation.navigate('login');
        } catch (error) {
            Alert.alert('Error', 'Failed to register user');
        }
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={{alignItems:'center'}}>
              <Text style={{fontSize:40,fontFamily:'Avenir',fontWeight:'bold'}}>EatWise</Text>
              <Text style={{fontSize:16,fontFamily:'Avenir'}}>Smart Eating Made Simple </Text>
            </View>
            <View style={styles.form}>
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
                <View style={styles.buttonContainer}>
                    <Button title="Register" onPress={handleRegister} color="#5a67d8" />
                </View>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    form: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
    },
    input: {
        height: 50,
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
    buttonContainer: {
        marginTop: 10,
    },
});

export default RegisterScreen;
