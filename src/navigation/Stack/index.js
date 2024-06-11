import AsyncStorage from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import AuthStack from './Auth/AuthStack';
import UserStack from './User/UserStack';
const Stack = createNativeStackNavigator();
import {useDispatch} from 'react-redux';
import {login} from '../../store/slices/userSlice';

const StackNavigator = () => {
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();

  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');

      if (user) {
        setUser(JSON.parse(user));
        dispatch(login(JSON.parse(user)));
      } else {
        console.log('No user data found');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (initializing) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <Stack.Screen name="User">
          {props => <UserStack {...props} getData={fetchUserData} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Auth">
          {props => <AuthStack {...props} fetchUserData={fetchUserData} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
