import {FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Back, Camera, Search_uf} from '../../../constants/assets';
import {Avatar, Header, Input} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import {Button} from '@rneui/themed';
import SnackBar from '../../../components/snackbar/snackBar';
import ChatCard from '../../../components/card/chatCard';
import ChatSearch from '../../../components/searchbar/chatSearch';
import BackBtn from '../../../components/buttons/backButton';
const ChatBox = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackVisible, setSnackVisible] = useState(false);

  const showSnackBar = () => {
    setSnackVisible(true);
  };

  const dismissSnackBar = () => {
    setSnackVisible(false);
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', currentUser.userId)
      .onSnapshot(async snapshot => {
        const chatData = await Promise.all(
          snapshot.docs.map(async doc => {
            const chat = doc.data();
            const secondUserId = chat.members.find(
              id => id !== currentUser.userId,
            );
            const userDoc = await firestore()
              .collection('users')
              .doc(secondUserId)
              .get();
            const secondUser = userDoc.data();
            return {id: doc.id, ...chat, secondUser};
          }),
        );
        setChats(chatData);
      });

    return () => unsubscribe();
  }, [currentUser.userId]);

  const RenderChats = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatBox', {params: {chatId: item.id}})
      }>
      <ChatCard
        ProfileUrl={item.secondUser.avatar}
        Username={item.secondUser.username}
        LastMessage={item.lastMessage.message}
      />
    </TouchableOpacity>
  );

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Header
        backgroundColor="white"
        centerContainerStyle={{
          justifyContent: 'center',
        }}
        centerComponent={
          <Text fontSize={14} color={'mainblack'}>
            {currentUser.username}
          </Text>
        }
        leftComponent={<BackBtn onPress={() => navigation.goBack()} />}
        statusBarProps={{hidden: true}}
      />
      <ChatSearch />
      <FlatList
        ListEmptyComponent={<Text> No Chat Yet</Text>}
        data={chats}
        renderItem={RenderChats}
        keyExtractor={item => item.id}
      />
    </Box>
  );
};

export default ChatBox;
