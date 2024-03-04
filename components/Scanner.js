import React, { useState, useEffect } from 'react';

import { BarCodeScanner } from 'expo-barcode-scanner';

import axios, { all } from 'axios';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Button,ScrollView,Image} from 'react-native';

import { PaperProvider,Dialog,Divider } from 'react-native-paper'; 

import { useUser } from './UserContext';
import { path } from './path';





export default function Scanner () {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet scanned')
    const [brandName,setBrandName] = useState('');
    const [glutten,setGlutten] = useState('');
    const [ingredient,setIngredient] = useState("");
    const [barcodeNumber,setBarcodeNumber] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const {userId} = useUser();

   
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

        console.log(response.data);
        } catch (error) {
        console.error('Error fetching data:', error.message);
        }
            
    } */ 
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
             
                const productId = product[0].code;
                console.log('Id:',productId);
                
              const productName = product.product_name || 'Product Name Not Available';
              const ingredients = product.ingredients_text;
              console.log('Product Name:', brandName);
              setBrandName(productName)
              setIngredient(ingredients)
              const ingredientStatement = product.ingredients_text.toLowerCase();

              // Check if the ingredient statement contains "gluten free"
              const isGlutenFree = ingredientStatement.includes('gluten free');

              if (isGlutenFree) {
                  console.log('This product is gluten-free.');
                  setGlutten("Gluten Free");
              } else {
                  console.log('This product may contain gluten.');
                  setGlutten('Not Gluten Free')
              }
              
              //console.log('Allergn:',allergn);
              //etBrandName(productName)
            }*/
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
    }
    




    return (
        <PaperProvider>
          <View style={styles.container}>
            <View style={styles.barcodeBox}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
            <Text style={styles.mainText}>{text}</Text>
            {scanned && <Button title="Scan Again" onPress={() => setScanned(false)} color="tomato" />}

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
              
              
                <View style={styles.centeredView}>
                
                  <View style={styles.modalView}>
                  <ScrollView>
                    <Image style={styles.modalImage} />
                    <Text style={styles.brandName}>{brandName}</Text>
                    <Divider />
                    <Text style={styles.modalText}>Ingredients:</Text>
                    <Text style={styles.ingredient}>{ingredient}</Text>
                    <Text style={styles.glutten}>{glutten}</Text>
                    <Button title='Save' onPress={saveScannedProduct} />
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handle_closemodal()}>
                      <Text style={styles.textStyle}>Close Modal</Text>
                    </Pressable>
                    </ScrollView>
                  </View>
                  
                </View>
              
            </Modal>
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
  barcodeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
    width: '80%',
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato',
  },
  mainText: {
    fontSize: 16,
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height: '90%',
    width: '80%',
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
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  ingredient: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  glutten: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor:'orange'
  },
  modalImage: {
    width: '40%',
    height: '20%',
    backgroundColor: 'tomato',
    borderRadius: 10,
  },
  brandName: {
    fontSize: 24,
    textAlign: 'center',
  },
});