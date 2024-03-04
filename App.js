import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DietaryScreen from './components/DietaryScreen';
import Allergy from './components/AllergyScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import WelcomeScreen from './components/WelcomeScreen';
import UserContext, { UserProvider } from './components/UserContext';
import SaveScannedScreen from './components/SaveScannedScreen';
import CartScreen from './components/CartScreen';

import Footer from './components/Footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();



const App = () => {
  

  return (
    <UserProvider>
      <NavigationContainer>
          
          <Stack.Navigator screenOptions={{headerShown: false}}/>
    
      {/* <Stack.Screen name="Feed" component={Feed} /> */}
          <Stack.Screen name= 'welcome'   component={WelcomeScreen} />
          <Stack.Screen name= 'login'   component={LoginScreen} /> 
          <Stack.Screen name='register' component={RegisterScreen} />   
          <Stack.Screen name="main" component={Footer} />
          <Stack.Screen name="dietary" component={DietaryScreen} />
          <Stack.Screen name='allergy' component={Allergy} />
          <Stack.Screen name='savedfood' component={SaveScannedScreen}/>
          
        
        
        </Stack.Navigator>    
        
      
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;