import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Divider } from '@rneui/themed';
import { createBox, createText } from '@shopify/restyle';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Menu, New_story } from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';


const Box = createBox();
const Text = createText();

const Profile = ({navigation}) => {
const [currentuser,setCurrentuser] = useState(null) 


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          console.log(user)
          setCurrentuser(JSON.parse(user));
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
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box padding={'s'} alignSelf="flex-end">
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Menu />
        </TouchableOpacity>
      </Box>
      <Box
        flexDirection="row"
        marginVertical={'m'}
        justifyContent="space-around">
        <Avatar
          avatarStyle={{borderRadius: 40}}
          containerStyle={{width: 80, height: 80}}
          source={{
            uri: currentuser?.profilepic,
          }}
        />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              200
            </Text>
            <Text variant={'ProInfo'}>Posts</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              100K
            </Text>
            <Text variant={'ProInfo'}>Followers</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              2
            </Text>
            <Text variant={'ProInfo'}>Following</Text>
          </Box>
        </Box>
      </Box>
      <Box padding={'m'}>
        <Text variant={'userName'}>{currentuser?.username}</Text>
      </Box>
      <Box padding={'s'}>
        <Button
          onPress={() => navigation.navigate('EditProfile')}
          title={'Edit Profile'}
          containerStyle={{
            borderWidth: 0.5,
            borderRadius: 10,
            marginVertical: 6,
          }}
          titleStyle={{color: '#000'}}
          buttonStyle={{
            backgroundColor: '#ffffff',
          }}
        />
      </Box>
      <Box padding={'s'}>
        <New_story />
        <Text color={'mainblack'}> New</Text>
      </Box>
      <Divider />
      <TopNavigator />
    </Box>
  );
};

export default Profile;
