import React,{useState} from 'react';
import { View, Text, Image, StyleSheet,SafeAreaView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';

const CartItem = ({ image, productName,onPress }) => {
  const [isClickedHeart, setIsClickedHeart] = useState(false);
  const [isClickedCart, setIsClickedCart] = useState(false);

  const handleHeartPress = () => {
    setIsClickedHeart(!isClickedHeart);
  };
  const handleCartPress = async (itemId) => {
    setIsClickedCart(!isClickedCart);
    

  };

  

  
  return (
    
        <View style={styles.container}>
            
            <View style={styles.imageContainer}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>

            
            <Text style={styles.productName}>{productName}</Text>

            
            <View style={styles.actionButtons}>
            <IconButton
              icon="heart"
              size={20}
              iconColor={isClickedHeart ? 'green' : 'pink'}
              onPress={handleHeartPress}
            />
    

              
              <IconButton 
              icon="cart" 
              size={20} 
              iconColor={isClickedCart ? 'green' : 'grey'} 
              onPress={onPress}
               />
            </View>
        </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd', 
    borderRadius: 10, 
    backgroundColor: '#fff', 
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 },  
    elevation: 3, 
  },
  imageContainer: {
    aspectRatio: 1, 
    overflow: 'hidden', 
    borderRadius: 10, 
  },
  image: {
    width: '100%',
    height: '100%', 
    resizeMode: 'cover',
  },
  productName: {
    
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', 
    fontFamily:'Avenir'
    
  },
  actionButtons: {
    
    flexDirection: 'row',
    justifyContent:'space-between',
    
    paddingHorizontal: 10, 
    
    
  },
});

export default CartItem;
