import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Text, Animated,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { path } from './path';
import { useUser } from './UserContext';
import axios from 'axios';

const NutrientCalculator = () => {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [sugar, setSugar] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const navigation = useNavigation();
  const {userId} = useUser();

  const totalCalories = parseFloat(calories) || 0;

  const animation = new Animated.Value(0);

  const animateButton = async () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    try {
        
        const mealData = {
          userId: userId, 
          calories: calories,
          protein: protein,
          carbs: carbs,
          fats: fat,
          sugar: sugar, 
        };
    
        // Send a POST request to add the meal to the database
        const response = await axios.post(path + '/add-meal', mealData);
    
        
        console.log('Meal added:', response.data);
        Alert.alert('Meal added');
      } catch (error) {
        console.error('Error adding meal:', error);
      }
    
  };

  const buttonScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  const addButtonStyle = {
    transform: [{ scale: buttonScale }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Count Nutrients' titleStyle={{ fontWeight: 'bold' }}/>
        
      </Appbar>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Calories"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
          <TextInput
            style={styles.input}
            placeholder="Protein (g)"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />
          <TextInput
            style={styles.input}
            placeholder="Sugar (g)"
            keyboardType="numeric"
            value={sugar}
            onChangeText={setSugar}
          />
          <TextInput
            style={styles.input}
            placeholder="Fat (g)"
            keyboardType="numeric"
            value={fat}
            onChangeText={setFat}
          />
          <TextInput
            style={styles.input}
            placeholder="Carbs (g)"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
          />
        </View>
      </ScrollView>
      <TouchableOpacity onPress={animateButton} style={[styles.addButton, addButtonStyle]}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NutrientCalculator;
