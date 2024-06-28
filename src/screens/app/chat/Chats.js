import firestore from '@react-native-firebase/firestore';
import { Header, SearchBar } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useSelector } from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import ChatCard from '../../../components/card/chatCard';
import { Box, Text } from '../../../theme';
const ChatBox = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    const unsubscribe = firestore()
      .collection('chats')
      .where('members', 'array-contains', currentUser.userId)
      .onSnapshot(
        async snapshot => {
          const chatData = await Promise.all(
            snapshot.docs.map(async doc => {
              const chat = doc.data();
              const secondUserId = chat.members.find(
                id => id !== currentUser.userId
              );
              const userDoc = await firestore()
                .collection('users')
                .doc(secondUserId)
                .get();
              const secondUser = userDoc.data();
              return { id: doc.id, ...chat, secondUser };
            })
          );

          const filteredChats = chatData.filter(chat =>
            chat.secondUser.username
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );

          filteredChats.sort((a, b) => b.lastMessage.time.toDate() - a.lastMessage.time.toDate());

          setChats(filteredChats);
          setLoading(false);
        },
        error => {
          console.error('Error fetching chats: ', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [currentUser.userId, searchQuery]);

  const RenderChats = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatBox', {params: {chatId: item.id}})
      }>
      <ChatCard
        loading={loading}
        ProfileUrl={item.secondUser.avatar}
        Username={item.secondUser.username}
        LastMessage={
          item?.lastMessage.messageType === 'image'
            ? 'Sent a photo'
            : item?.lastMessage.messageType === 'video'
            ? 'Sent a video'
            : item?.lastMessage.messageType === 'post'
            ? 'Sent a post'
            : item?.lastMessage.message
        }
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
      <SearchBar
      inputStyle={{fontSize:14}}
      placeholder='Search'
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
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
