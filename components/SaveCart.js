import React, { useState, useEffect } from 'react';
import { Avatar, Card, IconButton, Divider, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Image, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useUser } from './UserContext';
import { path } from './path';

const SaveCart = () => {
  const navigation = useNavigation();
  const { userId } = useUser();
  const [productNames, setProductNames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [image,setImage] = useState('');


  const handleDeleteItem = async (productName) => {
    try {
      //DELETE request to the backend to delete the item with the specified barcodeId
      await axios.delete(path+`/deletefood/${productName}`);
      // After deletion, fetch scanned foods again to update the front
      fetchScannedFoods();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    const fetchScannedFoods = async () => {
      try {
        // Fetch scanned foods using Axios
        const response = await axios.get(path + `/cartfood/${userId}`);
        console.log('Response from backend:', response.data); 
        setProductNames(response.data.scannedFoods);
        console.log(productNames)
      } catch (error) {
        console.error('Error fetching scanned foods:', error);
      }
    };

    fetchScannedFoods();
  }, [userId]);
  

  const handleCardPress = async (productName) => {
    setSelectedProductName(productName);
    setModalVisible(true);

    try {
      const appId = 'c958ac11'; 
      const apiKey = '7d5e826cc223699c79497f63d820cf0a'; 
      const response = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant/?query=${productName}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-app-id': appId,
          'x-app-key': apiKey,
        },
      });
      if (response.data && response.data.branded && response.data.common) {
        const product = response.data.branded
        
        [0];
        const name=  product.food_name;
        //const brandName = product.brand_name || 'Product Name Not Available';
        const ingredient = product.nf_ingredient_statement || 'Ingredient Not available';
        setImage(product.photo && product.photo.thumb);
      
        setIngredient(ingredient);

       
        setBrandName(name);
      } else {
        console.error('No data found for the scanned value.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProductName('');
    setBrandName('');
    setIngredient('');
  }

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title='Cart Items' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir-Black' }} />
      </Appbar.Header>

      <View style={{marginTop:10}}>
        {productNames.map(({ productname, barcodeid, photoid }, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(barcodeid)}>
            <Card style={{marginBottom:10}}>
              <Card.Title
                title={productname}
                titleStyle={{ fontWeight: '700',fontFamily:'Avenir-Black',fontSize:20 }}
                left={(props) => <Avatar.Image
                  source={{ uri: photoid }}
                  size={40} 
                  style={{ marginRight: 10 }} 
                />}
                right={(props) => <IconButton {...props} icon="delete" />}
              />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              {/* Product Image */}
              <Image source={{ uri: image }} style={styles.modalImage} />

              {/* Product Name */}
              <Text style={styles.brandName}>{brandName}</Text>

              {/* Ingredients */}
              <Divider style={{marginVertical:10,height:2}} />
              <Text style={styles.modalText}>Ingredients:</Text>
              <Text style={styles.ingredient}>{ingredient}</Text>

              {/* Close Button */}
              <Pressable style={[styles.button, styles.buttonClose]} onPress={handleCloseModal}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    height: '80%',
    width: '80%',
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
    fontWeight:'600',
    color:'white',
    fontFamily:'Avenir-Black'
  },
  ingredient: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight:'300',
    color:'white',
    fontFamily:'Avenir-Black'

  },
  glutten: {
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'orange',
  },
  modalImage: {
    width: '80%', 
    height: 200, 
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 10,
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.8,
    elevation: 5, 
  },
  brandName: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight:'900',
    color:'white',
    fontFamily:'Avenir-Black'
  },
});

export default SaveCart;
