import React, { useState,useEffect } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, Image, Text,SafeAreaView,Animated,TouchableOpacity} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';

const RecipeScreen = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  const searchRecipes = async () => {
    try {
      // Make an HTTP request to the Edamam recipe API endpoint with user-input ingredients
      const response = await axios.get('https://api.edamam.com/search', {
        params: {
          q: ingredients,
          app_id: 'acb5ea92',
          app_key: '626cb51e6848cfb350700d5275ac7b73',
        },
      });

      // Extract recipe data from the response and set it in state
      setRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  // Define fade-in and fade-out animations
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Adjust the duration as needed
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Appbar >
          <Appbar.BackAction onPress={() =>{navigation.goBack();}} />
          <Appbar.Content title='Search Recipes'/>
        </Appbar>
      </View>
      
      <View style={styles.content}>
        {/* User input section */}
        <Animated.View
          style={[
            styles.animeContainer,
            {
              opacity: fadeAnim, // Apply fade-in and fade-out effect
              shadowColor: '#000', // Shadow color
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25, // Shadow opacity
              shadowRadius: 3.84, // Shadow radius
              elevation: 5, // Android elevation
            },
          ]}
        >
          <Text style={styles.text}>
            We will suggest you meals based on what ingredients you have in your fridge
          </Text>
        </Animated.View>
        <TextInput
          style={styles.input}
          placeholder="Enter ingredients..."
          value={ingredients}
          onChangeText={setIngredients}
        />
        <TouchableOpacity onPress={searchRecipes}>
            <Image source={require('../assets/magic-wand.png')} style={{width:30,height:30,marginTop:10,alignSelf:'center'}}/>
        </TouchableOpacity>

        {/* Recipe cards */}
        <ScrollView style={styles.recipeContainer}>
          {recipes.map((recipe, index) => (
            <View key={index} style={styles.recipeCard}>
              <Image source={{ uri: recipe.recipe.image }} style={styles.recipeImage} />
              <Text style={styles.recipeName}>{recipe.recipe.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  animeContainer: {
    backgroundColor: '#c1e3b6', // Background color
    borderRadius: 20, // Capsule shape with border radius
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: '#333', // Text color
    textAlign: 'center',
  },
  input: {
    
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
  recipeContainer: {
    marginTop: 20,
  },
  recipeCard: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default RecipeScreen;
