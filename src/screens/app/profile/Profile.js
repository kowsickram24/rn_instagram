import {Avatar, Button, Divider} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Menu, New_story} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';

const Box = createBox();
const Text = createText();

const Profile = ({navigation, currentUser}) => {
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
            uri: currentUser?.profilepic,
          }}
        />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {currentUser?.posts.length}
            </Text>
            <Text variant={'ProInfo'}>Posts</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {currentUser?.followers.length}
            </Text>
            <Text variant={'ProInfo'}>Followers</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {currentUser?.followers.length}
            </Text>

            <Text variant={'ProInfo'}>Following</Text>
          </Box>
        </Box>
      </Box>
      <Box padding={'m'}>
        <Text variant={'userName'}>{currentUser?.username}</Text>
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
