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
        
        { name: 'Milk', icon: 'cow', options: [
            { name: 'Cow milk', icon: '' },
            { name: 'Goat milk', icon: '' },
            { name: 'Sheep milk', icon: '' },
            { name: 'Buffalo milk', icon: '' },
            { name: 'Cheese', icon: '' },
            { name: 'Yogurt', icon: '' },
            { name: 'Milk', icon: '' }
        ]},
        { name: 'Eggs', icon: 'egg', options: [
            { name: 'Chicken eggs', icon: '' },
            { name: 'Duck eggs', icon: '' },
            { name: 'Quail eggs', icon: '' },
            { name: 'Eggs', icon: '' }
        ]},
        { name: 'Fish', icon: 'fish', options: [
            { name: 'Salmon', icon: 'fish' },
            { name: 'Tuna', icon: 'fish' },
            { name: 'Cod', icon: 'fish' },
            { name: 'Anchovies', icon: 'fish' },
            { name: 'Halibut', icon: 'fish' }
        ]},
        { name: 'Peanuts', icon: 'peanut' },
        { name: 'Sesame', icon: 'grain' },
        {name:'Corn',icon:'corn'},
        { name: 'Vegetables', icon: 'carrot', options: [
            { name: 'Carrots', icon: '' },
            { name: 'Celery', icon: '' },
            { name: 'Tomatoes', icon: '' },
            { name: 'Peppers', icon: '' },
            { name: 'Garlic', icon: '' },
            { name: 'Onions', icon: '' },
            { name: 'Eggplants', icon: '' },
            { name: 'Bell peppers', icon: '' },
            { name: 'Hot peppers', icon: '' },

        ]},
        { name: 'Oil', icon: 'water', options: [
            { name: 'Peanut Oil', icon: '' },
            { name: 'Soybean Oil', icon: '' },
            { name: 'Corn Oil', icon: '' },
            { name: 'Canola Oil', icon: '' },
            { name: 'Palm Oil', icon: '' },
            { name: 'Coconut Oil', icon: '' },
            { name: 'Sunflower Oil', icon: '' },
            { name: 'Fish Oil', icon: '' },
            { name: 'Sesame Oil', icon: '' },
            { name: 'Olive Oil', icon: '' },

        ]},
        { name: 'Shellfish', icon: 'fish', options: [
            { name: 'Shrimp', icon: '' },
            { name: 'Crab', icon: '' },
            { name: 'Lobster', icon: '' },
            { name: 'Mussels', icon: '' },
            { name: 'Oysters', icon: '' },
            { name: 'Scallops', icon: '' }
        ]},
        { name: 'Tree Nuts', icon: 'tree', options: [
            { name: 'Almonds', icon: '' },
            { name: 'Walnuts', icon: '' },
            { name: 'Hazelnuts', icon: '' },
            { name: 'Cashews', icon: '' },
            { name: 'Pecans', icon: '' },
            { name: 'Pistachios', icon: '' },
            { name: 'Brazil nuts', icon: '' },
            { name: 'Macadamia nuts', icon: '' }
        ]},
        { name: 'Wheat', icon: 'grain', options: [
            { name: 'Bread Wheat', icon: '' },
            { name: 'Durum Wheat', icon: '' },
            { name: 'Spelt', icon: '' },
            { name: 'Kamut', icon: '' },
            { name: 'Wheat', icon: '' }
        ]},
        { name: 'Soybeans', icon: '', options: [
            { name: 'Soy milk', icon: '' },
            { name: 'Tofu', icon: '' },
            { name: 'Soy sauce', icon: '' },
            { name: 'Edamame', icon: '' },
            { name: 'Tempeh', icon: '' }
        ]},
        { name: 'Fruits', icon: 'apple', options: [
            { name: 'Apples', icon: '' },
            { name: 'Oranges', icon: '' },
            { name: 'Bananas', icon: '' },
            { name: 'Peaches', icon: '' },
            { name: 'Mangoes', icon: '' }
        ]},
        { name: 'Spices', icon: '', options: [
            { name: 'Cinnamon', icon: '' },
            { name: 'Mustard', icon: '' },
            { name: 'Chili pepper', icon: '' }
        ]},
        { name: 'Preservatives', icon: '', options: [
            { name: 'Butylated hydroxyanisole', icon: '' },
            { name: 'Butylated hydroxytoluene', icon: '' },
            { name: 'Propyl gallate', icon: '' },
            { name: 'Sodium benzoate', icon: '' },
            
        ]},
        { name: 'Sweeteners', icon: '', options: [
            { name: 'Aspartame', icon: '' },
            { name: 'Sucralose', icon: '' },
            { name: 'High fructose corn syrup', icon: '' },
            { name: 'Stevia', icon: '' },
            { name: 'Sorbitol', icon: '' }
        ]},


        

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