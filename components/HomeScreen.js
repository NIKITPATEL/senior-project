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
      duration: 1000, 
      useNativeDriver: true,
    }).start();
  };

  
  useEffect(() => {
    startAnimation();
  }, []);
    
    

    


  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.welcomeCard}>
        {/* Profile icon and text on the left */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/profile.png')} 
            style={{ width: 40, height: 40 ,marginHorizontal:20,marginBottom:20,marginTop:15}} 
          />
          <Text style={{ fontSize: 20, fontWeight: '800',fontFamily:'Avenir-Black' }}>Welcome, {username}</Text>
        </View>
        {/* Notification icon on the right corner */}
        <IconButton
          icon="bell"
          size={30}
          onPress={() => {
            
          }}
          style={{ position: 'absolute', top: 10, right: 10 }}
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
            <Text style={styles.labelsTitle}>Nutrition Intake today</Text>
            <Text style={{fontWeight:'900',marginBottom:5,textAlign:'center',fontFamily:'Avenir-Black'}}>Calories: {totalNutrients.totalcalories} kcal</Text>
            <Text style={styles.label}>Protein: {totalNutrients.totalprotein} g</Text>
            <Text style={styles.label}>Carbs: {totalNutrients.totalcarbs} g</Text>
            <Text style={styles.label}>Fats: {totalNutrients.totalfats} g</Text>
            <Text style={styles.label}>Sugar: {totalNutrients.totalfats} g</Text>
          </View>
        </View>
      </View>

      {/* Circle Chart */}
      

      
      <View style={styles.container_2}>
        
        <ScrollView>
        
            
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{width: '45%', aspectRatio: 1, marginHorizontal: 10 }}>
            <Image source={require('../assets/diet.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 24 }} />
          </View>

          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <Button onPress={() => navigation.navigate('searchcali')} style={{ backgroundColor: '#c1e3b6', marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', color: 'black',fontFamily:'Avenir-Black' }}>Count Nutrients</Text>
          </Button>

            <View style={{ width: '45%', aspectRatio: 1, alignSelf: 'center',marginBottom:20 }}>
              <Image source={require('../assets/fire.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover'}} />
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
                        progress={0.3}
                        color="green"
                        style={{width:100}}
                    />
                    <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>2/5</Text>
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
                
                <View style={styles.progressBarContainer}>
                  <ProgressBar
                    progress={0.8}
                    color="green"
                    style={{width:100}}
                  />
                  <View style={styles.progressTextContainer}>
                    <Text style={styles.progressText}>3/5</Text>
                  </View>
                </View>
                </TouchableOpacity>
              </View>
            
        </View>
  

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
    backgroundColor: '#c1e3b6',
    padding: 5,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    flexDirection:'row',
    justifyContent:'space-between',
    marginHorizontal:2,
  },
  nutritionCard: {
    marginBottom: 20,
    backgroundColor: 'skyblue',
    padding: 20,
    borderRadius: 20,
    marginHorizontal:2,
  },
  circleChart: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
  },
  pieChart: {
    borderRadius: 10,
  },
  nutrientLabels: {
    justifyContent: 'center',
  },
  labelsTitle: {
    marginBottom: 10,
    fontWeight: '900',
    fontSize:18,
    fontFamily:'Avenir-Black'
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
    maxHeight: 100, 
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
    fontWeight:'600',
    fontFamily:'Avenir-Black',
  },
  card: {
    width: '45%', 
    aspectRatio: 1, 
    marginHorizontal: 10, 
    backgroundColor: '#c1e3b6',
    borderRadius: 24,
  },
  Cardicon: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent', 
    color: 'blue',
    
  },
  cardContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  cardText: {
    top: 60,
    left: 15,
    marginLeft: 5,
    color: '#030303',
    fontSize: 12,
    fontFamily:'Avenir-Black',
    
  },
  cardText2: {
    top: 70,
    left: 15,
    marginLeft: 5,
    color: '#030303',
    fontSize: 16,
    fontFamily:'Avenir-Black',
    fontWeight: '600',
  },
  progressBarContainer: {
    top: 80,
    left: 15,
    flexDirection: 'row',
    padding:5,
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginRight: 10, 
    padding:20,
  },
  progressTextContainer: {
    backgroundColor: '#f0f0f0', 
    paddingHorizontal: 5, 
    borderRadius: 10, 
    
  },
  progressText: {
    color: 'black', 
    fontFamily:'Avenir',
  },
  iconWrapper: {
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 50,
    padding: 10,
    shadowColor: 'red',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, 
    alignSelf:'center'
  },

});

export default HomeScreen;


