import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, Image, Text, SafeAreaView, Animated, TouchableOpacity, Modal,Linking } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Appbar, IconButton } from 'react-native-paper';

const RecipeScreen = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState(null);
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

  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);

    try {
      // Make an HTTP request to fetch recipe details
      const response = await axios.get('https://api.edamam.com/search', {
        params: {
          r: recipe.recipe.uri, // Pass the URI of the selected recipe
          app_id: 'acb5ea92',
          app_key: '626cb51e6848cfb350700d5275ac7b73',
        },
      });

      // Extract recipe details from the response and set it in state
      setRecipeDetails(response.data[0]);
      console.log(recipeDetails);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
  }

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
    <SafeAreaView>
        <View style={styles.header}>
          <Appbar>
            <Appbar.BackAction onPress={() => { navigation.goBack(); }} />
            <Appbar.Content title='Search Recipes' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir-Black' }}/>
          </Appbar>
        </View>

        
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
            <Image source={require('../assets/magic-wand.png')} style={{ width: 30, height: 30, marginTop: 10, alignSelf: 'center' }} />
          </TouchableOpacity>

          {/* Recipe cards */}
          <ScrollView style={styles.recipeContainer}>
            {recipes.map((recipe, index) => (
              <TouchableOpacity key={index} style={styles.recipeCard} onPress={() => handleRecipeClick(recipe)}>
                <Image source={{ uri: recipe.recipe.image }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{recipe.recipe.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            {recipeDetails && (
              <View style={styles.modalContainer}>
                {/* Close button */}
                <IconButton
                  icon="close"
                  size={30}
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                />
                {/* Dish name and meal image */}
                <View style={styles.mealImageContainer}>
                  <Text style={styles.modalTitle}>{recipeDetails?.label}</Text>
                  <Image source={{ uri: recipeDetails?.image }} style={styles.mealImage} />
                </View>
                {/* Ingredients */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{fontWeight:'700',fontFamily:'Avenir-Black'}}>Calories: {recipeDetails.calories.toFixed(2)}</Text>
                  <Text style={{fontWeight:'700',fontFamily:'Avenir-Black'}}>Total Servings: 2</Text>
                </View>
                <View style={{flexDirection: 'row',alignItems: 'center', justifyContent:'space-between',marginTop:15, }}>
                  
                  <Image source={require('../assets/cooking.png')} style={styles.cook} />
                  <Image source={require('../assets/seasoning.png')} style={styles.cook}/>
                  <Image source={require('../assets/sauce.png')} style={styles.cook}/>
                  <Image source={require('../assets/hot-pot.png')} style={styles.cook}/>
                </View>

                <Text style={styles.modalSubtitle}>Ingredients:</Text>
                <ScrollView style={styles.ingredientsContainer}>
                  {recipeDetails?.ingredientLines.map((ingredient, index) => (
                    <Text key={index} style={styles.ingredient}>{ingredient}</Text>
                  ))}
                </ScrollView>

                <TouchableOpacity onPress={() => Linking.openURL(recipeDetails.url)}>
                  <Text style={{ color: 'blue', textDecorationLine: 'underline' , textAlign:'center',fontSize:18,fontFamily:'Avenir-Black'}}>
                    Click here for instructions
                  </Text>
                </TouchableOpacity>

              </View>
            )}
          </Modal>
        
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
    
  },
  animeContainer: {
    backgroundColor: '#c1e3b6', // Background color
    borderRadius: 20, 
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontFamily:'Avenir',
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
    fontFamily:'Avenir-Black'
  },
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily:'Avenir-Black'
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 20,
    fontFamily:'Avenir-Black'
  },
  mealImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mealImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 100,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
  },
  ingredientsContainer: {
    maxHeight: 200,
    marginVertical:10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily:'Avenir'
  },
  stepsContainer: {
    maxHeight: 300,
  },
  cook:{
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default RecipeScreen;
