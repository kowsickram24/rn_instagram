import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBox, createText} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../../store/slices/userSlice';

const Box = createBox();
const Text = createText();

const Settings = ({navigation}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      dispatch(logout());

      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <Box flex={1} padding={'m'} backgroundColor={'mainwhite'}>
      <Text>Settings and Privacy</Text>
      <Box flex={1}>
        <Text>Accounts Center</Text>
        <Box>
          <TouchableOpacity onPress={handleLogout}>
            <Text variant={'Logout'}>Logout</Text>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
