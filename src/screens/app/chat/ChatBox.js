import firestore from '@react-native-firebase/firestore';
import {Avatar, Badge, Button, Divider, Header, SearchBar} from '@rneui/themed';
import {Buffer} from 'buffer';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import MessageBox from '../../../components/Input/messageBox';
import BackBtn from '../../../components/buttons/backButton';
import SharePost from '../../../components/card/sharePost';
import config from '../../../config';
import {
  Dustbin,
  ForWard,
  Gal_Image,
  Gal_Video,
  Gallery_Icon,
  Info,
} from '../../../constants/assets';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {S3Bucket} from '../../../services/aws/s3bucket';
import {Box, Text, height} from '../../../theme';

const ChatBox = ({navigation, route}) => {
  const currentUser = useSelector(state => state.user.user);
  const chatId = route?.params.params.chatId;
  const MediaRef = useRef();
  const fwdRef = useRef();
  const ActionRef = useRef();
  const [chatData, setChatData] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [secondUser, setSecondUser] = useState(null);
  const [message, setMessage] = useState('');
  const [fwdUsers, setFwdUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyingMessage, setReplyingMessage] = useState(null);

  const cloudFrontDomain = config.CLDFRNTDOM;
  const ToggleMute = () => {
    setIsMuted(!isMuted);
  };
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .onSnapshot(
        async chatDoc => {
          if (chatDoc.exists) {
            const data = chatDoc.data();
            console.log('data: ', data);
            setChatData(data);

            const secondUserId = data.members.find(
              id => id !== currentUser.userId,
            );

            if (secondUserId) {
              const secondUserDoc = await firestore()
                .collection('users')
                .doc(secondUserId)
                .get();
              if (secondUserDoc.exists) {
                setSecondUser(secondUserDoc.data());
              }
            }
          }
        },
        error => {
          console.error('Error fetching chat data: ', error);
        },
      );
    fetchUsers();
    return () => unsubscribe();
  }, [chatId, currentUser.userId]);

  const PickImage = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
      });
      setSelectedImage(result.path);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const PickVideo = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'video',
      });
      setSelectedVideo(result.path);
    } catch (error) {
      console.error('Error picking video: ', error);
    }
  };

  const UploadtoAWS = async (file, type) => {
    try {
      const bucketName = config.BUCKETNAME;
      const key = `${type}_${Date.now()}.${type === 'image' ? 'jpg' : 'mp4'}`;
      const fileUrl = await UploadToS3(file, bucketName, key, type);
      console.log('fileUrl: ', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('error: ', error);
      return null;
    }
  };

  const UploadToS3 = async (fileUrl, bucketName, key, type) => {
    const fileData = await RNFS.readFile(fileUrl, 'base64');
    const buffer = Buffer.from(fileData, 'base64');
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: type === 'image' ? 'image/jpeg' : 'video/mp4',
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      S3Bucket.putObject(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          const cloudFrontUrl = `${cloudFrontDomain}/${key}`;
          resolve(cloudFrontUrl);
        }
      });
    });
  };

  const handleDeleteMessage = async () => {
    if (selectedMessage) {
      try {
        await firestore()
          .collection('chats')
          .doc(chatId)
          .update({
            messages: firestore.FieldValue.arrayRemove(selectedMessage),
          });
        ActionRef.current.close();
      } catch (error) {
        console.error('Error deleting message: ', error);
      }
    }
  };

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

      setFwdUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleForwardMessage = async userId => {
    try {
      // Check if a chat already exists
      const chatQuerySnapshot = await firestore()
        .collection('chats')
        .where('members', 'array-contains', currentUser.userId)
        .get();
      console.log('currentUser.userId: ', userId, currentUser.userId);

      let chatDoc;
      chatQuerySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.members.includes(userId)) {
          chatDoc = doc;
        }
      });
      console.log(chatDoc);
      if (!chatDoc) {
        chatDoc = await firestore()
          .collection('chats')
          .add({
            members: [currentUser.userId, userId],
            lastMessage: {},
            messages: [],
          });
      }

      const timestamp = firestore.Timestamp.now();
      const newMessage = {
        userId: currentUser.userId,
        messageType: selectedMessage.messageType,
        message: selectedMessage.message,
        time: timestamp,
      };

      await firestore()
        .collection('chats')
        .doc(chatDoc.id)
        .update({
          messages: firestore.FieldValue.arrayUnion(newMessage),
          lastMessage: newMessage,
        });

      fwdRef.current.close();
    } catch (error) {
      console.error('Error forwarding message: ', error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = fwdUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(fwdUsers);
    }
  }, [searchQuery, fwdUsers]);

  const handleShare = async () => {
    if (selectedImage || selectedVideo) {
      try {
        const file = selectedImage || selectedVideo;
        const type = selectedImage ? 'image' : 'video';
        const fileUrl = await UploadtoAWS(file, type);
        if (fileUrl) {
          const timestamp = firestore.Timestamp.now();
          const newMessage = {
            userId: currentUser.userId,
            messageType: type,
            message: fileUrl,
            time: timestamp,
          };

          await firestore()
            .collection('chats')
            .doc(chatId)
            .update({
              messages: firestore.FieldValue.arrayUnion(newMessage),
              lastMessage: newMessage,
            });

          setSelectedImage('');
          setSelectedVideo('');
          MediaRef.current.close();
        }
      } catch (error) {
        console.error('Error sharing file: ', error);
      }
    }
  };
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const timestamp = firestore.Timestamp.now();
        const newMessage = {
          userId: currentUser.userId,
          messageType: 'text',
          message,
          time: timestamp,
          replyingTo: replyingMessage ? replyingMessage : null,
        };

        await firestore()
          .collection('chats')
          .doc(chatId)
          .update({
            messages: firestore.FieldValue.arrayUnion(newMessage),
            lastMessage: newMessage,
          });

        setMessage('');
        setReplyingMessage(null);
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    }
  };

  const renderFwdUsers = ({item}) => (
    <Box>
      <Box
        flex={1}
        padding={'s'}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap={'m'}>
          <Avatar rounded size={'small'} source={{uri: item.avatar}} />
          <Text color={'mainblack'} style={{fontWeight: 'normal'}}>
            {item.username}
          </Text>
        </Box>
        <Button
          title={'Share'}
          containerStyle={{borderRadius: 8}}
          titleStyle={{fontWeight: 'medium', fontSize: 14}}
          onPress={() => handleForwardMessage(item.userId)}
        />
      </Box>
    </Box>
  );
  if (!chatData || !secondUser) {
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
      {/* */}
      <Divider />

      <GestureHandlerRootView style={{flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chatData?.messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const messageDate = item.time.toDate();
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

            const handleLongPress = () => {
              ActionRef.current.open();
              setSelectedMessage(item);
              console.log(selectedMessage);
            };

            const renderLeftActions = (progress, dragX) => {
              return (
                <TouchableOpacity onPress={() => setReplyingMessage(item)}>
                  <Box padding="m" borderRadius="l"  >
                    <Text color="primaryBlue">Reply</Text>
                  </Box>
                </TouchableOpacity>
              );
            };

            return (
              <SafeAreaView>
                <TouchableWithoutFeedback>
                  <Box key={item.id}>
                    <Text textAlign="center" color={'mainblack'} fontSize={10}>
                      {dateText}
                    </Text>
                    <Text textAlign="center" color={'mainblack'} fontSize={10}>
                      {messageDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <Swipeable
                      dragOffsetFromLeftEdge={2}
                      renderRightActions={() => {}}
                      renderLeftActions={renderLeftActions}>
                      <TouchableWithoutFeedback onLongPress={handleLongPress}>
                        <Box
                          margin="m"
                          padding="m"
                          elevation={2}
                          backgroundColor={'mainwhite'}
                          borderRadius="xl"
                          alignSelf={
                            item.userId === currentUser.userId
                              ? 'flex-end'
                              : 'flex-start'
                          }
                          maxWidth="90%">
                          {item.replyingTo && (
                            <Box
                              backgroundColor="lightgrey"
                              padding="s"
                              borderRadius="m">
                              <Text fontSize={12} color="darkgrey">
                                Replied to {''}
                                {item?.replyingTo?.messageType === 'text'
                                  ? item?.replyingTo?.message
                                  : item?.replyingTo?.messageType === 'post'
                                  ? 'Post'
                                  : item?.replyingTo?.messageType === 'video'
                                  ? 'Video'
                                  : item?.replyingTo.messageType === 'image'
                                  ? 'Image'
                                  : null}
                              </Text>
                            </Box>
                          )}
                          {item.messageType === 'text' ? (
                            <Text fontSize={14} color={'mainblack'}>
                              {item.message}
                            </Text>
                          ) : item.messageType === 'image' ? (
                            <Image
                              resizeMode="cover"
                              source={{uri: item.message}}
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10,
                              }}
                            />
                          ) : item.messageType === 'post' ? (
                            <>
                              <SharePost
                                onMediaPress={() =>
                                  navigation.navigate('PostPage', {
                                    postId: item.message,
                                  })
                                }
                                postId={item?.message}
                              />
                            </>
                          ) : (
                            <TouchableWithoutFeedback onPress={ToggleMute}>
                              <Video
                                resizeMode="cover"
                                source={{uri: item.message}}
                                style={{
                                  width: 200,
                                  height: 200,
                                  borderRadius: 10,
                                }}
                                playWhenInactive
                                repeat
                                muted={isMuted}
                              />
                            </TouchableWithoutFeedback>
                          )}
                        </Box>
                      </TouchableWithoutFeedback>
                    </Swipeable>
                  </Box>
                </TouchableWithoutFeedback>
              </SafeAreaView>
            );
          }}
        />
      </GestureHandlerRootView>

      <Box>
        {replyingMessage && (
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="lightgrey"
            padding="m"
            borderRadius="m">
            <Box flex={1}>
              <Text fontSize={12} color="mainblack">
                Replying to:
              </Text>
              <Text fontSize={14} color="mainblack">
                {replyingMessage?.messageType === 'text'
                  ? replyingMessage?.message
                  : replyingMessage?.messageType === 'post'
                  ? 'Post'
                  : replyingMessage?.messageType === 'image'
                  ? 'Image'
                  : replyingMessage?.messageType === 'video'
                  ? 'Video'
                  : null}
              </Text>
            </Box>
            <Button
              onPress={() => setReplyingMessage(null)}
              title="Cancel"
              buttonStyle={{backgroundColor: 'transparent'}}
              titleStyle={{color: 'red'}}
            />
          </Box>
        )}
        <MessageBox
          value={message}
          onChangeText={setMessage}
          CamPress={() => console.log('Camera')}
          OnMedia={() => MediaRef.current.open()}
          OnSend={handleSendMessage}
        />
      </Box>

      {/* Media View */}
      <RBSheet
        dragOnContent
        draggable
        customStyles={{
          container: {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          },
        }}
        height={height / 1.5}
        ref={MediaRef}>
        <Box padding={'s'} gap={'s'}>
          {selectedImage ? (
            <Image
              style={{
                width: 300,
                alignSelf: 'center',
                height: 300,
                borderRadius: 10,
              }}
              alt="Image"
              source={{uri: selectedImage}}
            />
          ) : selectedVideo ? (
            <Video
              style={{
                width: 300,
                alignSelf: 'center',
                height: 300,
                borderRadius: 10,
              }}
              source={{uri: selectedVideo}}
              controls
            />
          ) : (
            <Box
              backgroundColor={'lightgrey'}
              width={300}
              height={300}
              alignSelf="center"
              alignItems="center"
              borderRadius="m"
              justifyContent="center">
              <Gallery_Icon />
            </Box>
          )}
          <Divider />
          <Box gap={'s'} justifyContent="space-evenly" flexDirection="row">
            <Button
              buttonStyle={{
                elevation: 1,
                borderRadius: 10,
                backgroundColor: 'powderblue',
              }}
              icon={<Gal_Image />}
              onPress={PickImage}
            />
            <Button
              buttonStyle={{
                elevation: 1,
                borderRadius: 10,
                backgroundColor: 'pink',
              }}
              icon={<Gal_Video />}
              onPress={PickVideo}
            />
          </Box>
          <Button
            onPress={handleShare}
            buttonStyle={{borderRadius: 8, marginVertical: 5}}
            titleStyle={{fontSize: 14}}
            title={'Share'}
          />
        </Box>
      </RBSheet>
      <RBSheet
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 0,
          },
        }}
        openDuration={200}
        height={200}
        ref={ActionRef}
        draggable>
        <Box flex={1}>
          <Text color={'mainblack'} fontSize={14} textAlign="center">
            Message
          </Text>
          <Box
            flex={1}
            gap={'l'}
            flexDirection="row"
            justifyContent="space-evenly"
            alignItems="center">
            {selectedMessage?.userId === currentUser?.userId && (
              <TouchableOpacity onPress={handleDeleteMessage}>
                <Box
                  padding={'m'}
                  borderRadius={'l'}
                  backgroundColor={'lightgrey'}>
                  <Dustbin />
                </Box>
                <Text textAlign="center" color={'red'} fontSize={14}>
                  Unsend
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => fwdRef.current.open()}>
              <Box
                padding={'m'}
                borderRadius={'l'}
                backgroundColor={'lightgrey'}>
                <ForWard />
              </Box>
              <Text textAlign="center" color={'mainblack'} fontSize={14}>
                Forward
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </RBSheet>
      <RBSheet
        draggable
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        height={450}
        openDuration={200}
        ref={fwdRef}>
        <Box flex={1}>
          <SearchBar
            inputStyle={{fontSize: 14}}
            platform={Platform.OS === 'android' ? 'android' : 'ios'}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
          />
          <FlatList
            data={filteredUsers}
            ListEmptyComponent={
              <Text color={'mainblack'} fontSize={14} textAlign="center">
                No users found
              </Text>
            }
            renderItem={renderFwdUsers}
            keyExtractor={item => item.id}
          />
        </Box>
      </RBSheet>
    </Box>
  );
};

export default ChatBox;
