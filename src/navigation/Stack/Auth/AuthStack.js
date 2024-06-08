import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import LoginScreen from '../../../screens/auth/login';
import RegisterScreen from '../../../screens/auth/Register';

const Stack = createNativeStackNavigator();

const AuthStack = ({fetchUserData}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login">
        {props => <LoginScreen {...props} getData={fetchUserData} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {props => <RegisterScreen {...props} getData={fetchUserData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
