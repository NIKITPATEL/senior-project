import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,Dimensions,Modal,Alert,TextInput } from 'react-native';
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
    const [query,setQuery] = useState('');

    useEffect(() => {
        
        const fetchUserAllergies = async () => {
            try {
                const response = await axios.get(path + `/userallergies/${userId}`);
                const userAllergies = response.data;
                
                setUserAllergies(userAllergies);
                const mergedAllergies = Array.from(new Set([...selectedAllergies, ...userAllergies]));
                setSelectedAllergies(mergedAllergies);
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
    
    const addAllergy = async () => {
        if (query.trim() === '') {
            Alert.alert('Error', 'Please enter an ingredient name.');
            return;
          }
        try {
            const response = await axios.post(path+'/addAllergy',{
                allergenName:query
            });
            setQuery('');
            Alert.alert('Allergy added successfully')
        }catch(error){
            console.log(error);
        }
    }

    const handleSave = async () => {
        try {
            console.log('User Allergies:', userAllergies);
            console.log('Selected Allergies:', selectedAllergies);
            
            
            const deselectedAllergies = userAllergies.filter(allergy => !selectedAllergies.includes(allergy));
            console.log('Deselected Allergies:', deselectedAllergies);
            
            
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
    
    



    

    const allergy = [
        { name: 'Eggs', icon: 'egg' },
        { name: 'Fish', icon: 'fish' },
        { name: 'Milk', icon: 'water' },
        { name: 'Onions', icon: 'circle' },
        { name: 'Wheat', icon: 'grain' },
        { name: 'Corn', icon: 'corn' },
        {
          name: 'Tree nuts',
          icon: 'peanut',
          options: [
              { name: 'Peanuts', icon: '' },
              { name: 'Almonds', icon: '' },
              { name: 'Walnuts', icon: '' },
              
          ]
        },
        { name:'Sellfish',icon:'fish',
          options: [
            { name:'Shrimp',icon:''},
            { name:'Crab',icon:''},
            { name:'Lobster',icon:''},
          ]
        },
        { name:'Sesame', icon: 'seed'},
        { name:'Soy',icon:'cup'},
        { name:'Mustard',icon:'water'},
        

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
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        
                    <TextInput
                    style={styles.input}
                    placeholder="Enter Ingredient..."
                    value={query}
                    onChangeText={setQuery}
                    
                    />
                    
                    <Button onPress={addAllergy}> Add</Button>
                    
                
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
        backgroundColor: 'white', 
    },
    selectedItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
    },
    scroll:{
      height:'73%',
    },
    input: {
        flex:1,
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        
        fontFamily:'Avenir',
    
      },
});

export default Allergy;