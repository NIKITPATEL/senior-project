import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Camera } from 'expo-camera';
import { View, TouchableOpacity, Text,StyleSheet,Dimensions,Button,Modal,FlatList,Image,Alert} from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import { mode } from 'crypto-js';
//import { RNCamera } from 'react-native-camera';
import { path } from './path';
import { useUser } from './UserContext';

const TensorCamera = cameraWithTensors(Camera);

const OUTPUT_TENSOR_WIDTH =270;
const OUTPUT_TENSOR_HEIGTH =480;
const CAM_PREVIEW_WIDTH = Dimensions.get('window').width;
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / (9 /16);







const FoodAi = () => {

    const [tfReady,setTfReady] = useState(false);
    const rafId = useRef(null);
    const [model,setModel] = useState();
    const [hotDog,setHotDog] = useState(null);
    const [identifiedFood, setIdentifiedFood] = useState(null);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const {userId} = useUser();

    console.log('lllll',query);


    const handleSearch = async () => {

        console.log('Inside')
        try {
          const response = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', 
            {
              query: query
            },{
            headers: {
              'Content-Type': 'application/json',
              'x-app-id': 'c958ac11',
              'x-app-key': '7d5e826cc223699c79497f63d820cf0a',
            },
          });
          console.log('Nutrients: ',response.data.foods)
          setSearchResults(response.data.foods);
          console.log('output',searchResults)
        } catch (error) {
        }
      };


      const handleAddMeal = async (item) => {
        try {
          
          const mealData = {
            userId: userId, 
            calories: item.nf_calories || item.nf_calories_estimated || 0,
            protein: item.nf_protein || item.nf_protein_estimated || 0,
            carbs: item.nf_total_carbohydrate || item.nf_total_carbohydrate_estimated || 0,
            fats: item.nf_total_fat || item.nf_total_fat_estimated || 0,
            sugar: item.nf_sugars || item.nf_sugars_estimated || 0, 
          };
      
          
          const response = await axios.post(path + '/add-meal', mealData);
      
          
          console.log('Meal added:', response.data);
          Alert.alert('Meal added');
        } catch (error) {
          console.error('Error adding meal:', error);
        }
      };

      


    

    
    useEffect(() => {
        async function prepare() {
            await Camera.requestCameraPermissionsAsync();

            await tf.ready();

            const modelJson = require('../model/model.json');
            const modelWeights = require('../model/weights.bin');

            // remodels files from bunndle
            const model = await tf.loadLayersModel(bundleResourceIO(modelJson,modelWeights));
            setModel(model);
            //console.log(model)


            //Ready
            setTfReady(true);

        }
        prepare();
    },[]);

    useEffect(() => {
        return () => {
            if(rafId.current !=null && rafId.current !== 0) {
                cancelAnimationFrame(rafId.current);
                rafId.current = 0;

            }
        }

    },[]);

    useEffect(() => {
        if (query) {
          handleSearch();
        }
      }, [query]);
      

    // Handler that will be called when TensorCamera is ready
    const handleCameraStream = async (images,updatePreview,gl) => {
        // Get the tensor form each frame, and feeds this shit to the model 
        console.log('camera ready!');

        const loop = async () => {
            rafId.current =  requestAnimationFrame(loop);
            //console.log(Math.random());

            //tf.tidy to release memory automatically.
            tf.tidy(() => {
                //Normalize the tensor/image hgb data
                const imageTensor = images.next().value.expandDims(0).div(127.5).sub(1);


                // Teachable machine will rize the image in 224 x 224. But tfjs has utlitity for this.

                // Calculating the Y position to start croping the image.

                const f = (OUTPUT_TENSOR_HEIGTH - OUTPUT_TENSOR_WIDTH)/2/OUTPUT_TENSOR_HEIGTH;

                const cropped =  tf.image.cropAndResize(imageTensor,
                    //Boxes x = 0 y = f 
                    tf.tensor2d([f,0,1-f,1],[1,4]), [0],[224,224]);

                
                //Feeding tensor to the model and get results;
                const result = model.predict(cropped);

                //Getting Data from the result 
                const logits = result.dataSync();
                //console.log(logits);

                const highestProbIndex = logits.indexOf(Math.max(...logits));  
                const foodClasses = ["HotDog", "ChickenMarsala", "Hamburger", "Grilled Salmon","Omelette","Prime rib","Spaghetti"];
                setIdentifiedFood(foodClasses[highestProbIndex]);  

                

            })

        };
        
        
        loop();

    };

    const countNutr = () => {

        setModalVisible(true);
        setQuery(identifiedFood);
        
        
    }

    if(!tfReady) {
        return (
            <View style={styles.loadingMsg}>
                <Text>Loading ...</Text>
            </View>
        )
    }

    else {
    
    return (
        <View style={{ flex: 1,alignItems:'center',justifyContent:'center',position:'relative',width:CAM_PREVIEW_WIDTH,height:CAM_PREVIEW_HEIGHT }}>
            <TensorCamera
                style = {styles.camera}
                autorender = {true}
                type={Camera.Constants.Type.back}
                resizeWidth={OUTPUT_TENSOR_WIDTH}
                resizeHeight={OUTPUT_TENSOR_HEIGTH}
                resizeDepth={3}
                onReady={handleCameraStream}/>

            <View style={hotDog ? styles.resultContainer : styles.notHotDog}>
                <Text style={styles.resultText}>
                {identifiedFood ? identifiedFood : 'Identifying...'}
                </Text>
            </View>

            

            <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setQuery('');
              }}
              
            
           >
            <View style={styles.modalContainer}>
            <IconButton
                  icon="close"
                  size={30}
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                />
            {searchResults && searchResults.length > 0 ? (
                <FlatList
                data={searchResults}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                    <View style={styles.leftContent}>
                        <Text style={styles.foodName}>{item.food_name}</Text>
                        <Text style={{fontFamily:'Avenir'}}>Calories: {item.nf_calories||0}g</Text>
                        <Text style={{fontFamily:'Avenir'}}>Protein: {item.nf_protein || 0}g</Text>
                        <Text style={{fontFamily:'Avenir'}}>Carbs: {item.nf_total_carbohydrate || 0}g</Text>
                        <Text style={{fontFamily:'Avenir'}}>Fat: {item.nf_total_fat || 0}g</Text>
                        <Text style={{fontFamily:'Avenir'}}>Sugar: {item.nf_sugar || 0} g</Text>
                    </View>
                    <View style={styles.rightContent}>
                        <Image
                        source={{ uri: item.photo.thumb }}
                        style={styles.image}
                        />
                        <Text style={{marginTop:10,fontWeight:800,fontFamily:'Avenir-Black',fontSize:16}}>Total items: {item.serving_qty}</Text>
                        <Button mode='contained' title='Add Meal' style={{ backgroundColor: 'green',fontFamily:'Avenir-Black' }} onPress={() => handleAddMeal(item)} />
                        
                    </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <Text>Nothing Found</Text>
            )}
            </View>
        

          </Modal>

          <TouchableOpacity onPress={countNutr} style={styles.resultContainer}>
                <View >
                    <Text style={styles.resultText}>
                        Calculate
                    </Text>
                </View>

            </TouchableOpacity>

            
            
        </View>
        
    );
    }
};


const styles = StyleSheet.create({
    loadingMsg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f2f2f2', 
    },
    camera: {
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    resultContainer: {
      position: 'absolute',
      bottom: 20,
      left: '10%', 
      right: '10%', 
      zIndex: 100,
      padding: 20,
      borderRadius: 20,
      backgroundColor: '#4CAF50', 
    },
    notHotDog: {
      position: 'absolute',
      top: 100,
      left: '10%',
      right: '10%',
      zIndex: 100,
      padding: 20,
      borderRadius: 20,
      backgroundColor: '#F44336', 
      opacity: 0.9,
    },
    resultText: {
      fontSize: 24, 
      color: 'white',
      textAlign: 'center', 
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      paddingTop: 50, 
      paddingHorizontal: 20,
      backgroundColor: '#fff', 
    },
    closeButton: {
      alignSelf: 'flex-end',
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
      padding: 15,
      backgroundColor: '#feea99',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    leftContent: {
      flex: 1,
      marginRight: 10,
    },
    rightContent: {
      flex: 1,
      alignItems: 'center',
    },
    image: {
      width: 80,
      height: 80,
      resizeMode: 'cover',
      borderRadius: 5,
    },
    foodName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333', 
      marginBottom: 5,
    },
  });
  


export default FoodAi;
