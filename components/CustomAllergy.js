import React, { useState,useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Button, StyleSheet,Alert } from 'react-native';
import { Appbar } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useUser } from './UserContext';
import { path } from './path';



const nutrientOptions = [
  { label: 'Protein', value: 'protein' },
  { label: 'Carbs', value: 'carbs' },
  { label: 'Sugar', value: 'sugar' },
  { label: 'Fiber', value: 'fiber' },
  { label: 'Calories', value: 'calories' },
];

const CustomAllergy = () => {

  const [selectedNutrient, setSelectedNutrient] = useState('');
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(10); // Initial max value
  const navigation = useNavigation();
  const {userId} = useUser();
  const [userNutrients, setUserNutrients] = useState([]);

  

  const fetchUserNutrients = async () => {
    try {
      const response = await axios.get(path+`/user-nutrients/${userId}`);
      setUserNutrients(response.data);
    } catch (error) {
      console.error('Error fetching user nutrients:', error);
    }
  };
  useEffect(() => {
    fetchUserNutrients();
  }, []);

  const handleSave = async () => {
    try {
      console.log('Nutrients: ',selectedNutrient);
      await axios.post(path+'/user-nutrients', {
        userId: userId,
        nutrient_name: selectedNutrient,
        nutrient_min: minValue,
        nutrient_max: maxValue,
      });
      Alert.alert('Nutrients modified. Thank you!')
    } catch (error) {
      console.error('Error adding user nutrient:', error);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title='Custom Nutrients' titleStyle={{ fontWeight: 'bold',fontFamily:'Avenir' }}/>
      </Appbar>
      <Text style={styles.sectionTitle}>User Nutrients</Text>
      <ScrollView>
        <View style={styles.section}>
          {userNutrients.map((nutrient, index) => (
            <View key={index} style={styles.nutrientContainer}>
              <Text style={styles.nutrientName}>{nutrient.nutrient_name}</Text>
              <Text style={{fontWeight:'300',fontFamily:'Avenir'}}>Min: {nutrient.nutrient_min}, Max: {nutrient.nutrient_max}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <ScrollView>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Nutrient</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedNutrient}
              onValueChange={(itemValue, itemIndex) => setSelectedNutrient(itemValue)}
            >
              {nutrientOptions.map((option, index) => (
                <Picker.Item key={index} label={option.label} value={option.value} />
              ))}
            </Picker>

          </View>
        </View>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Minimum Value(in grams)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={minValue}
              onValueChange={(itemValue, itemIndex) => setMinValue(itemValue)}
            >
              {Array.from({ length: 10000 }, (_, index) => index + 1).map((value) => (
                <Picker.Item key={value} label={value.toString()} value={value} />
              ))}
          </Picker>

          </View>
        </View>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Maximum Value(in grams)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={maxValue}
              onValueChange={(itemValue, itemIndex) => setMaxValue(itemValue)}
            >
              {Array.from({ length: 10000}, (_, index) => index + 1).map((value) => (
                <Picker.Item key={value} label={value.toString()} value={value} />
              ))}
            </Picker>

          </View>
        </View>
      </ScrollView>
      <Button title="Save" mode='contained' onPress={handleSave} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft:10,
    fontFamily:'Avenir'
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nutrientContainer: {
    backgroundColor: 'yellow',
    borderRadius: 20, 
    padding: 16,
    marginVertical: 8,
    width: '45%', 
    
    elevation: 5,
    
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
    fontFamily:'Avenir'
  },
  section2: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily:'Avenir'
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  picker: {
    height: 40, 
  },
});

export default CustomAllergy;
