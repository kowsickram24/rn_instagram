import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, Divider} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import ProfileTab from '../../../navigation/TopTab/ProfileTab';
import {
  PrimaryBtn,
  SecondaryBtn,
} from '../../../components/buttons/primaryButton';
import {useSelector} from 'react-redux';
import Profile from '../profile/Profile';
const Box = createBox();
const Text = createText();
const ProfileView = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const {userId} = route.params;
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  

  const isSameUser = currentUser?.username === selectedUser?.username;
  
  const fetchUserDetails = async () => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (userDoc.exists) {
        const userData = {...userDoc.data(), uid: userDoc.id};
        setSelectedUser(userData);

        const isFollowed = userData.followers.some(
          follower => follower.username === currentUser.username,
        );
        setIsFollowed(isFollowed);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      // console.error('Error fetching user details: ', error);
    }
  };

  const handleFollow = async () => {
    try {
      const userQuerySnapshot = await firestore()
        .collection('users')
        .where('email', '==', selectedUser?.email)
        .get();
      const currentUserQuerySnapshot = await firestore()
        .collection('users')
        .where('email', '==', currentUser?.email)
        .get();

      if (!userQuerySnapshot.empty && !currentUserQuerySnapshot.empty) {
        const userDocRef = userQuerySnapshot.docs[0].ref;
        const currentUserDocRef = currentUserQuerySnapshot.docs[0].ref;

        const userData = { ...userQuerySnapshot.docs[0].data() };
        const currentUserData = { ...currentUserQuerySnapshot.docs[0].data() };

        

        const updatedFollowers = isFollowed
        ? userData.followers.filter(
          follower => follower.username !== currentUser.username,
        )
        : [
          ...userData.followers,
          {
                username: currentUser.username,
                profilepic: currentUser.avatar,
              },
            ];
            
        const updatedFollowing = isFollowed
          ? currentUserData.following.filter(
              following => following.username !== userData.username,
            )
          : [
              ...currentUserData.following,
              { username: userData.username, profilepic: userData.avatar },
            ];

        await firestore().runTransaction(async transaction => {
          transaction.update(userDocRef, { followers: updatedFollowers });
          transaction.update(currentUserDocRef, { following: updatedFollowing });
        });

        setSelectedUser({ ...userData, followers: updatedFollowers });
        setIsFollowed(!isFollowed);
      } else {
        console.error('One of the documents was not found');
      }
    } catch (error) {
      console.error('Error updating follow status: ', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!selectedUser) {
    return (
      <Box
        flex={1}
        backgroundColor={'mainwhite'}
        alignItems="center"
        justifyContent="center">
        <ActivityIndicator size={'large'} />
      </Box>
    );
  }

  if (isSameUser) {
    return <Profile navigation={navigation} />;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box padding={'m'}>
        <Text color={'mainblack'}>{selectedUser?.username}</Text>
      </Box>
      <Box
        flexDirection="row"
        marginVertical={'m'}
        justifyContent="space-around">
        <Avatar
          avatarStyle={{borderRadius: 40}}
          containerStyle={{width: 80, height: 80}}
          source={{uri: selectedUser?.avatar}}
        />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {selectedUser?.posts.length}
            </Text>
            <Text variant={'ProInfo'}>Posts</Text>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity onPress={() => navigation.replace('Reach')}>
              <Text variant={'ProCount'} textAlign="center">
                {selectedUser?.followers.length}
              </Text>
            </TouchableOpacity>
            <Text variant={'ProInfo'}>Followers</Text>
          </Box>
          <Box alignSelf="center">
            <Text variant={'ProCount'} textAlign="center">
              {selectedUser?.following.length}
            </Text>
            <Text variant={'ProInfo'}>Following</Text>
          </Box>
        </Box>
      </Box>
      <Box padding={'m'}>
        <Text variant={'userName'}>{selectedUser?.username}</Text>
        <Text variant={'userName'}>{selectedUser?.fullname}</Text>
        <Text variant={'userName'}>{selectedUser?.bio}</Text>
      </Box>
      <Box justifyContent="center" flexDirection="row" padding={'s'} gap={'s'}>
        {isFollowed ? (
          <SecondaryBtn title={'Following'} onPress={handleFollow} />
        ) : (
          <PrimaryBtn title={'Follow'} onPress={handleFollow} />
        )}
        <SecondaryBtn
          title={'Message'}
          onPress={() => navigation.navigate('Chats')}
        />
      </Box>
      <Divider />
      <ProfileTab user={selectedUser} />
    </Box>
  );
};


export default ProfileView;
