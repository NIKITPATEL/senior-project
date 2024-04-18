import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,Dimensions,Modal,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Appbar, Avatar,IconButton,List,Button } from 'react-native-paper';
import { useUser } from './UserContext';
import { path } from './path';
import axios from 'axios';

const Allergy = () => {
    const navigation = useNavigation();
    const {userId} = useUser();
    const [userAllergies, setUserAllergies] = useState([]);
    const [selectedAllergies, setSelectedAllergies] = useState([]);

    useEffect(() => {
        // Fetch user's existing allergies from the backend
        const fetchUserAllergies = async () => {
            try {
                const response = await axios.get(path + `/userallergies/${userId}`);
                const userAllergies = response.data;
                
                // Merge the fetched allergies with the selected ones
                const mergedAllergies = Array.from(new Set([...selectedAllergies, ...userAllergies]));
                setSelectedAllergies(mergedAllergies);
            } catch (error) {
                console.error('Error fetching user allergies:', error);
            }
        };
        fetchUserAllergies();
    }, [userId]);
    
    useEffect(() => {
        // Fetch user's existing allergies from the backend
        const fetchUserAllergies = async () => {
            try {
                const response = await axios.get(path + `/userallergies/${userId}`);
                const userAllergies = response.data;
                setUserAllergies(userAllergies);
            } catch (error) {
                console.error('Error fetching user allergies:', error);
            }
        };
        fetchUserAllergies();
    }, [userId]);
    
    
   

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
            console.log('User Allergies:', userAllergies);
            console.log('Selected Allergies:', selectedAllergies);
            
            // Filter out deselected allergies
            const deselectedAllergies = userAllergies.filter(allergy => !selectedAllergies.includes(allergy));
            console.log('Deselected Allergies:', deselectedAllergies);
            
            // Send both selected and deselected allergies to backend
            await axios.post(path + '/user/allergies', {
                userId: userId,
                selected: selectedAllergies,
                deselected: deselectedAllergies,
            });
            
            Alert.alert('Allergies saved successfully');
        } catch (error) {
            console.error('Error saving allergies:', error);
            Alert.alert('Unable to save');
        }
    };
    
    



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
                    <Appbar.Content title='Allergies' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir' }} />
                </Appbar.Header>
                
                
                <ScrollView style={styles.scroll}>
                <View style={styles.container}>
                    <List.Section title="Allergies" titleStyle={{fontFamily:'Avenir',fontWeight:'bold'}}>
                        {allergy.map(({ name, icon, options }, index) => (
                            <React.Fragment key={index}>
                                {options ? (
                                    <List.Accordion
                                        title={name}
                                        titleStyle={{fontFamily:'Avenir',fontWeight:'bold'}}
                                        left={props => <List.Icon {...props} icon={icon} />}
                                    >
                                        {options.map((option, idx) => (
                                            <List.Item
                                                key={idx}
                                                title={option.name}
                                                titleStyle={{fontFamily:'Avenir'}}
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
                                        titleStyle={{fontFamily:'Avenir',fontWeight:'bold'}}
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