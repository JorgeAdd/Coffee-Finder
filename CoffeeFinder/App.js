import React,{Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  YellowBox,
  View,
  Image
} from 'react-native';
import {Root} from 'native-base';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ListScreen from './src/components/ListScreen';
import Details from './src/components/Details';

const Stack = createStackNavigator();

export default class App extends Component {
  render(){ 
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions ={{headerShown: false}}>
          <Stack.Screen name="ListScreen" component={ListScreen}/>
          <Stack.Screen name="Details" component={Details}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
