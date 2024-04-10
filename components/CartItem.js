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
            {/* Product image */}
            <View style={styles.imageContainer}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>

            {/* Product name */}
            <Text style={styles.productName}>{productName}</Text>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
            <IconButton
              icon="heart"
              size={20}
              iconColor={isClickedHeart ? 'green' : 'pink'}
              onPress={handleHeartPress}
            />
    

              {/* Cart icon */}
              <IconButton 
              icon="cart" 
              size={20} 
              iconColor={isClickedCart ? 'green' : 'grey'} 
              onPress={onPress} />
            </View>
        </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%', // Adjust the width to fit three items in a row
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd', // Border color
    borderRadius: 10, // Border radius
    backgroundColor: '#fff', // Background color
    shadowColor: '#000', // Shadow color
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 5, // Shadow radius
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    elevation: 3, // Elevation for Android
  },
  imageContainer: {
    aspectRatio: 1, // Maintain aspect ratio for square image container
    overflow: 'hidden', // Ensure image doesn't overflow the container
    borderRadius: 10, // Apply border radius to image container
  },
  image: {
    width: '100%',
    height: '100%', // Make image fill the square container
    resizeMode: 'cover',
  },
  productName: {
    
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text
    
  },
  actionButtons: {
    
    flexDirection: 'row',
    justifyContent:'space-between',
    //marginTop: 5,
    paddingHorizontal: 10, // Add horizontal padding
    
    
  },
});

export default CartItem;
