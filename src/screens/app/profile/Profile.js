import {Avatar, Button, Header} from '@rneui/themed';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Menu} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
import {Box, Text} from '../../../theme';
import ProfileCard from '../../../components/card/profileCard';
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
      <ProfileCard
        onFollowersPress={() =>
          navigation.navigate('Reach', {screen: 'Followers', User: User})
        }
        followersCount={User?.followers.length}
        onFollowingPress={() =>
          navigation.navigate('Reach', {screen: 'Following', User: User})
        }
        followingCount={User?.following.length}
        Postcount={User?.posts.length}
        userAvatar={User?.avatar}
      />

      <Box padding={'m'}>
        {User?.username && (
          <Text fontSize={12} color={'mainblack'}>
            {User?.username}
          </Text>
        )}
        {User?.fullname && (
          <Text fontSize={12} color={'mainblack'}>
            {User?.fullname}
          </Text>
        )}
        {User?.bio && (
          <Text fontSize={12} color={'mainblack'}>
            {User?.bio}
          </Text>
        )}
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

      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
