import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import DietaryScreen from './components/DietaryScreen';
import Allergy from './components/AllergyScreen';

import Footer from './components/Footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();



const App = () => {
  

  return (
    <SafeAreaProvider>
      
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
      
      {/* <Stack.Screen name="Feed" component={Feed} /> */}
          <Stack.Screen name="profile" component={Footer} />
          <Stack.Screen name="dietary" component={DietaryScreen} />
          <Stack.Screen name='allergy' component={Allergy} />
          
        </Stack.Navigator>    
        

      </NavigationContainer>
        

    

      
    </SafeAreaProvider>
  );
};

export default App;