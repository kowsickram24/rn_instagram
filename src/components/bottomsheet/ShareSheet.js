import { FlatList, Platform, Share, TouchableOpacity } from "react-native";
import { Box, height, Text } from "../../theme";
import { LInk } from "../../constants/assets";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../../firebase.config";
import { Avatar, Button, SearchBar } from "@rneui/themed";
import RBSheet from "react-native-raw-bottom-sheet";

const ShareSheet = forwardRef(({ postId }, ref) => {
  const currentUser = useSelector(state => state.user.user);
  const [shareUsers, setShareUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const userRef = firestore().collection('users');
      const snapshot = await userRef.get();
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter out the current user
      const filteredUsers = fetchedUsers.filter(
        user => user.id !== currentUser.userId,
      );

      setShareUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(shareUsers);
    } else {
      const filtered = shareUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, shareUsers]);

  const handleShare = async userId => {
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

      // Share the post in the chat
      const timestamp = firestore.Timestamp.now();
      const newMessage = {
        userId: currentUser.userId,
        messageType: 'post',
        message: postId,
        time: timestamp,
      };

      await firestore()
        .collection('chats')
        .doc(chatDoc.id)
        .update({
          messages: firestore.FieldValue.arrayUnion(newMessage),
          lastMessage: newMessage,
        });

      ref.current.close();
    } catch (error) {
      console.error('Error sharing post: ', error);
    }
  };

  const renderSharelist = ({ item }) => (
    <Box paddingVertical={'s'} paddingHorizontal={'s'}>
      <Box
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center">
        <Box flexDirection="row" gap={'s'} alignItems="center">
          <Avatar rounded size={'medium'} source={{ uri: item?.avatar }} />
          <Text fontSize={14} color={'mainblack'}>
            {item.username}
          </Text>
        </Box>
        <Button
          containerStyle={{ borderRadius: 8 }}
          onPress={() => handleShare(item.id)}
          title={'Share'}
          titleStyle={{ fontSize: 12 }}
        />
      </Box>
    </Box>
  );

  const handleShareOtherApps = async () => {
    try {
      const result = await Share.share({
        title: 'Instagram Post',
        message: `Check out this post`,
      });

      ref.current.close();

      if (result.action === Share.sharedAction) {
        console.log('Post shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <RBSheet
      draggable
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      }}
      closeOnPressBack
      ref={ref}
      height={height / 2}>
      <Box flex={1} padding="s">
        <SearchBar
          searchIcon={{
            name: 'search',
          }}
          clearIcon={{
            name: 'close',
          }}
          inputStyle={{ fontSize: 14 }}
          platform={Platform.OS === 'android' ? 'android' : 'ios'}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredUsers}
          renderItem={renderSharelist}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text fontSize={12}>No Users to Share</Text>}
        />
        <Box alignSelf="center" padding="s">
          <TouchableOpacity onPress={handleShareOtherApps}>
            <Box
              padding="m"
              gap="s"
              borderRadius="l"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              backgroundColor="dullwhite">
              <LInk />
              <Text fontSize={14}>Other Apps</Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </RBSheet>
  );
});


export default ShareSheet;