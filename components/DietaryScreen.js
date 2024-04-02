// DietaryScreen.js
import React from 'react';
import { useState } from 'react';
import {Dimensions,View,ScrollView,StyleSheet,TouchableOpacity,SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {Button, Appbar,Avatar,Badge, Text} from 'react-native-paper';
import { path } from './path';
import { useUser } from './UserContext';
import axios from 'axios';


export default function DietaryScreen() {
  const navigation = useNavigation();
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const {userId} = useUser();

  const handleAllergy = (name) => {
    if (selectedAvatars.includes(name)) {
      setSelectedAvatars(selectedAvatars.filter((avatar) => avatar !== name));
    } else {
      setSelectedAvatars([...selectedAvatars, name]);
    }
  };

  const handleback = () => {
    navigation.goBack();
  }

  const dietary = [
    { name: 'Gluten Free', source: require('../assets/gluten-free.png') },
    { name: 'Dairy Free', source: require('../assets/dairy-free.png') },
    { name: 'Lactose Free', source: require('../assets/lactose-free.png') },
    { name: 'No Egg' ,source: require('../assets/no-egg.png') },
    { name: 'Vegetarian' ,source: require('../assets/salad.png') },
    { name: 'Vegan' ,source: require('../assets/vegetarian.png') },
    { name: 'No beef' ,source: require('../assets/beef.png') },
    { name: 'No pork' ,source: require('../assets/pork.png') },
    { name: 'Low Sugar' ,source: require('../assets/no-egg.png') },
    { name: 'Halal' ,source: require('../assets/no-egg.png') },
    { name: 'Organic' ,source: require('../assets/no-egg.png') },
    
    
  ]

  const handleSave = async (name) => {
    try{
      await axios.post(path+'/user/preferences',{
        userId,
        preferences: selectedAvatars,
      });
      console.log('Preferences saved successfully');

    }catch(error){
      console.error(error);
    }
  }

  return (

    <SafeAreaView>
      <Appbar.Header>
          <Appbar.BackAction onPress={handleback} />
          <Appbar.Content title='Dietary'/>
        </Appbar.Header>

      <View>
        
          
          {/* Add your dietary screen content here */}
          <ScrollView style={styles.scroll}>
            <Text variant="titleLarge" style={{paddingVertical:15}}>Do you follow any of these Diets?</Text>
            
            <View style={styles.container}>
                {dietary.map(({ name, source }, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAllergy(name)}
                    style={[styles.avatarContainer, selectedAvatars.includes(name) && styles.selectedAvatar]}>
                    <Avatar.Image size={70} source={source} />
                    <View style={styles.nameContainer}>
                      <Text style={styles.name} >{name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
            
          </ScrollView>

          <Button onPress={handleSave} mode='contained'style={{margin:10}}>Save</Button>

          <Button onPress={()=>console.log('Save')}>Don't see your Diet?</Button>

          
        
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  scroll: {
    height: '73%',

  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    borderColor: '#ccc',
    width: Dimensions.get('window').width / 2 - 10, // Adjust margin and padding as per  requirement
  },
  selectedAvatar: {
    borderColor: 'red',
  },
  nameContainer: {
    marginTop: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});