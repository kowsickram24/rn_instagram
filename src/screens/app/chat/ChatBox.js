import firestore from '@react-native-firebase/firestore';
import {Avatar, Badge, Button, Divider, Header} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Gal_Image,
  Gal_Video,
  Gallery,
  Gallery_Icon,
  Info,
} from '../../../constants/assets';
import {S3Bucket} from '../../../services/aws/s3bucket';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import MessageBox from '../../../components/Input/messageBox';
import BackBtn from '../../../components/buttons/backButton';
import {Box, Text, height} from '../../../theme';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import config from '../../../config';
import {
  GestureDetector,
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import SharePost from '../../../components/card/sharePost';

const ChatBox = ({navigation, route}) => {
  const currentUser = useSelector(state => state.user.user);
  const chatId = route?.params.params.chatId;
  const MediaRef = useRef();
  const [chatData, setChatData] = useState(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [secondUser, setSecondUser] = useState(null);
  const [message, setMessage] = useState('');
  const [postData, setPostData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const cloudFrontDomain = config.CLDFRNTDOM;

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

    // Cleanup subscription on unmount
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
      {/* */}
      <Divider />
      <GestureHandlerRootView>
        <FlatList
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

            return (
              <TapGestureHandler
              // onActivated={() => console.log('Double Tap', item.message)}
              // numberOfTaps={2}
              >
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
                    {item.messageType === 'text' ? (
                      <Text fontSize={14} color={'mainblack'}>
                        {item.message}
                      </Text>
                    ) : item.messageType === 'image' ? (
                      <Image
                        resizeMode="contain"
                        source={{uri: item.message}}
                        style={{width: 200, height: 400, borderRadius: 10}}
                      />
                    ) : item.messageType === 'post' ? (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('PostPage', {
                              postId: item.message,
                            })
                          }>
                          <SharePost postId={item.message} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Video
                        paused
                        source={{uri: item.message}}
                        style={{width: 200, height: 400, borderRadius: 10}}
                        controls
                      />
                    )}
                  </Box>
                </Box>
              </TapGestureHandler>
            );
          }}
        />
      </GestureHandlerRootView>

      <MessageBox
        // LongMedia={() => MsgRef.current.open()}
        value={message}
        onChangeText={setMessage}
        CamPress={() => console.log('Camera')}
        OnMedia={() => MediaRef.current.open()}
        OnSend={handleSendMessage}
      />

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
    </Box>
  );
};

export default ChatBox;
