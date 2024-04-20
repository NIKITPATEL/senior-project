// DietaryScreen.js
import React,{useEffect} from 'react';
import { useState } from 'react';
import {Dimensions,View,ScrollView,StyleSheet,TouchableOpacity,SafeAreaView,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import {Button, Appbar,Avatar,Badge, Text} from 'react-native-paper';
import { path } from './path';
import { useUser } from './UserContext';
import axios from 'axios';


export default function DietaryScreen() {
  const navigation = useNavigation();
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [userAllergies, setUserAllergies] = useState([]); 
  const {userId} = useUser();

  useEffect(() => {
  // Fetch user's existing allergies from the backend
  const fetchUserAllergies = async () => {
    try {
      const response = await axios.get(path+`/userpreferences/${userId}`);
      setUserAllergies(response.data); 
    } catch (error) {
      console.error('Error fetching user allergies:', error);
    }
  };

  fetchUserAllergies();
}, [userId]);


const handleAllergy = (name) => {
  if (selectedAvatars.includes(name)) {
    // If the allergy is already selected, deselect it and remove red border
    setSelectedAvatars(selectedAvatars.filter((avatar) => avatar !== name));
    // Remove red border for deselected allergies
    setUserAllergies(userAllergies.filter((allergy) => allergy !== name));
  } else {
    // If the allergy is not selected, select it and apply green border
    setSelectedAvatars([...selectedAvatars, name]);
    
    setUserAllergies([...userAllergies, name]);
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
    { name: 'Low Sugar' ,source: require('../assets/no-sugar.png') },
    { name: 'Halal' ,source: require('../assets/halal.png') },
    { name: 'Organic' ,source: require('../assets/organic.png') },
    
    
  ];



  const handleSave = async () => {
    try {
      // Save selected and deselected allergies to the database
     // console.log('Selected:', selectedAvatars);
    
      await axios.post(path + '/user/preferences', {
        userId,
        selected: selectedAvatars,
        deselected: userAllergies.filter((allergy) => !selectedAvatars.includes(allergy)),
      });
  
      Alert.alert('Dietary Saved');
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to Save');
    }
  };

  

  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleback} />
        <Appbar.Content title='Dietary' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir' }} />
      </Appbar.Header>

      <View>
        <ScrollView style={styles.scroll}>
          <Text variant="titleLarge" style={{ paddingVertical: 15, fontWeight: '600',fontFamily:'Avenir' }}>Do you follow any of these Diets?</Text>

          <View style={styles.container}>
            {dietary.map(({ name, source }, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAllergy(name)}
                style={[
                  styles.avatarContainer,
                  selectedAvatars.includes(name) && styles.selectedAvatar,
                  userAllergies.includes(name) && styles.allergyAvatar, 
                  
                ]}
              >
                <Avatar.Image size={70} source={source} />
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        <Button onPress={handleSave} mode='contained' style={{ margin: 10 }}>Save</Button>
        <Button onPress={() => Alert.alert('Please go back to see more options for diet.')}>Don't see your Diet?</Button>
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
    width: Dimensions.get('window').width / 2 - 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedAvatar: {
    borderColor: 'red',
  },
  allergyAvatar: {
    borderColor: 'red', 
  },
  nameContainer: {
    marginTop: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily:'Avenir'
  },
});