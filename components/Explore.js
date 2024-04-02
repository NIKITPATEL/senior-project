import React from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet,ScrollView,TouchableOpacity } from 'react-native';
import { IconButton, Card, Button } from 'react-native-paper';
import SearchCali from './SearchCalir';
import { useNavigation } from '@react-navigation/native';

const cardColors = ['#EBBC13', '#A1D72D', '#2DA1D7', '#FF5733', '#8A2BE2'];

const DishCard = ({ dishData, cardColor }) => {
    const styles = StyleSheet.create({
      dishCard: {
        marginHorizontal: 10,
        borderRadius: 10,
        width: 200, // Adjust based on your requirement
        height: 350, // Adjust based on your requirement
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
        borderTopRightRadius: 10,
      },
      detailsContainer: {
        paddingTop: 45, // Adjusted based on the smaller card height
        padding: 10,
        height: '50%', // Adjusted based on the smaller card height
      },
      dishName: {
        fontSize: 14, // Adjusted font size
        fontWeight: 'bold',
        marginBottom: 5,
      },
      starsContainer: {
        flexDirection: 'row',
        marginBottom: 5, // Adjusted based on the smaller card height
      },
      starIcon: {
        marginRight: 2,
      },
      timeServingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      timeText: {
        fontSize: 12, // Adjusted font size
      },
      servingsText: {
        fontSize: 12, // Adjusted font size
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
                color={index < dishData.rating ? 'gold' : 'gray'}
              />
            ))}
          </View>
          <View style={styles.timeServingsContainer}>
            <Text style={styles.timeText}>Time: {dishData.timeToMake}</Text>
            <Text style={styles.servingsText}>Servings: {dishData.servings}</Text>
          </View>
        </View>
      </Card>
    );
  };
  

const ExploreScreen = () => {
  // Sample user name
  const userName = "John";
  const dishes = [
    {
      name: 'Grilled Salmon',
      rating: 4.5,
      timeToMake: '30 min',
      servings: 2,
      image: require('../assets/salmon.png'),
    },
    {
      name: 'Vegetable Stir-fry',
      rating: 4.2,
      timeToMake: '25 min',
      servings: 3,
      image: require('../assets/stirfry.png'),
    },
    {
      name: 'Chicken Parmesan',
      rating: 4.7,
      timeToMake: '40 min',
      servings: 4,
      image: require('../assets/chickenparmesan.png'),
    },
  ];

  const navigation = useNavigation();



  return (
    <SafeAreaView>
      {/* Left side */}
      <ScrollView>
        <View style={styles.container}>
            <View style={styles.leftContainer}>
            <Text style={styles.bigText}>Hello {userName}</Text>
            <Text style={styles.smallText}>Let's start your day with a healthy meal</Text>
            </View>

            

            {/* Right side */}
            <View style={styles.rightContainer}>
            {/* User icon */}
            <IconButton
                icon="account"
                size={40}
                onPress={() => {
                // Handle user icon press
                }}
                style={styles.userIcon}
            />
            </View>
        </View>

        <ScrollView horizontal style={styles.cardContainer}>
          {dishes.map((dish, index) => (
            <DishCard key={index} dishData={dish} cardColor={cardColors[index % cardColors.length]} />
          ))}
        </ScrollView>

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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 13,
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
        paddingTop: 45, // Adjusted based on the smaller card height
        padding: 10,
        height: '50%', // Adjusted based on the smaller card height
    },
    dishName: {
        fontSize: 14, // Adjusted font size
        fontWeight: 'bold',
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 5, // Adjusted based on the smaller card height
    },
    starIcon: {
        marginRight: 2,
    },
    timeServingsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: 12, // Adjusted font size
    },
    servingsText: {
        fontSize: 12, // Adjusted font size
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
        borderRadius: 10, // Adjust border radius as needed
        marginRight: 12,
      },
      capsuleContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems:'center',
      },
      capsuleText: {
        fontSize: 16,
    
      },
      
    
    

});

export default ExploreScreen;
