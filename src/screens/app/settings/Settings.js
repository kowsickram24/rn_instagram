import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {Header, Overlay} from '@rneui/themed';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import ToastManager from 'toastify-react-native';
import {Loader} from '../../../components/loader/Loader';
import {Button} from 'react-native-paper';
import {
  Back,
  Heaty_uf,
  Log_out,
  Rt_Arrow,
  Save,
} from '../../../constants/assets';
import {logout} from '../../../store/slices/userSlice';
import BackBtn from '../../../components/buttons/backButton';
import {Box, Text} from '../../../theme';

const Settings = ({navigation, getData}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('user');
      dispatch(logout());
      await getData();
    } catch (error) {
      console.error('Error logging out: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} gap={'m'} backgroundColor="mainwhite">
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          <Box gap={'m'} alignItems="center" flexDirection="row">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}> Settings </Text>
          </Box>
        }
      />
      {loading ? (
        <Loader text={'Logging Out'} />
      ) : (
        <>
          <Box padding={'m'} gap={'xl'}>
            <ToastManager position={'top'} />
            <Text color={'mainblack'}>Settings and Privacy</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountCenter')}>
              <Box flexDirection="row" justifyContent="space-between">
                <Text fontSize={14} color={'mainblack'}>
                  Accounts Center
                </Text>
                <Rt_Arrow />
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MySaves')}>
              <Box flexDirection="row" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" gap={'s'}>
                  <Save />
                  <Text fontSize={14} color={'mainblack'}>
                    Saves
                  </Text>
                </Box>
                <Rt_Arrow />
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('LikedPosts')}>
              <Box flexDirection="row" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" gap={'s'}>
                  <Heaty_uf />
                  <Text fontSize={14} color={'mainblack'}>
                    Likes
                  </Text>
                </Box>
                <Rt_Arrow />
              </Box>
            </TouchableOpacity>
            <Box>
              <TouchableOpacity onPress={toggleOverlay}>
                <Box flexDirection="row" alignItems="center" gap={'s'}>
                  <Log_out />
                  <Text fontSize={14} color={'red'}>
                    Logout
                  </Text>
                </Box>
              </TouchableOpacity>
            </Box>
          </Box>

          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Box padding="m" alignItems="center">
              <Text variant="body" marginBottom="m">
                Are you sure you want to logout?
              </Text>
              <Box flexDirection="row" gap="m">
                <Button onPress={toggleOverlay}> Cancel </Button>
                <Button textColor="red" mode="text" onPress={handleLogout}>
                  Logout
                </Button>
              </Box>
            </Box>
          </Overlay>
        </>
      )}
    </Box>
  );
};

export default Settings;
