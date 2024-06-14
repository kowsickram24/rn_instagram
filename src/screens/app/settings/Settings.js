import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBox, createText} from '@shopify/restyle';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../../store/slices/userSlice';
import {Back} from '../../../constants/assets';
import auth from '@react-native-firebase/auth';
const Box = createBox();
const Text = createText();

const Settings = ({navigation, getData}) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await auth()
        .signOut()
        .then(() => console.log('User signed out!'));
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      await getData();
      navigation.replace('Auth');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <Box flex={1} padding="m" gap={'m'} backgroundColor="mainwhite">
      <Box flexDirection="row" alignItems="center" gap={'m'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'}>Settings and Privacy</Text>
      </Box>
      <Text color={'mainblack'}>Settings and Privacy</Text>
      <Text color={'mainblack'}>Accounts Center</Text>
      <TouchableOpacity onPress={() => navigation.navigate('MySaves')}>
        <Text color={'mainblack'}>My Saves</Text>
      </TouchableOpacity>
      <Box>
        <TouchableOpacity onPress={handleLogout}>
          <Text variant="Logout">Logout</Text>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default Settings;
