import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity,Image, Alert } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar,IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { path } from './path';



const SearchCali = () => {
  const [query, setQuery] = useState('');
  const [query_2, setQuery_2] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();
  const {userId} = useUser();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&json=1`);
      console.log('Search Results:', response.data.products);
      setSearchResults(response.data.products);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };
  
  const handleSearch_2 = async () => {
    try {
      const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', 
        {
          query: query_2
        },{
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': 'c958ac11',
          'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
        },
      });
      console.log('Nutrients: ',response.data.foods)
      setSearchResults2(response.data.foods);
    } catch (error) {
    }
  };

  const handleAddMeal = async (item) => {
    try {
      
      const mealData = {
        userId: userId, 
        calories: item.nf_calories || item.nf_calories_estimated || 0,
        protein: item.nf_protein || item.nf_protein_estimated || 0,
        carbs: item.nf_total_carbohydrate || item.nf_total_carbohydrate_estimated || 0,
        fats: item.nf_total_fat || item.nf_total_fat_estimated || 0,
        sugar: item.nf_sugars || item.nf_sugars_estimated || 0, 
      };
  
      
      const response = await axios.post(path + '/add-meal', mealData);
  
      
      console.log('Meal added:', response.data);
      Alert.alert('Meal added');
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };
  const handleAddMeal2 = async (item) => {
    try {
      
      const mealData = {
        userId: userId, 
        calories: item.nutriments?.energy_value || 0,
        protein: item.nutriments?.proteins || 0,
        carbs: item.nutriments?.carbohydrates || 0,
        fats: item.nutriments?.fat || 0,
        sugar: item.nutriments?.sugars || 0, 
      };
  
      
      const response = await axios.post(path + '/add-meal', mealData);
  
      
      console.log('Meal added:', response.data);
      Alert.alert('Meal added');
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };
  
  
  const handleClear = () => {
    setSearchResults([]);
    setSearchResults2([]);
  };

  return (
    <SafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Count Nutrients' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir', }}/>
        
      </Appbar>
      <View style={styles.container}>
      

      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        
        <TextInput
          style={styles.input}
          placeholder="Enter ingredients..."
          value={query}
          onChangeText={setQuery}
        />
        
        <IconButton icon="magnify" size={25} onPress={handleSearch} style={{backgroundColor: '#c1e3b6',borderRadius: 20,padding: 10,}} />
        
        <IconButton icon="barcode-scan" size={30} onPress={() => navigation.navigate('scanner')} />
      </View>
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        
          <TextInput
            style={styles.input}
            placeholder="Use Natural Language..."
            value={query_2}
            onChangeText={setQuery_2}
          />
          
          <IconButton icon="silverware-clean" size={25} onPress={handleSearch_2} style={{borderRadius: 50,backgroundColor: '#d2c3d7', shadowColor: '#d2c3d7',  shadowRadius: 4,elevation: 5, }}/>
          
        
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.heading}>Search Results:</Text>
        <Button title="Clear" onPress={handleClear} />

      </View>

      
      
      {searchResults2 && searchResults2.length > 0 ? (
        <FlatList
          data={searchResults2}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.leftContent}>
                <Text style={styles.foodName}>{item.food_name}</Text>
                <Text style={{fontFamily:'Avenir'}}>Calories: {item.nf_calories||0}g</Text>
                <Text style={{fontFamily:'Avenir'}}>Protein: {item.nf_protein || 0}g</Text>
                <Text style={{fontFamily:'Avenir'}}>Carbs: {item.nf_total_carbohydrate || 0}g</Text>
                <Text style={{fontFamily:'Avenir'}}>Fat: {item.nf_total_fat || 0}g</Text>
                <Text style={{fontFamily:'Avenir'}}>Sugar: {item.nf_sugar || 0} g</Text>
              </View>
              <View style={styles.rightContent}>
                <Image
                  source={{ uri: item.photo.thumb }}
                  style={styles.image}
                />
                <Text style={{marginTop:10,fontWeight:800,fontFamily:'Avenir-Black',fontSize:16}}>Total items: {item.serving_qty}</Text>
                <Button mode='contained' title='Add Meal' style={{ backgroundColor: 'green',fontFamily:'Avenir-Black' }} onPress={() => handleAddMeal(item)} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.leftContent}>
                <Text style={styles.foodName}>{item.product_name}</Text>
                <Text style={{fontFamily:'Avenir'}}>Calories: {item.nutriments?.energy_value || 'N/A'} kcal</Text>
                <Text style={{fontFamily:'Avenir'}}>Fat: {item.nutriments?.fat || 'N/A'} g</Text>
                <Text style={{fontFamily:'Avenir'}}>Protein: {item.nutriments?.proteins || 'N/A'} g</Text>
                <Text style={{fontFamily:'Avenir'}}>Carbs: {item.nutriments?.carbohydrates || 'N/A'} g</Text>
                <Text style={{fontFamily:'Avenir'}}>Sugar: {item.nutriments?.sugars || 'N/A'} g</Text>
              </View>
              <View style={styles.rightContent}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                />
                <Button mode='contained' title='Add Meal' style={{ backgroundColor: 'green' }} onPress={() => handleAddMeal2(item)} />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.code}
        />

      )}

        
      </View>
      

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    margin:10,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
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
    elevation: 3, 
    fontFamily:'Avenir',

  },
  
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 0,
    fontFamily:'Avenir-Black'
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '80%',
  },

  item: {
    backgroundColor: '#feea99',
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  leftContent: {
    flex: 1,
    marginRight: 10,
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  foodName: {
    fontWeight: '900',
    marginBottom: 5,
    fontFamily:'Avenir-Black',
    fontSize:16
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd', 
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    backgroundColor: '#feea99',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  
  
});

export default SearchCali; 
