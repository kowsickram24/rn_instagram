import {Avatar, Button, Header} from '@rneui/themed';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Menu} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
import {Box, Text} from '../../../theme';
const Profile = ({navigation, User}) => {
  console.log('User: ', User);

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Menu />
          </TouchableOpacity>
        }
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
      />
      <Box
        flexDirection="row"
        marginVertical={'s'}
        justifyContent="space-around">
        <Avatar
          rounded
          size={'large'}
          source={{
            uri: User?.avatar,
          }}
        />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text color={'mainblack'} fontSize={20} textAlign="center">
              {User?.posts.length}
            </Text>
            <Text color={'mainblack'} fontSize={12}>
              posts
            </Text>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Reach', {User: User})}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {User?.followers.length}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                followers
              </Text>
            </TouchableOpacity>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Reach', {User: User})}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {User?.following.length}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                following
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <Box padding={'s'}>
        <Text fontSize={12} color={'mainblack'}>
          {User?.username}
        </Text>
        <Text fontSize={12} color={'mainblack'}>
          {User?.fullname}
        </Text>
        <Text fontSize={12} color={'mainblack'}>
          {User?.bio}
        </Text>
      </Box>
      <Box padding={'s'}>
        <Button
          onPress={() => navigation.navigate('EditProfile', User)}
          title={'Edit Profile'}
          containerStyle={{
            borderRadius: 10,
            marginVertical: 6,
          }}
          titleStyle={{color: '#000', fontWeight: '100', fontSize: 14}}
          buttonStyle={{
            backgroundColor: 'lightgrey',
          }}
        />
      </Box>
      {/* <Box padding={'s'}>
        <New_story />
        <Text color={'mainblack'}>New</Text>
      </Box>
      <Divider /> */}
      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
