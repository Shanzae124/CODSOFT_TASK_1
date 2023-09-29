import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../Screens/Home';
import Dashboard from '../Screens/Dashboard';
import TaskCreation from '../Screens/TaskCreation';

const Stack = createStackNavigator();
function Navigate() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TaskCreation"
        component={TaskCreation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Navigate;
