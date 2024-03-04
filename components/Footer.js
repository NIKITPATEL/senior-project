import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import Profile from './Profile';
import Scanner from './Scanner';
import { NavigationContainer } from '@react-navigation/native';
import CartScreen from './CartScreen';





const scan = () => <Scanner />;

const home = () => <Text>Home</Text>

const cart = () => <CartScreen/>;

const explore = () => <Text>Profile</Text>;

const profile = () => <Profile />;



const Footer = () => {
  const navigationRef = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home_main', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'food_cart', title: 'Cart', focusedIcon: 'cart' },
    { key: 'scanner', title: 'Scan', focusedIcon: 'barcode-scan'},
    { key: 'explore_more', title: 'Explore', focusedIcon: 'compass-rose' },
    { key: 'profile_setting', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home_main:home,
    scanner: scan,
    food_cart: cart,
    explore_more: explore,
    profile_setting: profile,
  });

  return (
    <SafeAreaProvider>
      
        <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        />
      

        

    

      
    </SafeAreaProvider>
  );
};

export default Footer;