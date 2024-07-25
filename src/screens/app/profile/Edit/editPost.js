import {firestore} from '../../../../../firebase.config';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {Header, Input} from '@rneui/themed';
import {useState} from 'react';
import {Animated, ScrollView, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import BackBtn from '../../../../components/buttons/backButton';
import {PrimaryBtn} from '../../../../components/buttons/primaryButton';
import {Box, Text} from '../../../../theme';
import { useSelector } from 'react-redux';

const EditPost = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState(route.params.post);
  const VideoUrl = posts?.mediaUrls.filter(key => key.endsWith('.mp4'));
  console.log('VideoUrl: ', VideoUrl);
  const imageUrl = posts?.mediaUrls.filter(key => key.endsWith('.jpg'));
  console.log('imageUrl: ', imageUrl > 0);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {};
  const handleEdit = async () => {
    try {
      const postRef = firestore().collection('posts').doc(posts.postId);
      await postRef.update({
        caption: posts.caption,
        location: posts.location,
      }).then(() => {
        notifee.displayNotification({
          title: `${currentUser.username}`,
          body: 'Post Updated successfully',
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
          },
        });
      })
    } catch (error) {
      console.error('Error updating post: ', error);
    } finally {
      navigation.navigate('Profile');
    }
  };

  const handleLocationChange = text => {
    setPosts({...posts, location: text});
  };

  return (
    <Box backgroundColor="mainwhite" flex={1}>
      <Header
        leftComponent={
          <Box flexDirection="row" gap={'s'} alignItems="center">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text fontSize={14} color={'mainblack'}>
              Edit Post
            </Text>
          </Box>
        }
        leftContainerStyle={{flex: 3}}
        backgroundColor="white"
        statusBarProps={{hidden: true}}
      />
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <Box gap={'s'} padding={'s'}>
          {imageUrl?.length > 0 && (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Animated.FlatList
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                scrollEnabled
                horizontal
                data={imageUrl}
                renderItem={({item}) => (
                  <TouchableWithoutFeedback>
                    <Box>
                      <FastImage
                        source={{uri: item}}
                        style={{width: 350, height: 350, alignSelf: 'center'}}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </Box>
                  </TouchableWithoutFeedback>
                )}
              />
            </Box>
          )}
          {VideoUrl?.length > 0 && (
            <TouchableWithoutFeedback onPress={toggleMute}>
              <Video
                source={{uri: VideoUrl[0]}}
                style={{
                  alignSelf: 'center',
                  height: 350,
                  width: 350,
                  borderRadius: 10,
                }}
                playWhenInactive
                repeat
                muted={isMuted}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          )}

          <Input
            label={'Caption'}
            labelStyle={{
              fontWeight: '400',
              fontSize: 12,
              color: 'grey',
              paddingVertical: 6,
            }}
            inputStyle={{fontSize: 14, height: 60, padding: 8, textAlignVertical: 'top'}}
            value={posts?.caption}
            placeholder="Caption"
            onChangeText={text => setPosts({...posts, caption: text})}
            multiline
            inputContainerStyle={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderBottomWidth: 0.5,
            }}
          />
          <Input
            label={'Location'}
            labelStyle={{
              fontWeight: '400',
              fontSize: 12,
              color: 'grey',
              paddingVertical: 6,
            }}
            inputStyle={{fontSize: 14, padding:8, textAlignVertical: 'center'}}
            value={posts?.location}
            placeholder="Location"
            onChangeText={handleLocationChange}
            inputContainerStyle={{
              borderWidth: 0.5,
              borderRadius: 10,
              borderBottomWidth: 0.5,
            }}
          />
          <PrimaryBtn onPress={handleEdit} title="Save Changes" />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default EditPost;
