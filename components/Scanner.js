import React, { useState, useEffect } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';

import axios, { all } from 'axios';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Button,ScrollView,Image,TouchableOpacity,Dimensions,FlatList,Animated, Easing, ImageBackground} from 'react-native';

import { PaperProvider,Dialog,Divider,Icon,IconButton,ProgressBar,MD2Colors,Appbar} from 'react-native-paper'; 
import {useNavigation,useIsFocused } from '@react-navigation/native';

import { useUser } from './UserContext';
import { path } from './path';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, } from 'expo-av';
import Typewriter from './Typewriter';


const { width } = Dimensions.get('window');
const SCALE = width / 375; 





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
    const [unmatchedAllergy, setUnmatchedAllergy] = useState([]);
    const [userNutrients, setUserNutrients] = useState([]);
    const [caloriesOutOfRange, setCaloriesOutOfRange] = useState(false);
    const [fatOutOfRange, setFatOutOfRange] = useState(false);
    const [carbsOutOfRange, setCarbsOutOfRange] = useState(false);
    const [proteinOutOfRange, setProteinOutOfRange] = useState(false);
    const [sugarOutOfRange, setSugarOutOfRange] = useState(false);
    const [fiberOutOfRange, setFiberOutOfRange] = useState(false);
    const [rating,setRating] = useState('');




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
      if(modalVisible){
        fetchAllergies();
        fetchPreferences();
      }
    }, [modalVisible]);

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
    const isFocused = useIsFocused();

    useEffect(() => {
      if (isFocused) {
        fetchAllergies();
        fetchPreferences();
      }
    }, [isFocused]);

    useEffect(() => {
      if (modalVisible) {
        fetchUserNutrients(userId)
        .then(userNutrients => {
          if (userNutrients) {
            compareUserNutrientsWithValues(userNutrients);
          }
        });
      }
    }, [modalVisible]);

    useEffect(() => {
      console.log('Unmatched Dietary:', unmatchedDietary);
    }, [unmatchedDietary]);
    
    useEffect(() => {
      console.log('Unmatched Allergy:', Array.from(unmatchedAllergy));
    }, [unmatchedAllergy]);

    useEffect(() => {
      if(modalVisible){
        checkProductMatchesDiet();
      }
      console.log('Lets see:',productMatchesDiet);
      
      
    }, [unmatchedDietary, unmatchedAllergy]);

    const fetchAllergies = async () => {
      try{
        const response = await axios.get(path+`/userallergies/${userId}`);
        setAllergyPreferences(response.data);
        setDisplayAllergy(response.data.join(','));
        console.log('User Allergies hhh:', displayAllergy)
        
      }catch(error){
        console.log(error);
      }
    }
    const fetchPreferences = async () => {
      try {
        const response = await axios.get(path+`/userpreferences/${userId}`);
        setDietaryPreferences(response.data);  
        setDisplayDiet(response.data.join(','));
      } catch (error) {
        console.log(error);
      }
    };
    


    
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
      
              setCalories(product.nf_calories || 'N/A');
              setFat(product.nf_total_fat || 'N/A');
              setCarbs(product.nf_total_carbohydrate || 'N/A');
              setProtein(product.nf_protein || 'N/A');
              setSugar(product.nf_sugars || 'N/A');
              setFiber(product.nf_dietary_fiber || 'N/A');
              setRating(product.nf_rating || 'N/A')

              //console.log('Ingredients: ',ingredients)
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
                        //console.log('Ingredient it contains: ',lowercaseIngredientStatement);
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
                
                return true;
              };

              const isProductBeefFree = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement contains beef
                if (lowercaseIngredientStatement.includes('beef')) {
                    return false; // Product contains beef
                }
                return true; // Product is beef-free
            };
            
            const isProductPorkFree = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement contains pork
                if (lowercaseIngredientStatement.includes('pork')) {
                    return false; // Product contains pork
                }
                return true; // Product is pork-free
            };
            
            const isProductHalal = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement contains any non-halal ingredients
                const nonHalalIngredients = ['pork', 'gelatin', 'alcohol']; // Adjust as needed
                for (const nonHalalIngredient of nonHalalIngredients) {
                    if (lowercaseIngredientStatement.includes(nonHalalIngredient)) {
                        return false; // Product contains non-halal ingredients
                    }
                }
                return true; // Product is halal
            };
            
            const isProductOrganic = (ingredientStatement) => {
                const lowercaseIngredientStatement = ingredientStatement.toLowerCase();
                // Check if the ingredient statement explicitly mentions "organic"
                if (lowercaseIngredientStatement.includes('organic')) {
                    return true; 
                }
                return false; 
            };
            


              // Check if the ingredient statement contains "gluten free"
              const isGlutenFree = isProductGlutenFree(ingredients);
              const isDairyFree =  isProductDairyFree(ingredients);
              const isLactoseFree = isProductLactoseFree(ingredients);
              const isNoEgg = isProductNoEgg(ingredients);
              const isVegetarian = isProductVegetarian(ingredients);
              const isVegan = isProductVegan(ingredients);
              const noBeef = isProductBeefFree(ingredients);
              const noPork = isProductPorkFree(ingredients);
              const isHalal = isProductHalal(ingredients);
              const isOrganic = isProductOrganic(ingredients);
              console.log('Is the product Gluten-Free: ',isGlutenFree);
              console.log('Is the product Dairy-Free: ',isDairyFree);
              console.log('Is the product Lactose-Free: ',isLactoseFree);
              console.log('Is the product No Egg: ',isNoEgg);
              console.log('Is the product Vegetarian: ',isVegetarian);
              console.log('Is the product Vegan: ',isVegan);
              console.log('Is the product no beef: ',noBeef);
              console.log('Is the product no pork: ',noPork);
              console.log('Is the product Halal: ',isHalal);
              console.log('Is the product Organic: ',isOrganic);
              

              // Assuming you have already extracted allergens from the scanned item
              const allergensInProduct = [
                  { name: 'Gluten Free', isPresent: isGlutenFree },
                  { name: 'Dairy Free', isPresent: isDairyFree },
                  { name: 'Lactose Free', isPresent: isLactoseFree },
                  { name: 'No Egg', isPresent: isNoEgg },
                  { name: 'Vegetarian', isPresent: isVegetarian },
                  { name: 'Vegan', isPresent: isVegan },
                  { name: 'No beef', isPresent: noBeef },
                  { name: 'No pork', isPresent: noPork },
                  { name: 'Halal', isPresent: isHalal },
                  { name: 'Organic', isPresent: isOrganic },

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
              console.log(unmatchedDietary);
              

              
              




              
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
                    
                    if (containsAllergy) {
                      console.log('Found allergy:', allergy);
                      
                      setUnmatchedAllergy(prevState => {
                          
                          const newState = new Set(prevState);
                          
                          if (!newState.has(allergy)) {
                              newState.add(allergy);
                          }
                          return newState;
                      });
                  }
                });
              });
              
              
               



        
        
              

                const foodName = product.food_name

                const response_2 = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${foodName}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': 'c958ac11',
                    'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
                  },
                });

               
                if (response_2.data && response_2.data.branded && response_2.data.common) {
                  const brandedItems = response_2.data.branded.map(item => ({
                    name: item.food_name,
                    photo: item.photo && item.photo.thumb, 
                    calories:item.nf_calories
                  }));
                  const commonItems = response_2.data.common.map(item => ({
                    name: item.food_name,
                    photo: item.photo && item.photo.thumb,  
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


          const handleAddMeal = async () => {
            try {
              
              const mealData = {
                userId: userId, 
                calories: calories,
                protein: protein,
                carbs: carbs,
                fats: fat,
                sugar: sugar, 
              };
          
              
              const response = await axios.post(path + '/add-meal', mealData);
          
             
              console.log('Meal added:', response.data);
              Alert.alert('Meal added');
            } catch (error) {
              console.error('Error adding meal:', error);
            }
          };

      const saveScannedProduct = async () => {
        const body = {
            userId: userId,
            productId: barcodeNumber,
            barcodeId: barcodeNumber,
            productName: brandName,
            photoId:scanPhoto,
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
            Alert.alert('Item saved')
        } catch (error) {
          
          Alert.alert('Cannot save')
            
            
        }
      
    };
    

      
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

      const fetchUserNutrients = async (userId) => {
        try {
          const response = await axios.get(path + `/user-nutrients/${userId}`);
          const userNutrients = response.data.map(nutrient => ({
            nutrientName: nutrient.nutrient_name,
            min: nutrient.nutrient_min,
            max: nutrient.nutrient_max
          }));
          console.log('user nutrients:' ,userNutrients);
          return userNutrients; 
          
        } catch (error) {
          console.error('Error fetching user nutrients:', error);
          return null; 
        }
      };

      // Check if both unmatched dietary and unmatched allergy arrays are empty
      const checkProductMatchesDiet = () => {
        // Check if both unmatched dietary and unmatched allergy arrays are empty
        if (unmatchedDietary.length > 0 || Array.from(unmatchedAllergy).length > 0) {
          setProductMatchesDiet(false);
        } else {
          setProductMatchesDiet(true);
        }
      };

      

      const compareUserNutrientsWithValues = (userNutrients) => {
        userNutrients.forEach(nutrient => {
          switch (nutrient.nutrientName) {
            case 'protein':
              if (protein !== 'N/A' && (protein < nutrient.min && protein > nutrient.max)) {
                setProteinOutOfRange(true);
              }
              break;
            case 'carbs':
              if (carbs !== 'N/A' && (carbs < nutrient.min && carbs > nutrient.max)) {
                setCarbsOutOfRange(true);
              }
              break;
              break;
            case 'calories':
              if (calories !== 'N/A' && (calories < nutrient.min && calories > nutrient.max)) {
                setCaloriesOutOfRange(true);
              }
              break;
            case 'sugar':
              if (sugar !== 'N/A' && (sugar < nutrient.min && sugar > nutrient.max)) {
                setSugarOutOfRange(true);
                
              }
              break;
            case 'fiber':
              if (carbs !== 'N/A' && (fiber < nutrient.min && fiber > nutrient.max)) {

                  setFiberOutOfRange(true);
              }
              break;

            case 'fat':
              if (carbs !== 'N/A' && (fat < nutrient.min && fat > nutrient.max)) {
                    setFatOutOfRange(true);
              }
              break;

           
            default:
              break;
          }
        });
      };

      
      
      
          
      
      
      
      

      const handle_closemodal = () => {
          setModalVisible(!modalVisible)
          setIngredient("");
          setBrandName("");
          setDietaryPreferences([]);
          setUnmatchedAllergy([]);
          setUnmatchedDietary([]);
          setCaloriesOutOfRange(false);
        setCarbsOutOfRange(false);
        setProteinOutOfRange(false);
        setSugarOutOfRange(false);
        setFiberOutOfRange(false);
        setFatOutOfRange(false);
    }

    


    




    return (

        <SafeAreaView style={styles.safeAreaView} >
          <Appbar>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title='Search Calories' titleStyle={{ fontWeight: 'bold' ,fontFamily:'Avenir-Black' }}/>
            
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
            <View style={styles.videoContainer}>
              <View style={styles.videoIcon}>
                <Video
                  source={require('../assets/qr-code.mp4')}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  controls={false}
                  repeat={true}
                />
              </View>
              <View style={styles.space} />
              <View style={styles.videoIcon}>
                <Video
                  source={require('../assets/looking.mp4')}
                  style={styles.video}
                  controls={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  repeat={true}
                />
              </View>
              <View style={styles.space} />
              <View style={styles.videoIcon}>
                <Video
                  source={require('../assets/satay.mp4')}
                  style={styles.video}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  controls={false}
                  repeat={true}
                />
              </View>
              <View style={styles.space} />
              
            </View>
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
                      
                      <Image style={styles.modalImage} source={{ uri: scanPhoto}} />

                     
                      <View style={styles.productDetails}>
                        
                        <Text style={{color:'white',fontWeight:'900',fontSize:24,marginBottom:25, fontFamily:'Avenir-Black'}}>{brandName}</Text>

                        <View style={{flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton iconColor='gold' icon="star" size={24}/>
                            <View style={styles.ratingCapsule}>
                              <Text style={styles.ratingText}>{rating}</Text>
                            </View>
                            
                        </View>
                      
                        
                        
                            
                        <View style={{flexDirection:'row'}}>
                            <IconButton iconColor='white' icon="bookmark" size={24} onPress={saveScannedProduct} style={{marginRight:25}} />
                            <IconButton iconColor='white' icon="food" size={24} onPress={handleAddMeal} style={{marginLeft:25}}/>

                        </View>
                      </View>
                    </View>
                    
                    
                    <Divider style={{marginVertical:10,height:2}}/>
                    

                    <Text style={styles.sectionTitle}>Nutrition</Text>
                    <ScrollView horizontal>
                      <View style={styles.nutritionContainer}>
                        {/* Capsule for each nutrient */}
                        <View style={[styles.nutrientCapsule, caloriesOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Calories</Text>
                          <Text style={styles.nutrientValue}>{calories}g</Text>
                        </View>
                        <View style={[styles.nutrientCapsule, fatOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Fat</Text>
                          <Text style={styles.nutrientValue}>{fat}g</Text>
                        </View>
                        <View style={[styles.nutrientCapsule, proteinOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Protein</Text>
                          <Text style={styles.nutrientValue}>{protein}g</Text>
                        </View>
                        <View style={[styles.nutrientCapsule, carbsOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Carbs</Text>
                          <Text style={styles.nutrientValue}>{carbs}g</Text>
                        </View>
                        <View style={[styles.nutrientCapsule, sugarOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Sugar</Text>
                          <Text style={styles.nutrientValue}>{sugar}g</Text>
                        </View>
                        <View style={[styles.nutrientCapsule, fiberOutOfRange && styles.outOfRange]}>
                          <Text style={styles.nutrientTitle}>Fiber</Text>
                          <Text style={styles.nutrientValue}>{fiber}g</Text>
                        </View>
                      </View>
                    </ScrollView>
                    
                    <View style={styles.matched}>
                      {Array.from(unmatchedAllergy).length > 0 && (
                        <View style={[styles.matchedContainer, styles.allergyContainer]}>
                          <Text style={{color:'white',fontFamily:'Avenir-Black'}}>
                            It contains: {Array.from(unmatchedAllergy).join(', ')}
                          </Text>
                        </View>
                      )}
                      
                      {unmatchedDietary.length > 0 && (
                        <View style={[styles.matchedContainer, styles.dietaryContainer]}>
                          <Text style={{color:'white',fontFamily:'Avenir-Black'}}>
                            Is Not: {unmatchedDietary.join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>


                    

                    
                    <View>
                      {productMatchesDiet ? (
                        <View style={[styles.dietMessage, styles.positiveDietMessage]}>
                          <Text style={styles.dietMessageText}>This product fits your diet</Text>
                          <IconButton icon="thumb-up" iconColor='green' />
                        </View>
                        
                      ) : (
                        <View style={[styles.dietMessage, styles.negativeDietMessage]}>
                          <Text style={styles.dietMessageText}>This product doesn't match your diet</Text>
                          <IconButton icon="thumb-down" iconColor="red" />
                        </View>
                      )}
                    </View>

                    <View style={styles.errorMessageContainer}>
                      <View style={styles.errorMessage}>
                        <Text style={styles.errorMessageText}>Please make sure to check the label before consuming.</Text>
                      </View>
                      <IconButton icon="alert-circle-outline" size={24} color="red" />
                    </View>


                    
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
                        
                        <Text style={{fontWeight:'400',fontFamily:'Avenir-Black'}}>{ingredient}</Text>
                        
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
                              
                              <Text style={{fontWeight:'300', fontFamily:'Avenir-Black'}}>{displayDiet}</Text>
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
                              
                              <Text style={{fontWeight:'300',fontFamily:'Avenir-Black'}}>{displayAllergy}</Text>
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
                                
                                <View style={styles.card}>
                                    
                                    <Image source={item.photo ? { uri: item.photo } : require('../assets/food.png')} style={styles.productImage} />


                                    
                                    <View style={styles.caloriesCapsule}>
                                        <Text style={styles.caloriesText}>{item.calories} cal</Text>
                                    </View> 

                                    
                                    <View style={styles.productNameContainer}>
                                        <Text style={styles.productName}>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handle_closemodal()}>
                      <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                  </ScrollView>
                </View>
              </View>

              
            </Modal>

            </View>

            
        </SafeAreaView>

      

        
    );
}

const styles = StyleSheet.create({
  
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
    width: '80%', 
    aspectRatio: 2,
    overflow: 'hidden',
    borderRadius: 20, 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    
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
    width: 2,  
    height: '100%',
    backgroundColor: 'white', 
  },
  mainText: {
    fontSize: 16 * SCALE, 
    margin: 20 * SCALE, 
    fontFamily:'Avenir'
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
    width: '100%',  
    
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
    
    shadowColor: 'white', 
    shadowOpacity: 1.5, 
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  productDetails: {
    flex: 1, 
    marginLeft: 10, 
    alignItems:'center'
  },
  saveRatingContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop:20,
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
    fontFamily:'Avenir-Black'
  },
  videoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    
  },
  videoIcon: {
    width: 80, 
    height: 80, 
    marginHorizontal:10,
  },
  video: {
    flex: 1,
    resizeMode: 'cover',
    borderRadius:20,
  },
  space: {
    width: 10,  
  },
  modalText: {
    marginTop: 10 * SCALE, 
    fontSize: 16 * SCALE, 
    fontFamily:'Avenir-Black'
  },
  ingredient: {
    fontSize: 14 * SCALE, 
    fontFamily:'Avenir-Black'
  },
  allergenInfo: {
    fontSize: 14 * SCALE, 
    fontFamily:'Avenir-Black'
  },
  dietaryPreferences: {
    fontSize: 14 * SCALE, 
    fontFamily:'Avenir-Black'
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
    fontFamily:'Avenir-Black'
  },
  sectionTitle: {
    color:'white',
    fontSize: 20 * SCALE, 
    fontWeight: '900',
    marginLeft: 10 * SCALE,
    marginBottom: 10 * SCALE, 
    fontFamily:'Avenir-Black'
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  outOfRange:{
    backgroundColor:'pink',
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
    fontSize: 10 * SCALE, 
    fontWeight: '800',
    marginBottom: 5 * SCALE, 
    fontFamily:'Avenir-Black'
  },
  nutrientValue: {
    fontSize: 14 * SCALE, 
    fontWeight:'400',
    fontFamily:'Avenir-Black'
  },
  
  dietMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 5,
    
    borderRadius: 30,
  },
  positiveDietMessage: {
    backgroundColor: '#e6ffe6', 
  },
  negativeDietMessage: {
    backgroundColor: '#ffe6e6',
  },
  dietMessageText: {
    marginLeft: 10,
    fontFamily:'Avenir-Black'
    
  },
  ingredientsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    marginTop: 10,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily:'Avenir-Black'
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
    fontWeight: '800',
    fontFamily:'Avenir-Black'
    
  },
  expandedContent: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 30,
    marginTop: 2,
  },
  recommedContainer: {
    flex: 1,
    },
    cardContainer: {
      marginHorizontal: 10,
      
  },
  card: {
      width: 150,
      height: 200,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 5,
      justifyContent: 'flex-end', 
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.10,
      shadowRadius: 3.84,
      elevation: 5,
      
  },
  productImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      
  },
  caloriesCapsule: {
      position: 'absolute',
      top: 5,
      left: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
      borderRadius: 10,
      padding: 5,
      
  },
  caloriesText: {
      color: '#fff',  
      fontSize: 12,
      fontFamily:'Avenir-Black'
  },
  productName: {
      fontSize: 16,
      fontWeight: 'bold',
      color:'white',
      fontFamily:'Avenir-Black'
      
  
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
      fontFamily:'Avenir-Black'
  },
  errorMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white', 
    borderRadius: 30,
    paddingHorizontal:20,
    marginTop: 10, 
  },
  errorMessage: {
    flex: 1,
  },
  errorMessageText: {
    color: 'red', 
  },
  matched: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  matchedContainer: {
    borderRadius: 30,
    padding: 10,
    
  },
  allergyContainer: {
    backgroundColor: 'red',
    marginBottom:10,
  },
  dietaryContainer: {
    backgroundColor: 'orange', 
  },
  text: {
    color: 'white',
    fontFamily:'Avenir-Black'
  },

});