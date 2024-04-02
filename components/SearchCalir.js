import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity,Image } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar,IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';



const SearchCali = () => {
  const [query, setQuery] = useState('');
  const [query_2, setQuery_2] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      const response = await axios.post('https://trackapi.nutritionix.com/v2/search/instant', 
        {
          query: query
        },{
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': 'c958ac11',
          'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
        },
      });
      
      setSearchResults(response.data.branded || response.data.common || []);
      console.log(searchResults);
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
      console.error('Error searching:', error);
    }
  };

  const handleAddMeal = (item) => {
    // Perform action to add meal using item's nutritional information
    console.log('Meal added:', item);
  };
  // Function to handle clear button press
  const handleClear = () => {
    setSearchResults([]);
    setSearchResults2([]);
  };

  return (
    <SafeAreaView>
      <Appbar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Search Calories'/>
        
      </Appbar>
      <View style={styles.container}>
      

      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        {/* Search input */}
        <TextInput
          style={styles.input}
          placeholder="Enter ingredients..."
          value={query}
          onChangeText={setQuery}
        />
        {/* Search button */}
        <IconButton icon="magnify" size={25} onPress={handleSearch} style={{backgroundColor: '#c1e3b6',borderRadius: 20,padding: 10,}} />
        {/* Scan button */}
        <IconButton icon="barcode-scan" size={30} onPress={() => navigation.navigate('scanner')} />
      </View>
      <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
        {/* Search input */}
          <TextInput
            style={styles.input}
            placeholder="Use Natural Language..."
            value={query_2}
            onChangeText={setQuery_2}
          />
          {/* Search button */}
          <IconButton icon="silverware-clean" size={25} onPress={handleSearch_2} style={{borderRadius: 50,backgroundColor: '#d2c3d7', shadowColor: '#d2c3d7',  shadowRadius: 4,elevation: 5, }}/>
          {/* Scan button */}
        
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
                <Text>Calories: {item.nf_calories}</Text>
                <Text>Protein: {item.nf_protein}</Text>
                <Text>Carbs: {item.nf_total_carbohydrate}</Text>
                <Text>Fat: {item.nf_total_fat}</Text>
              </View>
              <View style={styles.rightContent}>
                <Image
                  source={{ uri: item.photo.thumb }}
                  style={styles.image}
                />
                <Text>Total items: {item.serving_qty}</Text>
                <Button mode='contained' title='Add Meal' style={{ backgroundColor: 'green' }} onPress={() => handleAddMeal(item)} />
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
                <Text style={styles.foodName}>{item.food_name || item.brand_name_item_name}</Text>
                <Text>Calories: {item.nf_calories || item.nf_calories_estimated} kcal</Text>
                <Text>Fat: {item.nf_total_fat || item.nf_total_fat_estimated} g</Text>
                <Text>Protein: {item.nf_protein || item.nf_protein_estimated} g</Text>
                <Text>Carbohydrates: {item.nf_total_carbohydrate || item.nf_total_carbohydrate_estimated} g</Text>
              
              </View>
              <View style={styles.rightContent}>
                <Image
                  source={{ uri: item.photo.thumb }}
                  style={styles.image}
                />
                
                <Button mode='contained' title='Add Meal' style={{ backgroundColor: 'green' }} onPress={() => handleAddMeal(item)} />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.food_name}
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
    elevation: 3, // for Android
  },
  
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 0,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '80%',
  },
  
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    width: '90%',
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
    elevation: 5,
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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd', // Light border color
    shadowColor: '#000', // Shadow color
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  
});

export default SearchCali; 
/*

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { path } from './path';
import { useUser } from './UserContext';


const API_URL = 'https://world.openfoodfacts.net/api/v2/search';

const SearchCali = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const {userId} = useUser();

  const handleSearch = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          categories_tags_en: query,
          fields: 'product_name,nutriments,categories_tags_en',
        },
      });
      setSearchResults(response.data.products);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleAddMeal = async (item) => {
    try {
        const mealData = {
            userId: userId,
            calories: item.nutriments?.energy_value || 0,
            protein: item.nutriments?.proteins || 0,
            carbs: item.nutriments?.carbohydrates || 0,
            fats: item.nutriments?.fat || 0,
        };

        const reponse = await axios.post(path+'/add-meal',mealData);
    }catch(error){
        console.log('Erro hadling meal:', error)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title='Search Calories'/>
      </Appbar.Header>
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for products..."
          value={query}
          onChangeText={setQuery}
        />
        <Button title='Search' onPress={handleSearch} />
        <Text style={styles.heading}>Search Results:</Text>
        <FlatList
            data={searchResults}
            renderItem={({ item }) => (
                <View style={styles.item} key={item.code}>
                    <Text>Name: {item.product_name}</Text>
                    <Text>Calories: {item.nutriments?.energy_value || 'N/A'} kcal</Text>
                    <Text>Fat: {item.nutriments?.fat || 'N/A'} g</Text>
                    <Text>Protein: {item.nutriments?.proteins || 'N/A'} g</Text>
                    <Text>Carbohydrates: {item.nutriments?.carbohydrates || 'N/A'} g</Text>
                    <Button title='Add meal'onPress={() => handleAddMeal(item)} />
                        
                    
                </View>
            )}
            keyExtractor={(item) => (item.code ? item.code.toString() : item.product_name)}

        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    position: 'relative', // Ensure addButton's absolute position is relative to this container
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchCali;
*/