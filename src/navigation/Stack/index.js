import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import AuthStack from './Auth/AuthStack';
import UserStack from './User/UserStack';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          console.log(user);
          setUser(JSON.parse(user));
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="User" component={UserStack} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
