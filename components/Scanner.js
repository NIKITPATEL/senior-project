import React, { useState, useEffect } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';

import axios, { all } from 'axios';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Button,ScrollView,Image } from 'react-native';

import { PaperProvider,Dialog,Card } from 'react-native-paper'; 





export default function Scanner () {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')
    const [brandName,setBrandName] = useState('');
    const [glutten,setGlutten] = useState('');
    const [ingredient,setIngredient] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

   
    const askForCameraPermission = () => {
        (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);
    
    /*
    const getFood = async () => {
        try {
        const appId = 'c958ac11'; // Replace with your Nutritionix Application ID
        const apiKey = '7d5e826cc223699c79497f63d820cf0a'; // Replace with your Nutritionix API key
        const upc = '0028400090858'; // Replace with the UPC you want to search

        const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item/?upc=${upc}`, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-app-id': appId,
            'x-app-key': apiKey,
            },
        });

        console.log(response.data);
        } catch (error) {
        console.error('Error fetching data:', error.message);
        }
            
    } */ ``
    // What happens when we scan the bar code
    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setModalVisible(true)
        try {
        const appId = 'c958ac11'; // Replace with your Nutritionix Application ID
        const apiKey = '7d5e826cc223699c79497f63d820cf0a'; // Replace with your Nutritionix API key
        const upc = encodeURIComponent(data);

        const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item/?upc=${upc}`, {
            headers: {
            'x-app-id': appId,
            'x-app-key': apiKey,
            },
        });

        if (response.data && response.data.foods) {
            const product = response.data.foods[0];
            const brandName = product.brand_name || 'Product Name Not Available';
            const ingredient = product.nf_ingredient_statement || 'Ingredient Not available';
            const allergn = product.nf_allergens;
            //const brand_image = product.
            console.log('Product Name:', brandName);
            console.log('Ingredients:',ingredient)
            const isGlutenFree = product.nf_ingredient_statement.toLowerCase().includes('Gluten free');
            setIngredient(ingredient)

            if (isGlutenFree) {
            console.log('This product is gluten-free.');
            setGlutten("Gluteen Free");
            
            
            } else {
            console.log('This product may contain gluten.');
            setGlutten("Not Glutten Free")
            }
            console.log('Allergn:',allergn);
            setBrandName(brandName)
            // Handle the product data as needed
        } else {
            console.error('No data found for the scanned value.');
        }
        } catch (error) {
        console.error('Error fetching data:', error.message);
        }

        
        setText(data)
        console.log('Type: ' + type + '\nData: ' + data)
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
    }




    return (
        <PaperProvider>
            <View style={styles.container}>
                <View style={styles.barcodebox}>
                
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: '100%', width: "100%" }} 
                    
                    />


                </View>
                <Text style={styles.maintext}>{text}</Text>
                <Text style={styles.maintext}>{brandName}</Text>
                {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
                
                {/*}Button title={'Foods'} onPress={getFood} />*/}
                

                {scanned && 
                   
                   <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}
                    >
                    
                        
                            <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView >
                                      { /*<Image style = {styles.modal_image}/>*/ }
                                    <View style={styles.card_view}>
                                        <Image style = {styles.modal_image}/>

                                        <View>
                                            <Text style={styles.ing}>{brandName}</Text>
                                        </View>
                                        

                                    </View>    
                                    

                                    
                                    
                                    
                                    
                                    <Text style={styles.modalText}>Ingredients:</Text>
                                    <Text style={styles.ing}>{ingredient}</Text>
                                    <Text style={styles.ing}>{glutten}</Text>

                                    <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={handle_closemodal}
                                    >
                                    <Text style={styles.textStyle}>Close Modal</Text>
                                    </Pressable>
                                </ScrollView>
                            </View>
                            </View>
                        
                        
                </Modal>

                
                }
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}>
                    <Text style={styles.textStyle}>Show Modal</Text>
                </Pressable>

            </View>
        </PaperProvider>

        
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    maintext: {
      fontSize: 16,
      margin: 20,
    },
    barcodebox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: "30%",
      width: "80%",
      overflow: 'hidden',
      borderRadius: 30,
      backgroundColor: 'tomato'
    },

    scan: {
        backgroundColor: 'tomato',
        color:'black'

    },
    modalView: {
        height: '90%',
        marginTop: 'auto',
        
        
        backgroundColor: '#E8EAF6',
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
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        fontSize:20,
        marginBottom: 20,
        textAlign: 'center',
      },
      ing: {
        fontSize:10,
        marginBottom: 50,
        textAlign: 'center',
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modal_image: {
        width:"40%",
        height:"80%",
        backgroundColor:'tomato',
        borderRadius:"10%"
      },
      card_view: {
        flexDirection: "row",
        justifyContent:'space-around',
        

      }
  });