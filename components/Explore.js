import React,{useState} from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet,ScrollView,TouchableOpacity,Modal} from 'react-native';
import { IconButton, Card, Button,Icon } from 'react-native-paper';
import SearchCali from './SearchCalir';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';


const cardColors = ['#EBBC13', '#A1D72D', '#2DA1D7', '#FF5733', '#8A2BE2'];

const DishCard = ({ dishData, cardColor,onCardPress }) => {
    const styles = StyleSheet.create({
      dishCard: {
        marginHorizontal: 10,
        borderRadius: 10,
        width: 200, 
        height: 350, 
        backgroundColor: cardColor,
      },
      imageContainer: {
        height: '50%',
        width: '65%',
        position: 'relative',
      },
      dishImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        right: 0,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
      },
      
      detailsContainer: {
        paddingTop: 45, 
        padding: 10,
        height: '50%', 
      },
      dishName: {
        fontSize: 17, 
        fontWeight: '900',
        marginBottom: 5,
        fontFamily:'Avenir-Black'
      },
      starsContainer: {
        flexDirection: 'row',
        marginBottom: 5, 
      },
      starIcon: {
        marginRight: 2,
      },
      timeServingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      timeText: {
        fontSize: 12, 
        fontFamily:'Avenir-Black'
      },
      servingsText: {
        fontSize: 12, 
        fontFamily:'Avenir-Black'
      },
    });
  
    return (
      
      <Card style={styles.dishCard}>
        <View style={styles.imageContainer}>
          <Image source={dishData.image} style={styles.dishImage} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.dishName}>{dishData.name}</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <IconButton
                key={index}
                icon="star"
                size={15}
                style={styles.starIcon}
                iconColor={index < dishData.rating ? 'gold' : 'gray'}
              />
            ))}
          </View>
          <View style={styles.timeServingsContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconButton icon="clock-time-three" size={20}></IconButton>
                <Text style={{fontSize: 12,marginRight:20,fontWeight:500,fontFamily:'Avenir-Black'}}>{dishData.timeToMake}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconButton icon="room-service" size={20} />
                <Text style={{fontSize: 12,fontWeight:500,fontFamily:'Avenir-Black'}}>{dishData.servings}</Text>
              </View>
            </View>
          </View>

        </View>
      </Card>
      
    );
  };
  

const ExploreScreen = () => {
  const {userId,username} = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null); // Store the selected dish data

  const onCardPress = (dishData) => {
    setSelectedDish(dishData);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedDish(null);
    setModalVisible(false);
  };
  const dishes = [
    {
          name: 'Grilled Salmon',
          rating: 4,
          timeToMake: '30 min',
          servings: 2,
          image: require('../assets/salmon.png'),
          ingredients: ['Salmon fillet', 'Olive oil', 'Lemon', 'Salt', 'Pepper'],
          steps: ['Preheat grill to medium-high heat.', 'Brush salmon with olive oil, season with salt and pepper.', 'Grill salmon for 4-5 minutes per side until cooked through.', 'Serve with lemon wedges.']
      },
      {
          name: 'Vegetable Stir-fry',
          rating: 4,
          timeToMake: '25 min',
          servings: 3,
          image: require('../assets/stirfry.png'),
          ingredients: ['Assorted vegetables (e.g., bell peppers, broccoli, carrots)', 'Soy sauce', 'Garlic', 'Ginger', 'Vegetable oil', 'Salt', 'Pepper'],
          steps: ['Slice vegetables into bite-sized pieces.', 'Heat vegetable oil in a wok or large skillet over medium-high heat.', 'Add minced garlic and ginger, stir-fry for 30 seconds.', 'Add vegetables, season with salt and pepper, stir-fry until tender-crisp.', 'Drizzle soy sauce, toss well, and cook for another minute.', 'Serve hot.']
      },
      {
          name: 'Chicken Parmesan',
          rating: 5,
          timeToMake: '40 min',
          servings: 4,
          image: require('../assets/chickenparmesan.png'),
          ingredients: ['Chicken breasts', 'Eggs', 'Breadcrumbs', 'Parmesan cheese', 'Marinara sauce', 'Mozzarella cheese', 'Salt', 'Pepper', 'Olive oil'],
          steps: ['Preheat oven to 375°F (190°C).', 'Season chicken breasts with salt and pepper.', 'Dip each chicken breast in beaten eggs, then coat with breadcrumbs mixed with grated Parmesan cheese.', 'Heat olive oil in a skillet over medium heat, cook chicken until golden brown on both sides.', 'Transfer chicken to a baking dish, cover with marinara sauce and mozzarella cheese.', 'Bake for 20-25 minutes until cheese is bubbly and chicken is cooked through.', 'Serve hot with pasta or salad.']
      },
      {
          name: 'Beef Tacos',
          rating: 4,
          timeToMake: '35 min',
          servings: 4,
          image: require('../assets/beeftacos.jpeg'),
          ingredients: ['Ground beef', 'Taco seasoning', 'Tortillas', 'Lettuce', 'Tomatoes', 'Onions', 'Cheddar cheese', 'Sour cream', 'Salsa'],
          steps: ['Cook ground beef in a skillet over medium heat until browned.', 'Stir in taco seasoning according to package instructions.', 'Warm tortillas in a dry skillet or microwave.', 'Fill tortillas with seasoned beef, lettuce, tomatoes, onions, and cheddar cheese.', 'Top with sour cream and salsa.', 'Serve hot.']
      },
      {
          name: 'Shrimp Scampi',
          rating: 3.5,
          timeToMake: '20 min',
          servings: 2,
          image: require('../assets/shrimpScampi.jpeg'),
          ingredients: ['Shrimp', 'Linguine pasta', 'Butter', 'Garlic', 'White wine', 'Lemon juice', 'Parsley', 'Salt', 'Pepper'],
          steps: ['Cook linguine pasta according to package instructions.', 'In a skillet, melt butter over medium heat.', 'Add minced garlic and cook until fragrant.', 'Add shrimp, white wine, lemon juice, salt, and pepper.', 'Cook until shrimp turn pink and are cooked through, about 4-5 minutes.', 'Toss cooked linguine with shrimp mixture.', 'Garnish with chopped parsley and serve hot.']
      },
      {
          name: 'Vegetable Lasagna',
          rating: 4.4,
          timeToMake: '1 hr 15 min',
          servings: 6,
          image: require('../assets/VegLasagna.jpeg'),
          ingredients: ['Lasagna noodles', 'Marinara sauce', 'Ricotta cheese', 'Spinach', 'Zucchini', 'Mushrooms', 'Onion', 'Garlic', 'Mozzarella cheese', 'Parmesan cheese', 'Olive oil', 'Salt', 'Pepper'],
          steps: ['Preheat oven to 375°F (190°C).', 'Cook lasagna noodles according to package instructions.', 'In a skillet, sauté chopped onion and minced garlic in olive oil until softened.', 'Add sliced mushrooms and diced zucchini, cook until tender.', 'Stir in spinach until wilted.', 'In a baking dish, layer marinara sauce, cooked lasagna noodles, ricotta cheese, vegetable mixture, and shredded mozzarella cheese.', 'Repeat layers, finishing with a layer of marinara sauce and a sprinkle of Parmesan cheese on top.', 'Cover with foil and bake for 45 minutes.', 'Remove foil and bake for an additional 15 minutes until bubbly and golden brown.', 'Let it cool for a few minutes before serving.']
      },
  
  ];

  const navigation = useNavigation();



  return (
    <SafeAreaView>
      {/* Left side */}
      <ScrollView>
        <View style={styles.container}>
            <View style={styles.leftContainer}>
            <Text style={styles.bigText}>Hello, {username}</Text>
            <Text style={styles.smallText}>Let's start your day with a healthy meal!</Text>
            </View>

            

            
            <View style={styles.rightContainer}>
            
              <Image
                alt=""
                source={require('../assets/profile.png')} 
                style={{width:40,height:40}}/>
            </View>
        </View>

        
        <ScrollView horizontal style={styles.cardContainer}>
            {dishes.map((dish, index) => (
              <TouchableOpacity key={index} onPress={() => onCardPress(dish)}>
              <DishCard key={index} dishData={dish} cardColor={cardColors[index % cardColors.length]} />
              </TouchableOpacity>
            ))}
        </ScrollView>
        
        

            <Modal
              animationType="slide"
              transparent={false}
              visible={modalVisible}
              onRequestClose={closeModal}
            >
              <View style={styles.modalContainer}>
                {/* Close button */}
                <IconButton
                  icon="close"
                  size={30}
                  onPress={closeModal}
                  style={styles.closeButton}
                />
                {/* Dish name and meal image */}
                <View style={styles.mealImageContainer}>
                  <Text style={styles.modalTitle}>{selectedDish?.name}</Text>
                  <Image source={selectedDish?.image} style={styles.mealImage} />
                </View>
                {/* Ingredients */}
                <Text style={styles.modalSubtitle}>Ingredients:</Text>
                <Text style={styles.ingredient}>{selectedDish?.ingredients.join(', ')}</Text>

                <View style={{flexDirection: 'row',alignItems: 'center', justifyContent:'space-between',marginTop:10, }}>
                  
                  <Image source={require('../assets/cooking.png')} style={styles.cook} />
                  <Image source={require('../assets/seasoning.png')} style={styles.cook}/>
                  <Image source={require('../assets/sauce.png')} style={styles.cook}/>
                  <Image source={require('../assets/hot-pot.png')} style={styles.cook}/>
                </View>
                {/* Steps */}
                <Text style={styles.modalSubtitle}>Steps:</Text>
                <ScrollView style={styles.ingredientsContainer}>
                  {selectedDish?.steps.map((step, index) => (
                    <Text key={index} style={styles.ingredient}>{step}</Text>
                  ))}
                </ScrollView>

              </View>
            </Modal>

            <View style={styles.contentContainer}>
                {/* Paragraph */}
                <View style={styles.textContainer}>
                    <Text style={styles.paragraph}>
                        Bored with eating same food let's explore more options  
                    </Text>
                </View>

                {/* Image */}
                <View style={styles.imageContainer2}>
                    <Image source={require('../assets/sushi.png')} style={styles.image2} />
                </View>
            </View>

            <View style={styles.capsule}>
                <Image source={require('../assets/hand.png')} style={styles.capsuleImage} />
                <View style={styles.capsuleContent}>
                    <Text style={styles.capsuleText}>I have the ingredients but don't know what to cook</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('recipesearch')}>
                      <Image source={require('../assets/magic-wand.png')} style={{width:30,height:30,marginTop:10}}/>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
            <Button onPress={()=>{navigation.navigate('SearchCali')}} mode='contained'style={{margin:10}}>Calories</Button>
            
            


        </ScrollView>

        
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContainer: {
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
    fontFamily:'Avenir-Black'
  },
  smallText: {
    fontSize: 15,
    fontWeight:'300',
    fontFamily:'Avenir-Black'
  },
  userIcon: {
    marginRight: -10, // Adjust as needed
  },
  cardContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
  },

    imageContainer: {
        height: '50%',
        width: '65%',
        position: 'relative',
    },
    dishImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        right: 0,
        borderTopRightRadius: 10,

    },
    detailsContainer: {
        paddingTop: 45, 
        padding: 10,
        height: '50%', 
    },
    dishName: {
        fontSize: 14, 
        fontFamily:'Avenir-Black',
        fontWeight: '900',
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 5, 
    },
    starIcon: {
        marginRight: 2,
    },
    timeServingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
      },
      textContainer: {
        flex: 1,
      },
      paragraph: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        fontFamily:'Avenir'
      },
      imageContainer2: {
        marginLeft: 20,
      },
      image2: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 10,
      },
      cook:{
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 10,
      },
      
      
      capsule: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FCF1AA',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginHorizontal: 20,
        marginBottom: 20,
      },
      capsuleImage: {
        width: 100,
        height: 100,
        borderRadius: 10, 
        marginRight: 12,
      },
      capsuleContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
      },
      capsuleText: {
        fontSize: 16,
        fontFamily:'Avenir',
    
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
        fontWeight: '900',
        marginBottom: 10,
        fontFamily:'Avenir-Black'
      },
      modalSubtitle: {
        fontSize: 20,
        fontWeight: '900',
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
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
      },
      ingredientsContainer: {
        maxHeight: 200,
      },
      ingredient: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily:'Avenir-Black',
        fontWeight:700,
      },
      stepsContainer: {
        maxHeight: 300,
      },
      step: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily:'Avenir-Black'
      },
      

});

export default ExploreScreen;
