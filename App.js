import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Scanner from './components/Scanner';

const scan = () => <Scanner/>;

const home = () => <Text>Home</Text>

const cart = () => <Text>Cart</Text>;

const explore = () => <Text>Explore</Text>;

const profile = () => <Text>Profile</Text>;

const App = () => {
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

export default App;