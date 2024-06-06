import React, {useState, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../../../screens/auth/login';
import RegisterScreen from '../../../screens/auth/Register';
import BottomNavigator from '../../BottomTab/BottomTab';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={BottomNavigator} />
    </Stack.Navigator>
  );
};

export default AuthStack;
