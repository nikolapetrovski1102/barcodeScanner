import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/Home';
import Scanner from './screens/Scanner';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const data = {
  "data":  '12345678',
  'type': 'Vrata',
  'photo': 'https://www.kraususa.com/media/wysiwyg/Kitchen_Sinks_undermount.jpg',
  'stock': 50,
  'price': 100
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Scanner" component={Scanner} initialParams={{ data }} />
      </Tab.Navigator>
    </NavigationContainer>
  );

} 
