import firestore from '@react-native-firebase/firestore';
import { Avatar, SearchBar } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import { FlatList, Platform, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import { Three_dots } from '../../../constants/assets';
import { Box, Text, height } from '../../../theme';

const Followers = ({ currentUser, userData, navigation }) => {
  const LogUser = useSelector(state => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [followers, setFollowers] = useState(userData); 
  const OptionRef = useRef();
  const isCurrentUser = LogUser.userId === currentUser.userId;

  console.log('isCurrentUser: ', isCurrentUser);

  const removeFollower = async () => {
    try {
      const userDocRef = firestore()
        .collection('users')
        .doc(selectedUser.userId);
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

        const updatedFollowers = currentUserData.followers.filter(
          follower => follower.userId !== selectedUser.userId,
        );
        const updatedFollowing = userData.following.filter(
          following => following.userId !== currentUser.userId,
        );

        transaction.update(currentUserDocRef, { followers: updatedFollowers });
        transaction.update(userDocRef, { following: updatedFollowing });

        setFollowers(followers.filter(follower => follower.userId !== selectedUser.userId));
        setSelectedUser(null);
      });
    } catch (error) {
      console.error('Error updating follow status: ', error);
    } finally {
      OptionRef.current.close();
    }
  };

  const renderItem = ({ item }) => {
    if (
      item?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return (
        <Box padding={'s'} flexDirection="row">
          <TouchableOpacity
            onPress={() =>
              navigation.push('ProfileView', { userId: item?.userId })
            }>
            <Box flexDirection="row" gap={'s'} alignItems="center">
              <Avatar size={'medium'} source={{ uri: item?.avatar }} rounded />
              <Box>
                <Text color={'mainblack'} fontSize={14}>
                  {item?.username}
                </Text>
                <Text color={'mainblack'} fontSize={14}>
                  {item?.fullname}
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
          {isCurrentUser ? (
            <Box
              flexDirection="row"
              flex={1}
              justifyContent="flex-end"
              gap={'m'}
              alignItems="center">
              <TouchableOpacity
                onPress={() => {
                  setSelectedUser(item);
                  OptionRef.current.open();
                }}>
                <Box padding={'s'}>
                  <Three_dots />
                </Box>
              </TouchableOpacity>
            </Box>
          ) : null}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <SearchBar
        inputStyle={{ fontSize: 14 }}
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={followers.filter(
          item =>
            item?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.fullname.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No users found</Text>
          </Box>
        }
      />
      <RBSheet
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
        height={height / 5}
        ref={OptionRef}>
        <Box flex={1}  alignItems="center" gap={'m'}>
        <Text color={'mainblack'} >{selectedUser?.username}</Text>
          <TouchableOpacity onPress={removeFollower}>
            <Text padding={'s'} textAlign="center" color={'red'}>
              Remove
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => OptionRef.current.close()}>
            <Text padding={'s'} textAlign="center" color={'mainblack'}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Box>
      </RBSheet>
    </Box>
  );
};

export default Followers;
