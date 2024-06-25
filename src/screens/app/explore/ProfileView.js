import firestore from '@react-native-firebase/firestore';
import {Avatar, Divider} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {
  PrimaryBtn,
  SecondaryBtn,
} from '../../../components/buttons/primaryButton';
import ProfileTab from '../../../navigation/TopTab/ProfileTab';
import {Box, Text} from '../../../theme';
import Profile from '../profile/Profile';
const ProfileView = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const {userId} = route.params;
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const isSameUser = currentUser?.username === selectedUser?.username;

  const handleChat = async () => {
    try {
      // Check if a chat already exists
      const chatQuerySnapshot = await firestore()
        .collection('chats')
        .where('members', 'array-contains', currentUser.userId)
        .get();

      let chatDoc;
      chatQuerySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.members.includes(userId)) {
          chatDoc = doc;
        }
      });

      if (!chatDoc) {
        // Create a new chat
        chatDoc = await firestore()
          .collection('chats')
          .add({
            members: [currentUser.userId, userId],
            lastMessage: {},
            messages: [],
          });
      }

      navigation.navigate('ChatBox', {
        params: {chatId: chatDoc.id},
      });
    } catch (error) {
      console.error('Error handling chat: ', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();

      if (userDoc.exists) {
        const userData = {...userDoc.data(), uid: userDoc.id};
        setSelectedUser(userData);

        const isFollowed = userData.followers.some(
          follower => follower.userId === currentUser.userId,
        );
        setIsFollowed(isFollowed);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };

  const handleFollow = async () => {
    try {
      const userDocRef = firestore().collection('users').doc(userId);
      const currentUserDocRef = firestore()
        .collection('users')
        .doc(currentUser.userId);

      await firestore().runTransaction(async transaction => {
        const userDoc = await transaction.get(userDocRef);
        const currentUserDoc = await transaction.get(currentUserDocRef);

        if (!userDoc.exists || !currentUserDoc.exists) {
          throw new Error('One of the documents does not exist.');
        }

        const userData = userDoc.data();
        const currentUserData = currentUserDoc.data();

        let updatedFollowers, updatedFollowing;
        if (isFollowed) {
          updatedFollowers = userData.followers.filter(
            follower => follower.userId !== currentUser.userId,
          );
          updatedFollowing = currentUserData.following.filter(
            following => following.userId !== userId,
          );
        } else {
          updatedFollowers = [
            ...userData.followers,
            {userId: currentUser.userId},
          ];
          updatedFollowing = [...currentUserData.following, {userId: userId}];
        }

        transaction.update(userDocRef, {followers: updatedFollowers});
        transaction.update(currentUserDocRef, {following: updatedFollowing});

        setSelectedUser(prev => ({...prev, followers: updatedFollowers}));
        setIsFollowed(!isFollowed);
      });
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
    return <Profile User={selectedUser} navigation={navigation} />;
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
        <Avatar rounded size={'large'} source={{uri: selectedUser?.avatar}} />
        <Box flexDirection="row" gap={'xl'}>
          <Box alignSelf="center">
            <Text color={'mainblack'} fontSize={20} textAlign="center">
              {selectedUser?.posts.length}
            </Text>
            <Text color={'mainblack'} fontSize={12}>
              posts
            </Text>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity
              onPress={() => navigation.replace('Reach', {User: selectedUser})}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {selectedUser?.followers.length}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                followers
              </Text>
            </TouchableOpacity>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity
              onPress={() => navigation.replace('Reach', {User: selectedUser})}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {selectedUser?.following.length}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                following
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <Box margin={'m'}>
        <Text fontSize={12} color={'mainblack'}>
          {selectedUser?.username}
        </Text>
        <Text fontSize={12} color={'mainblack'}>
          {selectedUser?.fullname}
        </Text>
        <Text fontSize={12} color={'mainblack'}>
          {selectedUser?.bio}
        </Text>
      </Box>
      <Box justifyContent="center" flexDirection="row" padding={'s'} gap={'s'}>
        {isFollowed ? (
          <SecondaryBtn title={'Following'} onPress={handleFollow} />
        ) : (
          <PrimaryBtn title={'Follow'} onPress={handleFollow} />
        )}
        <SecondaryBtn title={'Message'} onPress={handleChat} />
      </Box>
      <Divider />
      <ProfileTab user={selectedUser} />
    </Box>
  );
};

export default ProfileView;
