import React from 'react';
import { View, Text,StyleSheet,SafeAreaView } from 'react-native';
import { SegmentedButtons, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const navigation = useNavigation();
    const [value, setValue] = React.useState('walk');
  
    const handleValueChange = (selectedValue) => {
      setValue(selectedValue);
      if (selectedValue === 'train') {
        navigation.navigate('savedfood');
      }
    };
  

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={handleValueChange}
        buttons={[
          { value: 'walk', label: 'Shop' },
          { value: 'train', label: 'Saved' },
          { value: 'drive', label: 'Explore' },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:100,
    flex: 1,
    alignItems: 'center',
  },
});

export default CartScreen;