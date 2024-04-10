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
        <Appbar.Content title='Dietary'/>
      </Appbar>
      <Text style={styles.sectionTitle}>User Nutrients</Text>
      <ScrollView>
        <View style={styles.section}>
          {userNutrients.map((nutrient, index) => (
            <View key={index} style={styles.nutrientContainer}>
              <Text style={styles.nutrientName}>{nutrient.nutrient_name}</Text>
              <Text>Min: {nutrient.nutrient_min}, Max: {nutrient.nutrient_max}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <ScrollView>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Nutrient</Text>
          <Picker
            selectedValue={selectedNutrient}
            onValueChange={(itemValue, itemIndex) => setSelectedNutrient(itemValue)}
          >
            {nutrientOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Minimum Value(in grams)</Text>
          <Picker
            selectedValue={minValue}
            onValueChange={(itemValue, itemIndex) => setMinValue(itemValue)}
          >
            {Array.from({ length: 10000 }, (_, index) => index + 1).map((value) => (
              <Picker.Item key={value} label={value.toString()} value={value} />
            ))}
          </Picker>
        </View>
        <View style={styles.section2}>
          <Text style={styles.sectionTitle2}>Select Maximum Value(in grams)</Text>
          <Picker
            selectedValue={maxValue}
            onValueChange={(itemValue, itemIndex) => setMaxValue(itemValue)}
          >
            {Array.from({ length: 10000}, (_, index) => index + 1).map((value) => (
              <Picker.Item key={value} label={value.toString()} value={value} />
            ))}
          </Picker>
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
  section: {
    paddingLeft:20,
    paddingVertical:5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',

    marginLeft:10,
  },
  nutrientContainer: {
    marginBottom: 8,
  },
  nutrientName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  section2: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default CustomAllergy;
