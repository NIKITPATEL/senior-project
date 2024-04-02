import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView,Text,TouchableOpacity,Image } from 'react-native';
import { Searchbar,Icon } from 'react-native-paper';
import CartItem from './CartItem'; // Import the CartItem component
import axios from 'axios';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to handle search query
  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': 'c958ac11',
          'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
        },
      });

      // Extract food items from the response and update the state
      if (response.data && response.data.branded && response.data.common) {
        const brandedItems = response.data.branded.map(item => ({
          name: item.food_name,
          photo: item.photo && item.photo.thumb // Check if photo exists before accessing
        }));
        const commonItems = response.data.common.map(item => ({
          name: item.food_name,
          photo: item.photo && item.photo.thumb // Check if photo exists before accessing
        }));
        setCartItems([...brandedItems, ...commonItems]);
      } else {
        console.error('No food items found in the response');
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  
  

  // Fetch food items on component mount
  useEffect(() => {
    const randomTerms = ['breakfast', 'lunch', 'dinner', 'snack']; // Example of random terms
    const randomIndex = Math.floor(Math.random() * randomTerms.length);
    const randomQuery = randomTerms[randomIndex];
    handleSearch(randomQuery); // Fetch default items on mount
  }, []);

  return (
    <SafeAreaView>
      <View>
        {/* Searchbar */}
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          style={{margin:10}}
        />

        
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView} >
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Vegetables')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/healthy.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Vegetables</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Fruits')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/strawberry.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Fruits</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Gluten Free')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/wheat.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Gluten Free</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Burgers')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/food.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Burgers</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Vegan')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/vegan.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Vegan</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Snacks')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/snacks.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Snacks</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Breakfast')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/breakfast.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Breakfast</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Lunch')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/school.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Lunch</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={()=>handleSearch('Dinner')}>
                <View style={styles.circle}>
                  <Image source={require('../assets/dinner.png')} style={{width:30,height:30}}/>
                </View>
                <Text style={styles.label}>Dinner</Text> 
            </TouchableOpacity>
            
        </ScrollView>

        {/* Cart items */}
        <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
          {/* Render CartItem components dynamically based on products array */}
          {cartItems.map((item, index) => (
            <CartItem key={index} image={item.photo} productName={item.name} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10, // Add horizontal padding
    paddingTop: 20, // Add top padding
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow multiple rows of cards
    justifyContent: 'space-between', // Add space between cards
    margin:5,
  },
  scrollView: {
    maxHeight: 100, // Set a maximum height for the ScrollView
  },
  iconContainer: {
    alignItems: 'center',
    
    marginBottom:20,
    marginLeft:20,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor:'#c1e3b6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CartScreen;



















