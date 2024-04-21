import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView,Text,TouchableOpacity,Image,Alert } from 'react-native';
import { Searchbar,Icon } from 'react-native-paper';
import CartItem from './CartItem'; 
import axios from 'axios';
import { useUser } from './UserContext';
import { path } from './path';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useUser();

  
  const handleSearch = async (searchQuery) => {
    try {
      const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': 'c958ac11',
          'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
        },
      });

      
      if (response.data && response.data.branded && response.data.common) {
        const brandedItems = response.data.branded.map(item => ({
          name: item.food_name,
          photo: item.photo && item.photo.thumb, 
          id: item.tag_id
        }));
        const commonItems = response.data.common.map(item => ({
          name: item.food_name,
          photo: item.photo && item.photo.thumb,
          id: item.tag_id 
        }));
        setCartItems([...brandedItems, ...commonItems]);
      } else {
        console.error('No food items found in the response');
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };


  const saveScannedProduct = async (photo, productName) => {
    const body = {
      userId: userId,
      productName: productName,
      photoId: photo,
    };

    try {
      const request = await fetch(path + '/save_cart', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!request.ok) {
            throw new Error(`HTTP error! Status: ${request.status}`);
        }

        const response = await request.json();
        console.log(response);
        Alert.alert('Item saved')
    } catch (error) {
      
      Alert.alert('Cannot save')
        
        
    }
  };

  
  

  
  useEffect(() => {
    const randomTerms = ['breakfast', 'lunch', 'dinner', 'snack']; 
    const randomIndex = Math.floor(Math.random() * randomTerms.length);
    const randomQuery = randomTerms[randomIndex];
    handleSearch(randomQuery); 
  }, []);

  return (
    <SafeAreaView>
      <View>
        
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

        
        <ScrollView contentContainerStyle={styles.scrollContainer} horizontal={false}>
          
          
          {cartItems.map((item, index) => (
            <CartItem key={index} image={item.photo} productName={item.name} onPress={() => saveScannedProduct(item.photo, item.name)} />
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
    paddingHorizontal: 10, 
    paddingTop: 20,
    
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    margin:5,
  },
  scrollView: {
    maxHeight: 100, 
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
    fontWeight:'500',
    fontFamily:'Avenir'
  },
});

export default CartScreen;



















