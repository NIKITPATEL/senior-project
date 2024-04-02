import React, { useState, useEffect } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';

import axios, { all } from 'axios';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Button,ScrollView,Image,TouchableOpacity,Dimensions,FlatList,Animated, Easing, ImageBackground} from 'react-native';

import { PaperProvider,Dialog,Divider,Icon,IconButton,ProgressBar,MD2Colors,Appbar} from 'react-native-paper'; 
import {useNavigation } from '@react-navigation/native';

import { useUser } from './UserContext';
import { path } from './path';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const SCALE = width / 375; // Adjust the base width (375) as needed





export default function Scanner () {
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')
    const [brandName,setBrandName] = useState('');
    const [scanPhoto,setScanPhoto] = useState('');
    const [glutten,setGlutten] = useState('');
    const [ingredient,setIngredient] = useState('');
    const [barcodeNumber,setBarcodeNumber] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const {userId} = useUser();
    const [dietaryPreferences,setDietaryPreferences] = useState([]);
    const [allergyPreferences,setAllergyPreferences] = useState([]);
    const [productMatchesDiet,setProductMatchesDiet] = useState(true);
    const [showIngredients,setShowIngredients] = useState(false);
    const [isDietExpanded, setIsDietExpanded] = useState(false);
    const [isAllergiesExpanded, setIsAllergiesExpanded] = useState(false);
    const [calories,setCalories] = useState('');
    const [fat,setFat] = useState('');
    const [carbs,setCarbs] = useState('');
    const [protein,setProtein] = useState('');
    const [sugar,setSugar] = useState('');
    const [fiber,setFiber] = useState('');
    const [animatedValue] = useState(new Animated.Value(0));
    const [displayAllergy,setDisplayAllergy] = useState([]);
    const [displayDiet,setDisplayDiet] = useState([]);
    const [unmatchedDietary, setUnmatchedDietary] = useState([]); 
    const [unmatchedAllergy, setUnmatchedAllergy] = useState(new Set());



// Convert the set back to an array for rendering
const unmatchedAllergyArray = Array.from(unmatchedAllergy);
console.log('Unmatched Allergies:', unmatchedAllergyArray);

    const navigation = useNavigation();
    
    const [cartItems, setCartItems] = useState([]);


   
    const askForCameraPermission = () => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }

    const toggleIngredients = () => {
      setShowIngredients(!showIngredients);
    }

    const toggleDietExpansion = () => {
      setIsDietExpanded(!isDietExpanded);
    };
  
    const toggleAllergiesExpansion = () => {
      setIsAllergiesExpanded(!isAllergiesExpanded);
    };
  

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // Requesting for user Preferences 
    useEffect(() => {
      const fetchPreferences = async () => {
        try {
          const response = await axios.get(path+`/userpreferences/${userId}`);
          setDietaryPreferences(response.data);  
          setDisplayDiet(response.data.join(','));
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchPreferences();
    }, [userId]);

    // Start animation
    useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000, // Adjust duration as needed
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
  
      animation.start();
  
      return () => animation.stop();
    }, []);

    useEffect(() => {
      console.log('Diet:', dietaryPreferences);
    }, [dietaryPreferences]);
    

    // Requesting for user Allergies
    useEffect (() => {
      const fetchAllergies = async () => {
        try{
          const response = await axios.get(path+`/userallergies/${userId}`);
          setAllergyPreferences(response.data);
          setDisplayAllergy(response.data.join(','));
          
        }catch(error){
          console.log(error);
        }
      }
      fetchAllergies();
    },[userId]);

    
    // What happens when we scan the bar code
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setModalVisible(true)
        try {
          
          /*
          const upc = encodeURIComponent(data);
          setBarcodeNumber(upc)
          const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${upc}`)
            if (response.data.status === 1) {
              const product = response.data.product;
             
                
                
              const productName = product.product_name || 'Product Name Not Available';
              const ingredients = product.ingredients_text;*/
              const appId = 'c958ac11'; // Replace with your Nutritionix Application ID
          const apiKey = '7d5e826cc223699c79497f63d820cf0a'; // Replace with your Nutritionix API key
          const upc = encodeURIComponent(data); // Replace with the UPC you want to search
          setBarcodeNumber(upc);

          const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item/?upc=${upc}`, {
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'x-app-id': appId,
              'x-app-key': apiKey,
              },
        });

        

            if (response.data && response.data.foods) {
              const product = response.data.foods[0];
              const productName = product.brand_name || 'Product Name Not Available';
              const ingredients = product.nf_ingredient_statement || 'Ingredient Not available';
              const allergens = product.allergens_tags || [];
              const productImage = product.photo && product.photo.thumb;
      
              setCalories(product.nf_calories || 'Calories Not Available');
              setFat(product.nf_total_fat || 'Fat Not Available');
              setCarbs(product.nf_total_carbohydrate || 'Carbs Not Available');
              setProtein(product.nf_protein || 'Protein Not Available');
              setSugar(product.nf_sugars || 'Sugar Not Available');
              setFiber(product.nf_dietary_fiber || 'Fiber Not Available')

              console.log('Ingredients: ',ingredients)
              setBrandName(productName);
              setIngredient(ingredients);
              setScanPhoto(productImage);
              //const ingredientStatement = product.ingredients_text.toLowerCase();


              // Function to determine if the product is gluten-free
              const isProductGlutenFree = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement contains "gluten-free"
                if (lowercaseIngredientStatement.includes('gluten-free')) {
                    return true; // Product is explicitly labeled as gluten-free
                }
                // Check for common gluten-containing ingredients
                const glutenIngredients = ['wheat', 'barley', 'rye', 'malt'];
                for (const glutenIngredient of glutenIngredients) {
                    if (lowercaseIngredientStatement.includes(glutenIngredient)) {
                        
                        return false; // Product contains gluten
                    }
                }
                // If neither "gluten-free" nor gluten-containing ingredients are found, assume it's gluten-free
                return true;
              };

              const isProductDairyFree = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                
                if (lowercaseIngredientStatement.includes('gluten-free')) {
                    return true; 
                }
                
                const dairyIngredients = ['Milk',
                  'Butter',
                  'Cream',
                  'Cheese',
                  'Yogurt',
                  'Whey',
                  'Casein',
                  'sea salt',
                  'Lactose',
                  'Buttermilk',
                  'Ghee'];
                for (const dairyIngredient of dairyIngredients) {
                    if (lowercaseIngredientStatement.includes(dairyIngredient)) {
                        console.log('Ingredient it contains: ',lowercaseIngredientStatement);
                        return false; // Product contains 
                    }
                }
                
                return true;
              }
              
              const isProductLactoseFree = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();

                if(lowercaseIngredientStatement.includes('lactose-free')){
                  return true;
                }
                const lactoseIngredients = [
                  'Milk',
                  'Cream',
                  'Butter',
                  'Yogurt',
                  'Cheese',
                  'Whey',
                  'Casein',
                  'Curds',
                  'Milk solids',
                  'Milk powder'
                ];

                for (const lactoseIngredient of lactoseIngredients) {
                  if (lowercaseIngredientStatement.includes(lactoseIngredient)) {
                      console.log('Ingredient it contains: ',lowercaseIngredientStatement);
                      return false; // Product contains 
                  }
                } 
                return true;
              }


              const isProductNoEgg = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                
                if (lowercaseIngredientStatement.includes('No Egg')) {
                    return true; 
                }
                
                const noEggIngredients = ['Eggs',
                  'Egg yolks',
                  'Egg whites',
                  'Egg powder',
                  'Albumen',
                  'Ovalbumin',
                  'Globulin',
                  'Livetin',
                  'Lysozyme',
                  'Meringue',
                  'Ovomucin',
                  'Ovomucoid',
                  'Ovovitellin',
                  'Vitellin',
                  ];
                for (const noEggIngredient of noEggIngredients) {
                    if (lowercaseIngredientStatement.includes(noEggIngredient)) {
                        //console.log('Ingredient it contains: ',lowercaseIngredientStatement);
                        return false; // Product contains 
                    }
                }
                
                return true;
              }

              const isProductVegetarian = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                
                if (lowercaseIngredientStatement.includes('Vegetarian')) {
                    return true; 
                }
                
                const vegetarianIngredients = ['Meat',
                  'Poultry',
                  'Fish',
                  'Shellfish',
                  'Gelatin',
                  'Rennet',
                  'Lard',
                  'Tallow',
                  'Borth',
                  ];
                for (const vegetarianIngredient of vegetarianIngredients) {
                    if (lowercaseIngredientStatement.includes(vegetarianIngredient)) {
                        return false; // Product contains 
                    }
                }
                
                return true;
              }

              
              
              const isProductVegan = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement contains "gluten-free"
                if(isDairyFree === false || isGlutenFree === false || isLactoseFree === false || isNoEgg === false || isVegetarian === false || isVegan === false ){
                  return false;
                }
                if (lowercaseIngredientStatement.includes('Vegan')) {
                    return true; // Product is explicitly labeled as gluten-free
                }
                // Check for common gluten-containing ingredients
                const veganIngredients = ['Honey', 'Whey', 'Casein'];
                for (const veganIngredient of veganIngredients) {
                    if (lowercaseIngredientStatement.includes(veganIngredient)) {
                        
                        return false; // Product contains gluten
                    }
                }
                // If neither "gluten-free" nor gluten-containing ingredients are found, assume it's gluten-free
                return true;
              };


              // Check if the ingredient statement contains "gluten free"
              const isGlutenFree = isProductGlutenFree(ingredients);
              const isDairyFree =  isProductDairyFree(ingredients);
              const isLactoseFree = isProductLactoseFree(ingredients);
              const isNoEgg = isProductNoEgg(ingredients);
              const isVegetarian = isProductVegetarian(ingredients);
              const isVegan = isProductVegan(ingredients);
              console.log('Is the product Gluten-Free: ',isGlutenFree);
              console.log('Is the product Dairy-Free: ',isDairyFree);
              console.log('Is the product Lactose-Free: ',isLactoseFree);
              console.log('Is the product No Egg: ',isNoEgg);
              console.log('Is the product Vegetarian: ',isVegetarian);
              console.log('Is the product Vegan: ',isVegan);

              // Assuming you have already extracted allergens from the scanned item
              const allergensInProduct = [
                  { name: 'Gluten Free', isPresent: isGlutenFree },
                  { name: 'Dairy Free', isPresent: isDairyFree },
                  { name: 'Lactose Free', isPresent: isLactoseFree },
                  { name: 'No Egg', isPresent: isNoEgg },
                  { name: 'Vegetarian', isPresent: isVegetarian },
                  { name: 'Vegan', isPresent: isVegan }
              ];

              

              
              
              const unmatched = [];
              


              // Checking For Dietary unmatched
              dietaryPreferences.forEach(preference => {
                const matchingDietary = allergensInProduct.find(allergen => 
                    allergen.isPresent && allergen.name.toLowerCase().includes(preference.toLowerCase())
                );

                // If there's no match, add the preference to the unmatched array
                if (!matchingDietary) {
                  unmatched.push(preference);
                }
              });
              setUnmatchedDietary(unmatched);

              
              




              // Split the string into an array of ingredients using commas as the separator
              const ingredientsArray = ingredients.toLowerCase().split(',').map(item => item.trim());    
              
              const lowercaseAllergyPreferences = allergyPreferences.map(preference => preference.toLowerCase());
              
              // Loop through the ingredients and allergies to find matches
              ingredientsArray.forEach(ingredient => {
                allergyPreferences.forEach(allergy => {
                  // Normalize case for comparison
                  const normalizedIngredient = ingredient.toLowerCase();
                  const normalizedAllergy = allergy.toLowerCase();
                  // Check if the ingredient contains the allergy (case insensitive)
                  const containsAllergy = normalizedIngredient.includes(normalizedAllergy);
                  console.log(`Checking ingredient "${normalizedIngredient}" for allergy "${normalizedAllergy}": ${containsAllergy}`);
                  // If a matching allergy is found, add it to the set
                  if (containsAllergy) {
                    console.log('Found allergy:', allergy);
                    // Add the found allergy to the set
                    setUnmatchedAllergy(prevState => {
                      // Create a new Set with the previous state
                      const newState = new Set(prevState);
                      // Add the new allergy to the set
                      newState.add(allergy);
                      return newState;
                    });
                  }
                });
              });
              console.log('Matched Allergy:', unmatchedAllergy);
              

              
              
              //console.log('Allergn:',allergn);
              //etBrandName(productName)
            /*
         const appId = 'c958ac11'; // Replace with your Nutritionix Application ID
        const apiKey = '7d5e826cc223699c79497f63d820cf0a'; // Replace with your Nutritionix API key
        const upc = encodeURIComponent(data); // Replace with the UPC you want to search
        setBarcodeNumber(upc);

        const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item/?upc=${upc}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-app-id': appId,
            'x-app-key': apiKey,
            },
        });

            if (response.data && response.data.foods) {
              const product = response.data.foods[0];
              const brandName = product.brand_name || 'Product Name Not Available';
              const ingredient = product.nf_ingredient_statement || 'Ingredient Not available';
              const allergn = product.nf_allergens;

              console.log('Product Name:', brandName);
              console.log('Ingredients:', ingredient);

              const isGlutenFree = product.nf_ingredient_statement.toLowerCase().includes('gluten free');
              console.log('Hello:',product.nf_ingredient_statement)
              
              setIngredient(ingredient);

              if (isGlutenFree) {
                  console.log('This product is gluten-free.');
                  //setGluten("Gluten Free");
              } else {
                  console.log('This product may contain gluten.');
                  //setGluten("Not Gluten Free");
              }

              console.log('Allergen:', allergn);
              setBrandName(brandName);

              // Find user preferences contained in the ingredient
              console.log(preferences)
              const userPreferencesContained =  preferences.filter(preference =>
                ingredient.toLowerCase().includes(preference.toLowerCase())
              );
              console.log('User preferences contained in the ingredient:', userPreferencesContained);
              */
              // Perform any action you want here with the user preferences contained in the ingredient

                const foodName = product.food_name

                const response_2 = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${foodName}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': 'c958ac11',
                    'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
                  },
                });

                // Extract food names from the response and update the state
                if (response_2.data && response_2.data.branded && response_2.data.common) {
                  const brandedItems = response_2.data.branded.map(item => ({
                    name: item.food_name,
                    photo: item.photo && item.photo.thumb, // Check if photo exists before accessing
                    calories:item.nf_calories
                  }));
                  const commonItems = response_2.data.common.map(item => ({
                    name: item.food_name,
                    photo: item.photo && item.photo.thumb, // Check if photo exists before accessing
                    calories:item.nf_calories
                  }));
                  setCartItems([...brandedItems, ...commonItems]);
                } else {
                  console.error('No food items found in the response');
                }
                console.log(cartItems)
          } else {
              console.error('No data found for the scanned value.');
          }
      } catch (error) {
          console.error('Error fetching data:', error.message);
      }
        
        
        setText(data)
        console.log('Type: ' + type + '\nData: ' + data)
    };

    const saveScannedProduct = async () => {
      const body = {
          userId: userId,
          productId: barcodeNumber,
          barcodeId: barcodeNumber
      };
  
      try {
          const request = await fetch(path + '/save_scanned', {
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
      } catch (error) {
        
          console.log('Cannot save')
          
          
      }
  };
  

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
        <View style={styles.container}>
            <Text>Requesting for camera permission</Text>
        </View>)
    }
    if (hasPermission === false) {
        return (
        <View style={styles.container}>
            <Text style={{ margin: 10 }}>No access to camera</Text>
            <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
        </View>)
    }

    const handle_closemodal = () => {
        setModalVisible(!modalVisible)
        setIngredient("");
        setBrandName("");
        setDietaryPreferences([]);
    }
    




    return (

      <LinearGradient
      colors={['white', '#4c4c4c']}
      style={styles.linearGradient}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      >
        <SafeAreaView style={styles.safeAreaView} >
          <Appbar>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title='Search Calories'/>
            
          </Appbar>
          
          <View style={styles.container}>
            <View style={styles.barcodeBox}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
              />
              <Animated.View
                style={[
                  styles.line,
                  {
                    transform: [
                      {
                        translateX: animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 300],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
            <Text style={styles.mainText}>{text}</Text>
            {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} color="tomato" />}
            {/* Rest of your components */}
          
            
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <ScrollView>
                    <View style={styles.productContainer}>
                      {/* Image */}
                      <Image style={styles.modalImage} source={{ uri: scanPhoto}} />

                      {/* Product details */}
                      <View style={styles.productDetails}>
                        {/* Product name */}
                        <Text style={{color:'white',fontWeight:'900',fontSize:'20%',marginBottom:5,}}>{brandName}</Text>
                        
                        {/* Save icon and rating */}
                        <View style={styles.saveRatingContainer}>
                          {/* Save icon */}
                          <IconButton iconColor='white' icon="bookmark" size={24} onPress={saveScannedProduct} />
                          
                          {/* Rating */}
                          <View style={styles.ratingContainer}>
                            {/* Rating capsule */}
                            <IconButton iconColor='gold' icon="star" size={24}/>
                            <View style={styles.ratingCapsule}>
                              <Text style={styles.ratingText}>4.5</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    
                    {/* Other product details */}
                    <Divider style={{marginVertical:10,height:2}}/>
                    

                    <Text style={styles.sectionTitle}>Nutrition</Text>
                    <ScrollView horizontal>
                      <View style={styles.nutritionContainer}>
                        {/* Capsule for each nutrient */}
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Calories</Text>
                          <Text style={styles.nutrientValue}>{calories}g</Text>
                        </View>
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Fat</Text>
                          <Text style={styles.nutrientValue}>{fat}g</Text>
                        </View>
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Carbs</Text>
                          <Text style={styles.nutrientValue}>{carbs}g</Text>
                        </View>
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Protein</Text>
                          <Text style={styles.nutrientValue}>{protein}g</Text>
                        </View>
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Sugar</Text>
                          <Text style={styles.nutrientValue}>{sugar}g</Text>
                        </View>
                        <View style={styles.nutrientCapsule}>
                          <Text style={styles.nutrientTitle}>Fiber</Text>
                          <Text style={styles.nutrientValue}>{fiber}g</Text>
                        </View>
                      </View>
                    </ScrollView>

                    <View>
                      <Text style={{color:'white'}}>Hwelo</Text>
                      
                        <Text style={{color:'white'}}>{unmatchedDietary.join(', ')}</Text>
            
                    </View>

                    <View style={styles.dietMessageContainer}>
                      {productMatchesDiet ? (
                        <View style={[styles.dietMessage, styles.positiveDietMessage]}>
                          <Text style={styles.dietMessageText}>This product fits your diet</Text>
                          <IconButton icon="thumb-up" />

                        </View>
                      ) : (
                        <View style={[styles.dietMessage, styles.negativeDietMessage]}>
                          <Text style={styles.dietMessageText}>This product doesn't match your diet</Text>
                          <IconButton icon="thumb-down" color="red" />
                        </View>
                      )}
                    </View>

                    <View style={styles.errorMessageContainer}>
                      <View style={styles.errorMessage}>
                        <Text style={styles.errorMessageText}>Please make sure to check the label before consuming.</Text>
                      </View>
                      <IconButton icon="alert-circle-outline" size={24} color="red" />
                    </View>


                    {/* Ingredients */}
                    <TouchableOpacity onPress={toggleIngredients} style={styles.ingredientsContainer}>
                      <Text style={styles.ingredientsTitle}>Ingredients</Text>
                      <IconButton
                        icon={showIngredients ? 'arrow-up' : 'arrow-down'}
                        size={20}
                        onPress={toggleIngredients}
                      />
                    </TouchableOpacity>
                    
                    {/* Expanded ingredients */}
                    {showIngredients && (
                      <View style={styles.expandedIngredients}>
                        {/* Render the list of ingredients here */}
                        <Text>{ingredient}</Text>
                        
                      </View>
                    )}


                    <View style={{padding:5}}>
                      <View style={styles.row}>
                        {/* Diet Preferences */}
                        <View style={styles.capsuleContainer}>
                          <TouchableOpacity style={styles.capsule} onPress={toggleDietExpansion}>
                            <Text style={styles.capsuleText}>Your Diet</Text>
                            <IconButton
                              icon={isDietExpanded ? 'arrow-up' : 'arrow-down'}
                              size={15}
                              onPress={toggleDietExpansion}
                            />
                          </TouchableOpacity>
                          {isDietExpanded && (
                            <View style={styles.expandedContent}>
                              {/* Content for Diet Preferences */}
                              <Text>{displayDiet}</Text>
                            </View>
                          )}
                        </View>

                        {/* Allergies */}
                        <View style={styles.capsuleContainer}>
                          <TouchableOpacity style={styles.capsule} onPress={toggleAllergiesExpansion}>
                            <Text style={styles.capsuleText}>Your Allergies</Text>
                            <IconButton
                              icon={isAllergiesExpanded ? 'arrow-up' : 'arrow-down'}
                              size={15}
                              onPress={toggleAllergiesExpansion}
                            />
                          </TouchableOpacity>
                          {isAllergiesExpanded && (
                            <View style={styles.expandedContent}>
                              {/* Content for Allergies */}
                              <Text>{displayAllergy}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    <Divider style={{marginVertical:5,height:2}}/>
                    

                    <Text style={styles.sectionTitle}>Recommendations</Text>

                    
                    <FlatList
                        horizontal
                        data={cartItems}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.cardContainer}>
                                {/* Render your card here */}
                                <View style={styles.card}>
                                    {/* Product image */}
                                    <Image source={{ uri: item.photo }} style={styles.productImage} />

                                    {/* Calories capsule */}
                                    <View style={styles.caloriesCapsule}>
                                        <Text style={styles.caloriesText}>{item.calories} cal</Text>
                                    </View> 

                                    {/* Product name */}
                                    <View style={styles.productNameContainer}>
                                        <Text style={styles.productName}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    

                    
                    
                    {/* Close modal button */}
                    
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handle_closemodal()}>
                      <Text style={styles.textStyle}>Close Modal</Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </View>

              
            </Modal>

            </View>

            
        </SafeAreaView>

      </LinearGradient>

        
    );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex:1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeBox: {
    width: '80%', // Adjust the width as needed
    aspectRatio: 2, // Adjust aspect ratio for rectangle shape
    overflow: 'hidden',
    borderRadius: 20, // Adjust border radius for capsule shape
    backgroundColor: '#fff', // Background color
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 2, // Adjust the width of the line
    height: '100%',
    backgroundColor: 'white', // Adjust the color of the line
  },
  mainText: {
    fontSize: 16 * SCALE, // Adjust the base font size (16) as needed
    margin: 20 * SCALE, // Adjust other properties as needed
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#4c4c4c',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%', // Make the modal cover the entire screen
    
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalImage: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 2,
    
    shadowColor: 'white', // White shadow color
    shadowOpacity: 1.5, // Adjust shadow opacity as needed
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  productDetails: {
    flex: 1, // Take remaining space
    marginLeft: 10, // Add some space between image and details
    alignItems:'center'
  },
  saveRatingContainer: {
    flexDirection: 'row', // Align save icon and rating horizontally
    alignItems: 'center', // Align items vertically
    marginTop:50,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginLeft: 10,
  },
  ratingCapsule: {
    backgroundColor: '#f0f0f0', 
    borderRadius: 10, 
    padding:5,
  },
  ratingText: {
    color: 'black',
    fontSize: 16, 
    
  },
  modalText: {
    marginTop: 10 * SCALE, // Adjust the margin based on screen size
    fontSize: 16 * SCALE, // Adjust the font size based on screen size
  },
  ingredient: {
    fontSize: 14 * SCALE, // Adjust the font size based on screen size
  },
  allergenInfo: {
    fontSize: 14 * SCALE, // Adjust the font size based on screen size
  },
  dietaryPreferences: {
    fontSize: 14 * SCALE, // Adjust the font size based on screen size
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 20 * SCALE, 
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    color:'white',
    fontSize: 20 * SCALE, 
    fontWeight: 'bold',
    marginLeft: 10 * SCALE,
    marginBottom: 10 * SCALE, 
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientCapsule: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10 * SCALE, 
    borderRadius: 10 * SCALE, 
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowColor:'white',
    shadowOpacity: 0.2,
    shadowRadius: 5 * SCALE, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginHorizontal: 4 * SCALE, 

},
  nutrientTitle: {
    fontSize: 10 * SCALE, // Adjust the font size based on screen size
    fontWeight: 'bold',
    marginBottom: 5 * SCALE, // Adjust the margin based on screen size
  },
  nutrientValue: {
    fontSize: 14 * SCALE, // Adjust the font size based on screen size
  },
  dietMessageContainer: {
    marginTop: 20,
  },
  dietMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items to the start and end of the container
    paddingHorizontal: 20,
    
    borderRadius: 30,
  },
  positiveDietMessage: {
    backgroundColor: '#e6ffe6', // Faded green background color
  },
  negativeDietMessage: {
    backgroundColor: '#ffe6e6', // Faded red background color
  },
  dietMessageText: {
    marginLeft: 10,
    color: 'green', // Green text color for positive message
  },
  ingredientsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    //paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    marginTop: 10,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandedIngredients: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 30,
    marginTop: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capsuleContainer: {
    flex: 1,
    margin:5,
  },
  capsule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    paddingHorizontal:10,
    marginBottom: 10,
  },
  capsuleText: {
    fontSize: 12,
    fontWeight: 'bold',
    
  },
  expandedContent: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 30,
    marginTop: 2,
  },
  recommedContainer: {
    flex: 1,
    // Add your container styles here
    },
    cardContainer: {
      marginHorizontal: 10,
      // Add your card container styles here
  },
  card: {
      width: 150,
      height: 200,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 5,
      justifyContent: 'flex-end', // Align items at the bottom
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.10,
      shadowRadius: 3.84,
      elevation: 5,
      // Add your card styles here
  },
  productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      // Add your product image styles here
  },
  caloriesCapsule: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Example background color
      borderRadius: 10,
      padding: 5,
      // Add your calories capsule styles here
  },
  caloriesText: {
      color: '#fff', // Example text color
      fontSize: 12,
      // Add your calories text styles here
  },
  productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'white'
      
  // Add your product name styles here
  },
  // Styles for product name container
  productNameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius:10,
 
  },
  productName: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color:'white',
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white', // Background color of the capsule view
    borderRadius: 30,
    paddingHorizontal:20,
    marginTop: 10, // Adjust as needed
  },
  errorMessage: {
    flex: 1,
  },
  errorMessageText: {
    color: 'red', // Text color of the error message
  },

});
