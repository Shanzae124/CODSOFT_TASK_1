import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigate from './src/Navigation/Navigate';

const App = () => {
  return (
    <NavigationContainer>
      <Navigate />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
