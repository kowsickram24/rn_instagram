import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBox, createText} from '@shopify/restyle';
import {logout} from '../../../store/slices/userSlice';
import {Back} from '../../../constants/assets';
import auth from '@react-native-firebase/auth';
import {Overlay, Button, Header} from '@rneui/themed';
import ToastManager, {Toast} from 'toastify-react-native';
import {Loader} from '../../../components/loader/Loader';

const Box = createBox();
const Text = createText();

const Settings = ({navigation, getData}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLogout = async () => {
    setLoading(true); // Show loader
    try {
      await auth().signOut();
      Toast.success('Logged out');
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      await getData();
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error logging out: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} gap={'m'} backgroundColor="mainwhite">

      <Header
      backgroundColor='white'
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box gap={'m'}  alignItems='center' flexDirection='row'> 
            <Back />
            <Text color={'mainblack'}> Settings  </Text>
          </Box>
          </TouchableOpacity>
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box padding={'m'} gap={'xl'}>
            <ToastManager position={'top'} />
            <Text color={'mainblack'}>Settings and Privacy</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountCenter')}>
              <Text color={'mainblack'}>Accounts Center</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MySaves')}>
              <Text color={'mainblack'}>My Saves</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate('MySaves')}> */}
              <Text color={'mainblack'}>Liked Posts</Text>
            {/* </TouchableOpacity> */}
            <Box>
              <TouchableOpacity onPress={toggleOverlay}>
                <Text variant="Logout">Logout</Text>
              </TouchableOpacity>
            </Box>
          </Box>

          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Box padding="m" alignItems="center">
              <Text variant="body" marginBottom="m">
                Are you sure you want to logout?
              </Text>
              <Box flexDirection="row" gap="m">
                <Button title="Cancel" onPress={toggleOverlay} />
                <Button
                  buttonStyle={{backgroundColor: 'red'}}
                  title="Logout"
                  onPress={handleLogout}
                />
              </Box>
            </Box>
          </Overlay>
        </>
      )}
    </Box>
  );
};

export default Settings;
