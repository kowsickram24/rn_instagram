import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, Divider} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {Menu, New_story} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
const Box = createBox();
const Text = createText();

const Profile = ({navigation}) => {
  const user = useSelector(state => state.user.user);

  const [currentUser, setCurrentUser] = useState();

  const fetchUserData = async () => {
    try {
      const userDoc = await firestore()
        .collection('instagram')
        .where('email', '==', user.email)
        .get();

      if (!userDoc.empty) {
        const userDocRef = userDoc.docs[0].ref;
        const userDataSnapshot = await userDocRef.get();
        const userData = userDataSnapshot.data();
        setCurrentUser(userData);
        console.log(currentUser);
      } else {
        console.log('No matching documents.');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };
  useEffect(() => {
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
        marginVertical={'s'}
        justifyContent="space-evenly">
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
            <TouchableOpacity onPress={() => navigation.navigate('Reach')}>
              <Text variant={'ProCount'} textAlign="center">
                {currentUser?.followers.length}
              </Text>
              <Text variant={'ProInfo'}>Followers</Text>
            </TouchableOpacity>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity onPress={() => navigation.navigate('Reach')}>
              <Text variant={'ProCount'} textAlign="center">
                {currentUser?.following.length}
              </Text>
              <Text variant={'ProInfo'}>Following</Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <Box padding={'m'}>
        <Text variant={'userName'}>{currentUser?.username}</Text>
        <Text variant={'userName'}>{currentUser?.bio}</Text>
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
      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
