import {firestore} from '../../../../firebase.config';
import {Divider, Header, SearchBar} from '@rneui/themed';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useRef, useState} from 'react';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector, useDispatch} from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import ChatCard from '../../../components/card/chatCard';
import {Box, Text} from '../../../theme';
import {IgStories} from '../story/IGstories';

const fetchChats = async currentUser => {
  const snapshot = await firestore()
    .collection('chats')
    .where('members', 'array-contains', currentUser.userId)
    .get();

  const chatData = await Promise.all(
    snapshot.docs.map(async doc => {
      const chat = doc.data();
      const secondUserId = chat.members.find(id => id !== currentUser.userId);
      const userDoc = await firestore()
        .collection('users')
        .doc(secondUserId)
        .get();
      const secondUser = userDoc.data();
      return {id: doc.id, ...chat, secondUser};
    }),
  );

  return chatData;
};

const ChatBox = ({navigation}) => {
  const dispatch = useDispatch();
  const stories = useSelector(state => state.stories.stories);
  const currentUser = useSelector(state => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState('');
  const Actionref = useRef();
  const queryClient = useQueryClient();
  const [storyModal, setStoryModal] = useState(false);

  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chats', currentUser],
    queryFn: () => fetchChats(currentUser),
    enabled: !!currentUser,
    select: data =>
      data
        .filter(chat =>
          chat.secondUser.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
        .sort(
          (a, b) => b.lastMessage.time.toDate() - a.lastMessage.time.toDate(),
        ),
  });

  const deleteChatMutation = useMutation({
    mutationFn: async chatId => {
      await firestore().collection('chats').doc(chatId).delete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['chats', currentUser]);
      Actionref.current.close();
    },
  });

  const handleDeleteChat = () => {
    deleteChatMutation.mutate(selectedChat.id);
  };

  const RenderChats = ({item}) => (
    <TouchableOpacity
      onLongPress={() => {
        setSelectedChat(item);
        Actionref.current.open();
      }}
      onPress={() =>
        navigation.navigate('ChatBox', {params: {chatId: item.id}})
      }>
      <ChatCard
        onAvatarPress={() => setStoryModal(!storyModal)}
        loading={isLoading}
        ProfileUrl={item?.secondUser.avatar}
        Username={item?.secondUser.username}
        LastMessage={
          item?.lastMessage?.messageType === 'image'
            ? 'Sent a photo'
            : item?.lastMessage?.messageType === 'video'
            ? 'Sent a video'
            : item?.lastMessage?.messageType === 'post'
            ? 'Sent a post'
            : item?.lastMessage?.message
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
        searchIcon={{
          name: 'search',
        }}
        clearIcon={{
          name: 'close',
        }}
        inputStyle={{fontSize: 14}}
        placeholder="Search"
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={chats}
        renderItem={RenderChats}
        keyExtractor={item => item.id}
      />
      <RBSheet
        height={200}
        draggable
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        ref={Actionref}>
        <Box flex={1} gap={'l'}>
          <Text textAlign="center" color={'mainblack'}>
            {selectedChat?.secondUser?.username}
          </Text>
          <Divider />
          <TouchableOpacity onPress={handleDeleteChat}>
            <Text textAlign="center" color={'red'}>
              Delete
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actionref.current.close()}>
            <Text textAlign="center" color={'mainblack'}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Box>
      </RBSheet>
      <IgStories OpenStoryModal={storyModal} storyData={stories} />
    </Box>
  );
};

export default ChatBox;
