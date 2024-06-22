import firestore from '@react-native-firebase/firestore';
import {FlatList, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Back, Cmt_Share, Info, Search_uf} from '../../../constants/assets';
import {Avatar, Badge, Divider, Header, Input} from '@rneui/themed';

import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import MessageBox from '../../../components/Input/messageBox';
import BackBtn from '../../../components/buttons/backButton';

const ChatBox = ({navigation, route}) => {
  const currentUser = useSelector(state => state.user.user);
  const chatId = route?.params.params.chatId;
  const [chatData, setChatData] = useState(null);
  console.log('chatData: ', chatData);
  const [secondUser, setSecondUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatDoc = await firestore().collection('chats').doc(chatId).get();
        if (chatDoc.exists) {
          const data = chatDoc.data();
          setChatData(data);

          const secondUserId = data.members.find(
            id => id !== currentUser.userId,
          );
          const secondUserDoc = await firestore()
            .collection('users')
            .doc(secondUserId)
            .get();
          if (secondUserDoc.exists) {
            setSecondUser(secondUserDoc.data());
          }
        }
      } catch (error) {
        console.error('Error fetching chat data: ', error);
      }
    };

    fetchChatData();
  }, [chatId, currentUser.userId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const timestamp = firestore.Timestamp.now();
        const newMessage = {
          userId: currentUser.userId,
          messageType: 'text',
          message,
          time: timestamp,
        };

        await firestore()
          .collection('chats')
          .doc(chatId)
          .update({
            messages: firestore.FieldValue.arrayUnion(newMessage),
            lastMessage: newMessage,
          });

        setMessage('');
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    }
  };

  if (!chatData || !secondUser) {
    return (
      <Box
        flex={1}
        backgroundColor={'mainwhite'}
        alignItems="center"
        justifyContent="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        leftContainerStyle={{flex: 1}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'l'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <TouchableOpacity>
              <Avatar rounded size={40} source={{uri: secondUser.avatar}} />
            </TouchableOpacity>
          </Box>
        }
        statusBarProps={{hidden: true}}
        centerContainerStyle={{justifyContent: 'center'}}
        rightContainerStyle={{justifyContent: 'center'}}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate('ChatInfo', {secondUser})}>
            <Info />
          </TouchableOpacity>
        }
        centerComponent={
          <TouchableOpacity>
            <Box justifyContent="center" alignItems="center">
              <Text color={'mainblack'}> {secondUser.username} </Text>
              <Box flexDirection="row" alignItems="center">
                <Badge badgeStyle={{backgroundColor: 'green'}} />
                <Text color={'darkgrey'} fontSize={12}>
                  {' '}
                  {!secondUser.activeTime ? 'Active Now' : 'Offline'}{' '}
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
        }
      />
      <Divider />
      <ScrollView style={{backgroundColor: 'mainwhite'}}>
        {chatData?.messages.map((msg, index) => {
          const messageDate = msg.time.toDate();
          const currentDate = new Date();
          const timeDifference = currentDate - messageDate;
          const oneDay = 24 * 60 * 60 * 1000;

          let dateText;
          if (
            timeDifference < oneDay &&
            messageDate.getDate() === currentDate.getDate()
          ) {
            dateText = 'Today';
          } else if (
            timeDifference < 2 * oneDay &&
            messageDate.getDate() === currentDate.getDate() - 1
          ) {
            dateText = 'Yesterday';
          } else {
            dateText = messageDate.toLocaleDateString();
          }

          return (
            <Box>
              <Text textAlign="center" color="darkgrey" fontSize={10}>
                {dateText}
              </Text>
              <Text textAlign="center" color="mainblack" fontSize={10}>
                {new Date(msg.time.toDate()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Box
                key={index}
                margin="m"
                padding="m"
                elevation={2}
                backgroundColor={'mainwhite'}
                borderRadius="xl"
                alignSelf={
                  msg.userId === currentUser.userId ? 'flex-end' : 'flex-start'
                }
                maxWidth="75%">
                <Text fontSize={14} color={'mainblack'}>
                  {msg?.message}
                </Text>
              </Box>
            </Box>
          );
        })}
      </ScrollView>
      <MessageBox
        value={message}
        onChangeText={setMessage}
        CamPress={() => console.log('Camera')}
        OnMedia={() => console.log('Media')}
        OnSend={handleSendMessage}
      />
    </Box>
  );
};

export default ChatBox;
