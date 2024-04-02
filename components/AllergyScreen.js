import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,Dimensions,Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Appbar, Avatar,IconButton,List,Button } from 'react-native-paper';
import { useUser } from './UserContext';
import { path } from './path';
import axios from 'axios';

const Allergy = () => {
    const navigation = useNavigation();
    const [flashing, setFlashing] = useState('');
    const {userId} = useUser();

    
    const [selectedAllergies, setSelectedAllergies] = useState([]);
   

    const handleback = () => {
        navigation.goBack();
    }

    const handleAllergyPress = (allergyName) => {
      if (selectedAllergies.includes(allergyName)) {
          setSelectedAllergies(selectedAllergies.filter(item => item !== allergyName));
      } else {
          setSelectedAllergies([...selectedAllergies, allergyName]);
      }
    };  

    const handleSave = async () => {
      try {
        const response = await axios.post(path+'/user/allergies', {
          userId:userId,
          allergies:selectedAllergies,

          
        });
        console.log(response.data);

      }catch (error){
        console.error('Error saving allergies:',error);

      }

    }



  

  

    // Initialize state to track allergen tolerance levels
    
    

    
    

    const allergy = [
        { name: 'Eggs', icon: 'egg' },
        { name: 'Fish', icon: 'fish' },
        { name: 'Milk', icon: 'fish' },
        { name: 'Onions', icon: 'fish' },
        { name: 'Wheat', icon: 'fish' },
        { name: 'Corn', icon: 'corn' },
        {
          name: 'Tree nuts',
          icon: 'peanut',
          options: [
              { name: 'Peanuts', icon: 'almonds' },
              { name: 'Almonds', icon: 'almonds' },
              { name: 'Walnuts', icon: 'walnuts' },
              // Add more nut options as needed
          ]
        },
        { name:'Sellfish',icon:'corn',
          options: [
            { name:'Shrimp',icon:''},
            { name:'Crab',icon:''},
            { name:'Lobster',icon:''},
          ]
        },
        { name:'Sesame', icon: ''},
        { name:'Soy',icon:''},
        { name:'Mustard',icon:''},
        

    ]

    return (
      
            
                
              
      <SafeAreaView>
        <View>
                <Appbar.Header>
                    <Appbar.BackAction onPress={handleback} />
                </Appbar.Header>
                
                
                <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <List.Section title="Allergies">
                        {allergy.map(({ name, icon, options }, index) => (
                            <React.Fragment key={index}>
                                {options ? (
                                    <List.Accordion
                                        title={name}
                                        left={props => <List.Icon {...props} icon={icon} />}
                                    >
                                        {options.map((option, idx) => (
                                            <List.Item
                                                key={idx}
                                                title={option.name}
                                                onPress={() => handleAllergyPress(option.name)}
                                                style={[
                                                    styles.listItem,
                                                    selectedAllergies.includes(option.name) && styles.selectedItem,
                                                ]}
                                            />
                                        ))}
                                    </List.Accordion>
                                ) : (
                                    <List.Item
                                        title={name}
                                        left={props => <List.Icon {...props} icon={icon} />}
                                        onPress={() => handleAllergyPress(name)}
                                        style={[
                                            styles.listItem,
                                            selectedAllergies.includes(name) && styles.selectedItem,
                                        ]}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </List.Section>
                </View>
            </ScrollView>
            <Button onPress={handleSave} mode='contained'style={{margin:10}}>Save</Button>

             <Button onPress={()=>console.log('Save')}>Don't see your Diet?</Button>
          </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        backgroundColor: 'white', // Default background color
    },
    selectedItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Selected item background shadow
    },
    scroll:{
      height:'73%',
    },
});

export default Allergy;