import {firestore} from '../../../../firebase.config';
import {Header} from '@rneui/themed';
import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import {
  PrimaryBtn,
  SecondaryBtn,
} from '../../../components/buttons/primaryButton';
import ProfileCard from '../../../components/card/profileCard';
import ProfileTab from '../../../navigation/TopTab/ProfileTab';
import {Box, Text, width} from '../../../theme';

const ProfileView = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const {userId} = route.params;
  console.log('userId: ', userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [storyModal, setStoryModal] = useState(false);

  const handleLongPress = avatar => {
    setSelectedImage(avatar);
    setModalVisible(true);
  };

  const handlePressOut = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);

  const isSameUser = currentUser?.userId === selectedUser?.userId;
  console.log('isSameUser: ', isSameUser);
  if (isSameUser) {
    navigation.navigate('Profile');
  }
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
        <ActivityIndicator color={'grey'} size={'large'} />
      </Box>
    );
  }

  return (
    <ScrollView  showsVerticalScrollIndicator={false}  style={{backgroundColor: 'white'}} >
      <Header
        statusBarProps={{hidden: true}}
        backgroundColor="white"
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text numberOfLines={1} color={'mainblack'}>
              {selectedUser?.username}
            </Text>
          </Box>
        }
      />

      <ProfileCard
        onPostPress={() => navigation.navigate('PublicPost')}
        onAvatarLongPress={() => handleLongPress(selectedUser?.avatar)}
        show={false}
        onAvatarPress={() => setStoryModal(!storyModal)}
        userAvatar={selectedUser?.avatar}
        Postcount={selectedUser?.posts.length}
        onFollowersPress={() =>
          navigation.navigate('Reach', {
            screen: 'Followers',
            User: selectedUser,
          })
        }
        followersCount={selectedUser?.followers.length}
        onFollowingPress={() =>
          navigation.navigate('Reach', {
            screen: 'Following',
            User: selectedUser,
          })
        }
        followingCount={selectedUser?.following.length}
      />

      <Box padding={'m'}>
        {selectedUser?.username && (
          <Text fontWeight={'500'} fontSize={12} color={'mainblack'}>
            {selectedUser?.fullname}
          </Text>
        )}

        {selectedUser?.bio && (
          <Text
            ellipsizeMode="tail"
            numberOfLines={3}
            fontSize={12}
            color={'mainblack'}>
            {selectedUser?.bio}
          </Text>
        )}
      </Box>
      <Box justifyContent="center" flexDirection="row" padding={'s'} gap={'s'}>
        {isFollowed ? (
          <SecondaryBtn title={'Following'} onPress={handleFollow} />
        ) : (
          <PrimaryBtn title={'Follow'} onPress={handleFollow} />
        )}
        <SecondaryBtn title={'Message'} onPress={handleChat} />
      </Box>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPressOut={handlePressOut}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.9)',
            }}>
            {selectedImage && (
              <FastImage
                source={{uri: selectedImage}}
                style={{width: 250, height: 250, borderRadius: 250}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ProfileTab user={selectedUser} />
    </ScrollView>
  );
};

export default ProfileView;
