import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {Header, Overlay, SearchBar} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import {Loader} from '../../../components/loader/Loader';
import {
  Heaty_uf,
  Log_out,
  Rt_Arrow,
  Save,
  User,
} from '../../../constants/assets';
import {logout} from '../../../store/slices/userSlice';
import {Box, Text} from '../../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const Settings = ({navigation, getData}) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const dispatch = useDispatch();

  const settingsItems = [
    {
      id: 'accountCenter',
      label: 'Accounts Center',
      icon: <User />,
      screen: 'AccountCenter',
    },
    {id: 'saves', label: 'Saved', icon: <Save />, screen: 'MySaves'},
    {id: 'likes', label: 'Liked', icon: <Heaty_uf />, screen: 'LikedPosts'},
    {
      id: 'Archive',
      label: 'Archive',
      icon: <Icon name="timer-outline" color={'#262626'} size={28} />,
      screen: 'Archives',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <Log_out />,
      action: () => toggleOverlay(),
      textColor: 'red',
    },
  ];

  useEffect(() => {
    setFilteredItems(settingsItems);
  }, []);

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

  const handleSearch = query => {
    setSearchQuery(query);
    const filtered = settingsItems.filter(item =>
      item.label.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  return (
    <Box flex={1} backgroundColor="mainwhite">
      {loading ? (
        <Loader text={'Logging Out'} />
      ) : (
        <>
          <Header
            backgroundColor="white"
            statusBarProps={{
              hidden: true,
            }}
            leftContainerStyle={{flex: 3}}
            leftComponent={
              <Box gap={'m'} alignItems="center" flexDirection="row">
                <BackBtn onPress={() => navigation.goBack()} />
                <Text color={'mainblack'}>Settings and activity</Text>
              </Box>
            }
          />

          <>
            <SearchBar
              searchIcon={{
                name: 'search',
              }}
              clearIcon={{
                name: 'close',
              }}
              inputStyle={{fontSize: 14}}
              platform={Platform.OS === 'android' ? 'android' : 'ios'}
              placeholder="Search"
              onChangeText={handleSearch}
              value={searchQuery}
            />
            <Box padding={'m'} gap={'xl'}>
              {filteredItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    if (item.screen) {
                      navigation.navigate(item.screen);
                    } else if (item.action) {
                      item.action();
                    }
                  }}>
                  <Box flexDirection="row" justifyContent="space-between">
                    <Box flexDirection="row" alignItems="center" gap={'s'}>
                      {item.icon}
                      <Text fontSize={14} color={item.textColor || 'mainblack'}>
                        {item.label}
                      </Text>
                    </Box>
                    <Rt_Arrow />
                  </Box>
                </TouchableOpacity>
              ))}
            </Box>

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
              <Box padding="m" alignItems="center">
                <Text color={'mainblack'} marginBottom="m">
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
        </>
      )}
    </Box>
  );
};

export default Settings;
