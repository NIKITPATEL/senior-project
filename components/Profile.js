import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  Button,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { NavigationContainerRef } from '@react-navigation/native';
import DietaryScreen from './DietaryScreen';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useUser } from './UserContext';



const SECTIONS = [
  {
    header: 'Preferences',
    icon: 'settings',
    items: [
      { label: 'Language', value: 'English', type: 'input' },
      { label: 'Dark Mode', value: false, type: 'boolean' },
      { label: 'Use Wi-Fi', value: true, type: 'boolean' },
      { label: 'Location', value: 'Los Angeles, CA', type: 'input' },
      { label: 'Show collaborators', value: true, type: 'boolean' },
      { label: 'Accessibility mode', value: false, type: 'boolean' },
    ],
  },
  {
    header: 'Edit Dietary',
    icon: 'help-circle',
    items: [
        { label: 'Diet' },
        { label: 'Allergies'},
        { label: 'Custom Nutrients' },
        { label: 'More' },
    ],
  },
  {
    header: 'Content',
    icon: 'align-center',
    items: [
      { label: 'Item 1', type: 'link' },
      { label: 'Item 2', type: 'input', value: 'Value' },
      { label: 'Item 3', type: 'boolean', value: true },
      { label: 'Item 4', type: 'boolean', value: false },
      { label: 'Item 5', type: 'link' },
    ],
  },
];

export default function Profile() {
  const [value, setValue] = React.useState(0);
  const{username,userEmail} = useUser();
  const navigation = useNavigation();
  



  const { tabs, items } = React.useMemo(() => {
    return {
      tabs: SECTIONS.map(({ header, icon }) => ({
        name: header,
        icon,
      })),
      items: SECTIONS[value].items,
    };
  }, [value]);

  return (
    <SafeAreaView style={{ backgroundColor: '#f8f8f8', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.profile}>
          <View style={styles.profileHeader}>
            <Image
              alt=""
              source={require('../assets/profile.png')}
              style={styles.profileAvatar} />

            <View>
              
              
              <Text style={styles.profileName}>{username}</Text>

              <Text style={styles.profileHandle}>{userEmail}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <View style={styles.profileAction}>
              <Text style={styles.profileActionText}>Edit Profile</Text>

              <FeatherIcon color="#fff" name="edit-3" size={16} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.tabs}>
            {tabs.map(({ name, icon }, index) => {
              const isActive = index === value;

              return (
                <View
                  key={name}
                  style={[
                    styles.tabWrapper,
                    isActive && { borderBottomColor: '#6366f1' },
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setValue(index);
                    }}>
                    <View style={styles.tab}>
                      <FeatherIcon
                        color={isActive ? '#6366f1' : '#6b7280'}
                        name={icon}
                        size={16} />

                      <Text
                        style={[
                          styles.tabText,
                          isActive && { color: '#6366f1' },
                        ]}>
                        {name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {items.map(({ label, type, value }, index) => {
            return (
              <View
                key={label}
                style={[
                  styles.rowWrapper,
                  index === 0 && { borderTopWidth: 0 },
                ]}>
                
                <TouchableOpacity
                  onPress={() => {
                    switch (label) {
                      case 'Diet':
                        navigation.navigate('dietary');
                        break;
                       
                      case 'Allergies':
                        navigation.navigate('allergy');
                        break;
                       
                      case 'Custom Nutrients':
                        navigation.navigate('customAllergy');
                        break;
                      
                      case 'More':
                        navigation.navigate('nutrientcalcul');
                        break;
                        
                      
                    }
                  }}>
                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>{label}</Text>

                    <View style={styles.rowSpacer} />


                    {type === 'input' && (
                      <Text style={styles.rowValue}>{value}</Text>
                    )}

                    {type === 'boolean' && (
                      <Switch trackColor={{ true: '#007bff' }} value={value} />
                    )}

                    {(type === 'input' || type === 'link') && (
                      <FeatherIcon
                        color="#7f7f7f"
                        name="chevron-right"
                        size={20} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  content: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  tabs: {
    padding: 16,
    flexDirection: 'row',
  },
  /** Profile */
  profile: {
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3d3d3d',
  },
  profileHandle: {
    marginTop: 4,
    fontSize: 15,
    color: '#989898',
  },
  profileAction: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  /** Tab */
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  tabWrapper: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderColor: '#e5e7eb',
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 5,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adjust this based on your layout needs
    height: 50,
    paddingLeft: 24,
    paddingRight: 24,
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: '#e3e3e3',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2c2c2c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7f7f7f',
    marginRight: 4,
  },
});