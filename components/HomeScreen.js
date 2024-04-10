import React, { Component, useEffect,useState } from 'react'
import { StyleSheet, View, SafeAreaView,ScrollView,Text,TouchableOpacity,Image,Animated} from 'react-native';
import { Searchbar,Card,IconButton,ProgressBar, Icon, Button} from 'react-native-paper';
import PieChart from 'react-native-pie-chart';
import axios from 'axios';
import { path } from './path';
import { useUser } from './UserContext';
import { useNavigation } from '@react-navigation/native';
import { Navigate } from 'react-router-native';
import { AntDesign } from '@expo/vector-icons';


const HomeScreen = (props) => {

    const[searchQuery,setSearchQuery] = React.useState('');
    const [totalNutrients, setTotalNutrients] = useState({ totalcalories: 0, totalprotein: 0, totalcarbs: 0, totalfats: 0,totalsugar: 0 });
    const {username,userId} = useUser();
    const navigation = useNavigation();
    const animatedOpacity = React.useState(new Animated.Value(0))[0];
   

    
    const totalNutrientValues = [600,700,900,90,800];
    const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00','#ff6c00'];

    useEffect(() => {
      console.log('Home :', userId);
      const fetchTotalNutrients = async () => {
        try {
          const response = await axios.get(path + `/total-nutrients/${userId}`);
          setTotalNutrients(response.data);
        } catch (error) {
          console.error('Error fetching total nutrients:', error);
        }
      };
      fetchTotalNutrients();
    }, [userId]);
    console.log(totalNutrients);

    // Function to trigger animation
  const startAnimation = () => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 1000, // Adjust duration as needed
      useNativeDriver: true,
    }).start();
  };

  // Call startAnimation when component mounts
  useEffect(() => {
    startAnimation();
  }, []);
    
    

    


  return (
    <SafeAreaView style={styles.container}>
      {/* Welcome Message Card */}
      <View style={styles.welcomeCard}>
        {/* Add welcome message components here */}
        <IconButton
                icon="account"
                size={40}
                onPress={() => {
                // Handle user icon press
                }}
                style={{marginRight:-10}}
        />
        <Text style={{paddingTop:25,marginLeft:-100,}}> Welcome , {username}</Text>
        <IconButton
                icon="bell"
                size={30}
                onPress={() => {
                // Handle user icon press
                }}
                style={{marginRight:-10}}
        />
      </View>

      {/* Nutrition Summary Card */}
        <View style={styles.nutritionCard}>
          {/* Add nutrition summary components here */}
          <View style={styles.circleChart}>
          {/* Animated view */}
          <Animated.View style={[styles.chartContainer, { opacity: animatedOpacity }]}>
            <PieChart
              style={styles.pieChart}
              widthAndHeight={150}
              series={totalNutrientValues}
              sliceColor={sliceColor}
              coverRadius={0.6}
              coverFill={'#FFF'}
            />
          </Animated.View>

          <View style={styles.nutrientLabels}>
            <Text style={styles.labelsTitle}>Your Nutrition Intake today</Text>
            <Text style={styles.label}>Total Calories: {totalNutrients.totalcalories} kcal</Text>
            <Text style={styles.label}>Total Protein: {totalNutrients.totalprotein} g</Text>
            <Text style={styles.label}>Total Carbs: {totalNutrients.totalcarbs} g</Text>
            <Text style={styles.label}>Total Fats: {totalNutrients.totalfats} g</Text>
            <Text style={styles.label}>Total Sugar: {totalNutrients.totalfats} g</Text>
          </View>
        </View>
      </View>

      {/* Circle Chart */}
      

      {/* Additional Container */}
      <View style={styles.container_2}>
        {/* Add additional components here */}
        <ScrollView>
        
            
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              
            <View style={styles.card}>
              <Image source={require('../assets/random_1.png')} style={{width: '100%',height: '100%',resizeMode: 'cover',borderRadius:24}}/>
            </View>

            
                
            <View style={{width: '45%', aspectRatio: 1,marginHorizontal: 10,borderRadius: 24,}}>
              <View style={{alignItems:'center'}}>
                <Text style={{fontSize: 16,fontWeight: 'bold',textAlign: 'center',marginTop:20}}>Count{'\n'}Calories</Text>
                
                  <IconButton icon="fire" style={styles.iconWrapper} size={75} onPress={() => navigation.navigate('searchcali')} />
                
 
              </View>

            </View>
                
            
            
            
            <View style={styles.card}>
                <View style={styles.cardContainer}>
                    <IconButton icon="circle"  size={40} style={styles.Cardicon} />  
                </View>
                <Text style={styles.cardText}>Text Line 1</Text>
                <Text style={styles.cardText2}>Text Line 2</Text>
                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <ProgressBar
                        progress={0.6}
                        color="green"
                        style={{width:100}}
                    />
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>3/5</Text>
                    </View>
                </View>
            
            </View>

        </View>    
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          
            <View style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('savedfood')}>
                <View style={styles.cardContainer}>
                    <IconButton icon="bookmark"  size={40} style={styles.Cardicon} />  
                </View>
                <Text style={styles.cardText}>Items</Text>
                
                <Text style={styles.cardText2}>Saved Items</Text>
                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <ProgressBar
                        progress={0.6}
                        color="green"
                        style={{width:100}}
                    />
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>3/5</Text>
                    </View>
                </View>
                </TouchableOpacity>
            </View>
          

            
            
              <View style={styles.card}>

                <TouchableOpacity>
                <View style={styles.cardContainer}>
                  <IconButton icon="food-turkey"  size={40} style={styles.Cardicon} />  
                </View>
                <Text style={styles.cardText}>Meals</Text>
                <Text style={styles.cardText2}>Saved Meals</Text>
                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                  <ProgressBar
                    progress={0.6}
                    color="green"
                    style={{width:100}}
                  />
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>3/5</Text>
                  </View>
                </View>
                </TouchableOpacity>
              </View>
            
            
            <View style={styles.card}>
                <View style={styles.cardContainer}>
                    <IconButton icon="circle"  size={40} style={styles.Cardicon} />  
                </View>
                <Text style={styles.cardText}>Text Line 1</Text>
                <Text style={styles.cardText2}>Text Line 2</Text>
                {/* Progress bar */}
                <View style={styles.progressBarContainer}>
                    <ProgressBar
                        progress={0.6}
                        color="green"
                        style={{width:100}}
                    />
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>3/5</Text>
                    </View>
                </View>
            
            </View>
        </View>
  {/* Add more pairs of cards as needed */}

        </ScrollView>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeCard: {
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  nutritionCard: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 20,
  },
  circleChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    marginRight: 20, // Add spacing
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10, // Add border radius
  },
  pieChart: {
    borderRadius: 10, // Add border radius
  },
  nutrientLabels: {
    justifyContent: 'center',
  },
  labelsTitle: {
    marginBottom: 10, // Add spacing
    fontWeight: 'bold',
  },
  
  container_2: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scrollView: {
    maxHeight: 100, // Set a maximum height for the ScrollView
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    borderRadius: 35,
    marginBottom: 5,
    
  },
  iconText: {
    fontSize: 24,
  },
  label: {
    textAlign: 'center',
    marginBottom:5,
  },
  card: {
    width: '45%', // Adjust as needed to fit two cards in a row
    aspectRatio: 1, // Maintain aspect ratio for square cards
    marginHorizontal: 10, // Adjust spacing between cards
    backgroundColor: 'lightgreen',
    borderRadius: 24,
  },
  Cardicon: {
    position: 'absolute',
    top: 0,
    left: 10,
    backgroundColor: 'transparent', // Set background color to transparent
    color: 'blue',
    
  },
  cardContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Align items vertically
  },
  cardText: {
    top: 60,
    left: 10,
    marginLeft: 5, // Adjust spacing between icon and text
    color: '#030303',
    fontSize: 12,
    
  },
  cardText2: {
    top: 70,
    left: 10,
    marginLeft: 5, // Adjust spacing between icon and text
    color: '#030303',
    fontSize: 16,
    
    fontWeight: '600',
  },
  progressBarContainer: {
    top: 80,
    left: 10,
    flexDirection: 'row',
    padding:5,
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginRight: 10, // Adjust spacing between progress bar and text
    padding:20,
  },
  progressTextContainer: {
    backgroundColor: '#f0f0f0', // Example background color for the capsule
    paddingHorizontal: 5, // Adjust padding as needed   
    borderRadius: 10, // Adjust border radius as needed
  },
  progressText: {
    color: 'black', // Example text color
  },
  iconWrapper: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 50, // Adjust as needed
    padding: 10,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    alignSelf:'center'
  },

});

export default HomeScreen;


