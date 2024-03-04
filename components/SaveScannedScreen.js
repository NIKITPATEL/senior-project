import React,{useState,useEffect, useId} from 'react';
import { Avatar, Card, IconButton,Divider,Appbar } from 'react-native-paper';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Button,ScrollView,Image,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from './UserContext';
import { path } from './path';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'



const SaveScannedScreen = () => {
  const navigation = useNavigation();
    const {userId} = useUser();
    const [barcodeIds, setBarcodeIds] = useState([]);
    const [text, setText] = useState('Not yet scanned')
    const [brandName,setBrandName] = useState('');
    const [glutten,setGlutten] = useState('');
    const [ingredient,setIngredient] = useState("");
    
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchBarcodeIds = async () => {
            try {
                if (userId) {
                    // Fetch barcode IDs for the logged-in user ID using Axios
                    const response = await axios.get(path+`/savefood/${userId}`);
                    setBarcodeIds(response.data.barcodeIds);
                }
            } catch (error) {
                console.error('Error fetching barcode IDs:', error);
            }
        };

        fetchBarcodeIds();
    }, [userId]);

    console.log(barcodeIds);

    const handleCardPress = async (barcodeId) => {
        barcodeId = parseInt(barcodeId);
        console.log('Card Pressed',barcodeId);
        setModalVisible(true);
        
        try{
            const appId = 'c958ac11'; // Replace with your Nutritionix Application ID
            const apiKey = '7d5e826cc223699c79497f63d820cf0a'; // Replace with your Nutritionix API key
            const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/item/?upc=${barcodeId}`, {
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

        }catch(error){
            console.error('Error fetching data:', error.message);
        }


    }

    const handle_closemodal = () => {
        setModalVisible(!modalVisible)
        setIngredient("");
        setBrandName("");
    }

    const handleback = () => {
      navigation.goBack();
    }
    
    



return (
  <SafeAreaView>
    <Appbar.Header>
          <Appbar.BackAction onPress={handleback} />
          <Appbar.Content title='Dietary'/>
        </Appbar.Header>

        <View>
            {barcodeIds.map(barcodeId => (
                <TouchableOpacity key={barcodeId} onPress={() => handleCardPress(barcodeId)}>
                    <Card>
                        <Card.Title
                            title={barcodeId}
                            left={(props) => <Avatar.Icon {...props} icon="folder" />}
                            right={(props) => <IconButton {...props} icon="dots-vertical" />}
                        />
                    </Card>
                </TouchableOpacity>
            ))}
        </View>
        <View>
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
                    
                    <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handle_closemodal()}>
                        <Text style={styles.textStyle}>Close Modal</Text>
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


export default SaveScannedScreen;