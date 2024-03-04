import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Appbar, Avatar,IconButton } from 'react-native-paper';

const Allergy = () => {
    const navigation = useNavigation();
    const [flashing, setFlashing] = useState('');

    const handleback = () => {
        navigation.goBack();
    }

    // Initialize state to track allergen tolerance levels
    const [allergenTolerance, setAllergenTolerance] = useState({});
    

    // Function to handle avatar clicks and update tolerance level
    const handleToleranceChange = (name) => {
        setAllergenTolerance((prevState) => {
            const currentTolerance = prevState[name] || ''; // Get current tolerance level or initialize with an empty string
            switch (currentTolerance) {
              case '':
                return { ...prevState, [name]: 'low' };
              case 'low':
                return { ...prevState, [name]: 'moderate' };
              case 'moderate':
                return { ...prevState, [name]: 'high' };
              default:
                return { ...prevState, [name]: '' }; // Reset to no color
            }
          });
 
    }
    

    const allergy = [
        { name: 'Eggs', icon: 'egg' },
        { name: 'Fish', icon: 'fish' },
        { name: 'Milk', icon: 'glass-milk' },
        { name: 'Onions', icon: 'food-onion' },
        { name: 'Wheat', icon: 'wheat' },
        { name: 'Corn', icon: 'corn' },
        { name: 'Peanut', icon: 'peanut' },
    ]

    
    return (
        <SafeAreaView>
            <View>
                <Appbar.Header>
                    <Appbar.BackAction onPress={handleback} />
                </Appbar.Header>
                <ScrollView style={styles.scroll}>
                    <View style={styles.container}>
                        {allergy.map(({ name, icon }, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleToleranceChange(name)}
                                style={[
                                    styles.avatarContainer,
                                    allergenTolerance[name] === 'low' && styles.lowTolerance,
                                    allergenTolerance[name] === 'moderate' && styles.moderateTolerance,
                                    allergenTolerance[name] === 'high' && styles.highTolerance,
                                ]}
                            >
                                <View style={styles.content}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.name}>{name}</Text>
                                    </View>
                                    <Avatar.Icon icon={icon} size={24} style={styles.icon} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    scroll: {
        height: '70%',
      },
      container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        margin: 5,
      },
      avatarContainer: {
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 10,
        padding: 5,
        borderColor: '#ccc',
        width: Dimensions.get('window').width / 2 - 10,
      },
      lowTolerance: {
        borderColor: 'green',
      },
      moderateTolerance: {
        borderColor: 'yellow',
      },
      highTolerance: {
        borderColor: 'red',
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      },
      textContainer: {
        flex: 1,
      },
      name: {
        fontSize: 12,
        textAlign: 'left',
      },
      icon: {
        backgroundColor: 'black', // Remove background color of the icon
      },
    
});

export default Allergy;
