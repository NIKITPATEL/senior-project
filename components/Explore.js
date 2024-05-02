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
  const [selectedDish, setSelectedDish] = useState(null); 

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
      {
        name: 'Spaghetti Carbonara',
        rating: 4.5,
        timeToMake: '25 min',
        servings: 4,
        image: require('../assets/Spaghetti-Carbonara.png'),
        ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Parmesan cheese', 'Garlic', 'Black pepper'],
        steps: [
            'Cook spaghetti according to package instructions.',
            'In a pan, cook pancetta until crispy, then add minced garlic and cook until fragrant.',
            'Beat eggs and Parmesan cheese together in a bowl.',
            'Drain spaghetti and return to pot. Quickly toss with the egg mixture and pancetta, allowing the heat to cook the eggs without scrambling.',
            'Season with black pepper and serve immediately.'
        ]
    },
    {
        name: 'Ratatouille',
        rating: 4.6,
        timeToMake: '55 min',
        servings: 4,
        image: require('../assets/Ratatouille.png'),
        ingredients: ['Eggplant', 'Zucchini', 'Red bell pepper', 'Tomato sauce', 'Onion', 'Garlic', 'Herbes de Provence', 'Olive oil'],
        steps: [
            'Preheat oven to 375°F (190°C).',
            'Dice all vegetables into uniform pieces.',
            'In a baking dish, layer the bottom with tomato sauce. Arrange the diced vegetables on top and sprinkle with herbes de Provence.',
            'Drizzle with olive oil and bake for 45 minutes, until vegetables are tender.',
            'Serve hot, optionally with crusty bread.'
        ]
    },
    {
        name: 'Thai Green Curry',
        rating: 4.7,
        timeToMake: '30 min',
        servings: 4,
        image: require('../assets/thai-green-curry.png'),
        ingredients: ['Chicken breast', 'Coconut milk', 'Green curry paste', 'Bamboo shoots', 'Bell pepper', 'Thai basil', 'Fish sauce', 'Sugar'],
        steps: [
            'In a skillet, sauté green curry paste until fragrant.',
            'Add diced chicken breast and cook until no longer pink.',
            'Pour in coconut milk, add bamboo shoots and sliced bell peppers. Simmer for 15 minutes.',
            'Stir in fish sauce, sugar, and Thai basil leaves. Cook for an additional 5 minutes.',
            'Serve with steamed jasmine rice.'
        ]
    },
    {
        name: 'Beef Stroganoff',
        rating: 4.3,
        timeToMake: '40 min',
        servings: 4,
        image: require('../assets/classic-beef-stroganoff.png'),
        ingredients: ['Beef sirloin', 'Mushrooms', 'Onion', 'Garlic', 'Sour cream', 'Dijon mustard', 'Beef broth', 'Butter', 'Flour', 'Parsley'],
        steps: [
            'Slice beef into thin strips. In a skillet, melt butter and brown the beef. Remove and set aside.',
            'In the same skillet, add onions and garlic, cooking until soft. Add sliced mushrooms and cook until golden.',
            'Sprinkle flour over vegetables and stir to coat. Slowly pour in beef broth, stirring constantly until thickened.',
            'Return beef to skillet, add sour cream and Dijon mustard. Heat through but do not boil.',
            'Garnish with parsley and serve over egg noodles or rice.'
        ]
    },
    {
        name: 'Butternut Soup',
        rating: 4.8,
        timeToMake: '1 hr',
        servings: 4,
        image: require('../assets/butternut-squash.png'),
        ingredients: ['Butternut squash', 'Onion', 'Carrot', 'Celery', 'Vegetable stock', 'Cream', 'Nutmeg', 'Salt', 'Pepper', 'Olive oil'],
        steps: [
            'Peel and cube butternut squash. Chop onion, carrot, and celery.',
            'In a large pot, heat olive oil over medium heat. Add onion, carrot, and celery, and cook until softened.',
            'Add butternut squash and vegetable stock. Bring to a boil, then reduce heat and simmer until squash is tender.',
            'Puree the soup using an immersion blender or in batches in a blender.',
            'Stir in cream, season with nutmeg, salt, and pepper, and heat through. Serve hot.'
        ]
    },
    {
        name: 'Mushroom Risotto',
        rating: 4.2,
        timeToMake: '1 hr',
        servings: 4,
        image: require('../assets/mushroom-risotto.png'),
        ingredients: ['Arborio rice', 'Mushrooms', 'Onion', 'White wine', 'Chicken broth', 'Parmesan cheese', 'Butter', 'Parsley'],
        steps: [
            'In a saucepan, keep chicken broth warm over low heat.',
            'In a separate pan, melt butter over medium heat. Add chopped onion and cook until translucent.',
            'Add rice, stirring to coat with butter. When rice has taken on a pale, golden color, pour in wine, stirring continually until the wine is fully absorbed.',
            'Add a ladle of hot chicken broth to the rice, and wait until the broth is absorbed before adding the next ladle.',
            'Continue adding broth until the rice is al dente. Stir in finely chopped mushrooms and cook for 3 minutes.',
            'Remove from heat, add Parmesan cheese and parsley. Serve warm.'
        ]
    },
    {
        name: 'Lemon Herb Chicken',
        rating: 4.5,
        timeToMake: '1 hr 30 min',
        servings: 4,
        image: require('../assets/Lemon-Herb-Roasted.png'),
        ingredients: ['Whole chicken', 'Lemon', 'Garlic', 'Rosemary', 'Thyme', 'Butter', 'Salt', 'Pepper', 'Olive oil'],
        steps: [
            'Preheat oven to 425°F (220°C).',
            'Prepare the chicken by patting it dry with paper towels. Rub the skin with olive oil and season inside and out with salt and pepper.',
            'Stuff the cavity with halved lemons, garlic cloves, and fresh herbs.',
            'Place the chicken in a roasting pan, and roast in the preheated oven for 1 hour and 20 minutes, or until the juices run clear.',
            'Baste occasionally with the pan juices. Rest before carving and serve.'
        ]
    },
    {
        name: 'Pad Thai',
        rating: 4.7,
        timeToMake: '30 min',
        servings: 4,
        image: require('../assets/pad-thai.png'),
        ingredients: ['Rice noodles', 'Shrimp', 'Eggs', 'Tofu', 'Bean sprouts', 'Peanuts', 'Green onions', 'Tamarind paste', 'Fish sauce', 'Sugar', 'Lime'],
        steps: [
            'Soak rice noodles in cold water for 30 minutes until soft, then drain.',
            'In a wok or large frying pan, fry the tofu until golden. Push to the side and scramble the eggs.',
            'Add shrimp and cook until pink. Remove everything from the wok.',
            'Add tamarind paste, fish sauce, and sugar to the wok. Stir until mixed.',
            'Add noodles and toss until they are coated with the sauce.',
            'Return the tofu, shrimp, and eggs to the wok. Add bean sprouts and chopped green onions. Mix well.',
            'Serve with crushed peanuts and lime wedges.'
        ]
    },
    {
        name: 'Baked Ziti',
        rating: 4.4,
        timeToMake: '1 hr',
        servings: 6,
        image: require('../assets/Baked-Ziti.png'),
        ingredients: ['Ziti pasta', 'Marinara sauce', 'Ricotta cheese', 'Mozzarella cheese', 'Parmesan cheese', 'Eggs', 'Garlic', 'Olive oil', 'Parsley'],
        steps: [
            'Preheat oven to 375°F (190°C).',
            'Cook ziti pasta al dente according to package instructions. Drain and set aside.',
            'In a mixing bowl, combine ricotta cheese, mozzarella cheese, Parmesan cheese, and beaten eggs.',
            'In a baking dish, layer half the pasta, then half the cheese mixture, and repeat. Pour marinara sauce over the top.',
            'Bake for 25 minutes, or until the cheese is bubbly and golden. Sprinkle with parsley before serving.'
        ]
    },
    {
        name: 'Caesar Salad',
        rating: 4.1,
        timeToMake: '20 min',
        servings: 4,
        image: require('../assets/caesar-salad.png'),
        ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan cheese', 'Caesar dressing', 'Lemon juice', 'Worcestershire sauce', 'Garlic', 'Dijon mustard', 'Anchovy paste (optional)'],
        steps: [
            'Wash and chop romaine lettuce, placing it in a large salad bowl.',
            'Make dressing by combining lemon juice, Worcestershire sauce, crushed garlic, Dijon mustard, and anchovy paste in a small bowl. Whisk until blended.',
            'Toss the lettuce with dressing, then add croutons and shaved Parmesan cheese.',
            'Serve immediately with extra lemon wedges on the side.'
        ]
    },{
      name: 'Grilled Cheese',
      rating: 4.2,
      timeToMake: '10 min',
      servings: 1,
      image: require('../assets/grilledCheese.png'),
      ingredients: ['Bread slices', 'Cheddar cheese', 'Butter'],
      steps: [
          'Butter one side of each bread slice.',
          'Place a slice of cheddar between the unbuttered sides of the bread slices.',
          'Heat a skillet over medium heat and grill the sandwich until golden brown on both sides and the cheese is melted, about 2-3 minutes per side.'
      ]
  },
  {
      name: 'Caprese Salad',
      rating: 4.5,
      timeToMake: '15 min',
      servings: 2,
      image: require('../assets/capreseSalad.png'),
      ingredients: ['Fresh mozzarella cheese', 'Tomatoes', 'Fresh basil', 'Olive oil', 'Balsamic glaze', 'Salt', 'Pepper'],
      steps: [
          'Slice the tomatoes and mozzarella into thick slices.',
          'Arrange the tomato and mozzarella slices on a plate, alternating and overlapping them.',
          'Sprinkle with fresh basil leaves, salt, and pepper.',
          'Drizzle with olive oil and balsamic glaze before serving.'
      ]
  },
  {
      name: 'Chicken Caesar Wrap',
      rating: 4.3,
      timeToMake: '20 min',
      servings: 2,
      image: require('../assets/chickenCaesarWrap.png'),
      ingredients: ['Grilled chicken breast', 'Romaine lettuce', 'Caesar dressing', 'Parmesan cheese', 'Flour tortillas'],
      steps: [
          'Chop the grilled chicken breast and romaine lettuce.',
          'Toss the chicken and lettuce with Caesar dressing and sprinkle with grated Parmesan cheese.',
          'Load the mixture onto flour tortillas, fold securely, and serve.'
      ]
  },
  {
      name: 'Pesto Pasta',
      rating: 4.6,
      timeToMake: '25 min',
      servings: 4,
      image: require('../assets/pestoPasta.png'),
      ingredients: ['Pasta', 'Pesto sauce', 'Parmesan cheese', 'Pine nuts'],
      steps: [
          'Cook pasta according to package instructions; drain.',
          'In a bowl, mix the hot pasta with pesto sauce.',
          'Serve topped with grated Parmesan cheese and a sprinkle of pine nuts.'
      ]
  },
  {
      name: 'Tomato Soup',
      rating: 4.0,
      timeToMake: '45 min',
      servings: 4,
      image: require('../assets/tomatoSoup.png'),
      ingredients: ['Tomatoes', 'Onion', 'Garlic', 'Vegetable broth', 'Cream', 'Salt', 'Pepper', 'Basil'],
      steps: [
          'Chop the tomatoes, onion, and garlic.',
          'In a large pot, sauté onion and garlic until translucent.',
          'Add chopped tomatoes and vegetable broth, bring to a boil, then simmer for 30 minutes.',
          'Blend the mixture until smooth, return to the pot, stir in cream, and season with salt, pepper, and basil.',
          'Serve hot with croutons or a side of bread.'
      ]
  },
  {
      name: 'Thai Basil Chicken',
      rating: 4.7,
      timeToMake: '30 min',
      servings: 2,
      image: require('../assets/thaiBasilChicken.png'),
      ingredients: ['Chicken breast', 'Thai basil leaves', 'Garlic', 'Soy sauce', 'Fish sauce', 'Sugar', 'Chili peppers'],
      steps: [
          'Chop chicken breast into small pieces.',
          'In a wok, sauté minced garlic and chopped chili peppers until fragrant.',
          'Add the chicken and stir-fry until cooked through.',
          'Season with soy sauce, fish sauce, and a pinch of sugar.',
          'Stir in Thai basil leaves just before removing from heat.',
          'Serve hot over rice.'
      ]
  },
  {
      name: 'Pulled Pork Sandwich',
      rating: 4.8,
      timeToMake: '8 hr',
      servings: 6,
      image: require('../assets/pulledPork.png'),
      ingredients: ['Pork shoulder', 'BBQ sauce', 'Onion', 'Garlic', 'Apple cider vinegar', 'Mustard', 'Hamburger buns'],
      steps: [
          'Place the pork shoulder in a slow cooker.',
          'Add chopped onion, minced garlic, apple cider vinegar, mustard, and BBQ sauce.',
          'Cook on low for 8 hours until the pork is very tender.',
          'Shred the pork with two forks, mix with the sauce, and serve on hamburger buns.'
      ]
  },
  {
      name: 'Quinoa Salad',
      rating: 4.4,
      timeToMake: '30 min',
      servings: 4,
      image: require('../assets/quinoaSalad.png'),
      ingredients: ['Quinoa', 'Cucumber', 'Tomatoes', 'Red onion', 'Feta cheese', 'Olives', 'Lemon juice', 'Olive oil', 'Parsley'],
      steps: [
          'Cook quinoa according to package instructions and let it cool.',
          'Chop cucumber, tomatoes, and red onion.',
          'In a large bowl, combine quinoa, vegetables, crumbled feta cheese, and olives.',
          'Dress with lemon juice, olive oil, and chopped parsley.',
          'Mix well and serve chilled or at room temperature.'
      ]
  },
  {
      name: 'Beef Chili',
      rating: 4.5,
      timeToMake: '2 hr',
      servings: 8,
      image: require('../assets/beefChili.png'),
      ingredients: ['Ground beef', 'Kidney beans', 'Tomato sauce', 'Onion', 'Garlic', 'Chili powder', 'Cumin', 'Salt', 'Pepper'],
      steps: [
          'In a large pot, brown the ground beef with chopped onion and minced garlic.',
          'Drain excess fat and return to heat.',
          'Add kidney beans, tomato sauce, chili powder, cumin, salt, and pepper.',
          'Simmer on low heat for at least 1 hour, stirring occasionally.',
          'Serve hot with optional toppings like sour cream, cheddar cheese, and green onions.'
      ]
  },
  {
      name: 'Baked Cod ',
      rating: 4.6,
      timeToMake: '25 min',
      servings: 4,
      image: require('../assets/bakedCod.png'),
      ingredients: ['Cod fillets', 'Butter', 'Lemon juice', 'Garlic', 'Parsley', 'Salt', 'Pepper'],
      steps: [
          'Preheat oven to 400°F (200°C).',
          'Place cod fillets in a baking dish.',
          'In a small saucepan, melt butter with minced garlic, lemon juice, and chopped parsley.',
          'Pour the lemon butter mixture over the cod and season with salt and pepper.',
          'Bake for 15-20 minutes, until cod is flaky and cooked through.',
          'Serve with a side of steamed vegetables or rice.'
      ]
  }
  
    
  
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

            <Button onPress={()=>{navigation.navigate('foodai')}} mode='contained'style={{margin:10}}>Food AI</Button>

            <View style={styles.capsule}>
                <Image source={require('../assets/hand.png')} style={styles.capsuleImage} />
                <View style={styles.capsuleContent}>
                    <Text style={styles.capsuleText}>I have the ingredients but don't know what to cook</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('recipesearch')}>
                      <Image source={require('../assets/magic-wand.png')} style={{width:30,height:30,marginTop:10}}/>
                    </TouchableOpacity>
                    
                </View>
            </View>
            
            
            
            


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
    marginRight: -10, 
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
