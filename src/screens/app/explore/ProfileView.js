import firestore from '@react-native-firebase/firestore';
import { Avatar, Button, Divider } from '@rneui/themed';
import { createBox, createText } from '@shopify/restyle';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ProfileTab from '../../../navigation/TopTab/ProfileTab';
const Box = createBox();
const Text = createText();
const ProfileView = ({route, navigation}) => {
  const {userId} = route.params;
  const [selecteduser, setSelecteduser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const userDoc = await firestore()
        .collection('instagram')
        .doc(userId)
        .get();
      if (userDoc.exists) {
        setSelecteduser(userDoc.data());
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  if (!selecteduser) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
        <Box padding={'m'}>
        <Text color={'mainblack'}>
            {selecteduser?.username}
        </Text>
        </Box>
      <Box
        flexDirection="row"
        marginVertical={'m'}
        justifyContent="space-around">
        <Avatar
          avatarStyle={{borderRadius: 40}}
          containerStyle={{width: 80, height: 80}}
          source={{
            uri: selecteduser?.profilepic,
          }}
        />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {selecteduser?.posts.length}
            </Text>
            <Text variant={'ProInfo'}>Posts</Text>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity onPress={() => navigation.replace('Reach')}>
              <Text variant={'ProCount'} textAlign="center">
                {selecteduser?.followers.length}
              </Text>
            </TouchableOpacity>
            <Text variant={'ProInfo'}>Followers</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {selecteduser?.followers.length}
            </Text>

            <Text variant={'ProInfo'}>Following</Text>
          </Box>
        </Box>
      </Box>
      <Box padding={'m'}>
        <Text variant={'userName'}>{selecteduser?.username}</Text>
        <Text variant={'userName'}>{selecteduser?.bio}</Text>
      </Box>
      <Box padding={'s'}>
        <Button
          onPress={() => navigation.navigate('EditProfile')}
          title={'Follow'}
          containerStyle={{
            borderWidth: 0.5,
            borderRadius: 5,
            marginVertical: 6,
          }}
          titleStyle={{color: '#fff'}}
          buttonStyle={{
            backgroundColor: '#3797EF',
          }}
        />
      </Box>
      <Divider />
      <ProfileTab  user={selecteduser}/>
    </Box>
  );
};

export default ProfileView;
