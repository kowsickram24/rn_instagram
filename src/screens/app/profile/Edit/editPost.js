import firestore from '@react-native-firebase/firestore';
import {Header, Input} from '@rneui/themed';
import {useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import ToastManager from 'toastify-react-native';
import BackBtn from '../../../../components/buttons/backButton';
import {PrimaryBtn} from '../../../../components/buttons/primaryButton';
import {Box, Text} from '../../../../theme';

const {width, height} = Dimensions.get('screen');
const EditPost = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState(route.params.selectedPost);
  const VideoUrl = posts?.mediaUrls.filter(key => key.endsWith('.mp4'));
  const imageUrl = posts?.mediaUrls.filter(key => key.endsWith('.jpg'));
  const [isMuted, setIsMuted] = useState(true)

  const toggleMute = () => {

  }
  const handleEdit = async () => {
    try {
      const postRef = firestore().collection('posts').doc(posts.postId);
      await postRef.update({
        caption: posts.caption,
        location: posts.location,
      });

      console.log('Post updated successfully');
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
    <Box backgroundColor="mainwhite" padding="s" flex={1}>
      <ToastManager position="top" />
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
        <Box gap={'s'}>
          {imageUrl > 0 && (
            <FlatList
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              scrollEnabled
              horizontal
              style={{borderRadius: 8}}
              data={imageUrl}
              renderItem={({item}) => (
                <TouchableWithoutFeedback>
                  <FastImage
                    source={{uri: item}}
                    style={{width: 350, height: 350, borderRadius: 8}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableWithoutFeedback>
              )}
            />
          )}
          {VideoUrl ? (
            <TouchableWithoutFeedback onPress={toggleMute}>
              <Video
                source={{uri: VideoUrl[0]}}
                style={{height: 350, borderRadius: 10}}
                playWhenInactive
                repeat
                muted={isMuted}
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          ) : null}

          <Input
            inputStyle={{fontSize: 14, height: 60, textAlignVertical: 'top'}}
            value={posts.caption}
            onChangeText={text => setPosts({...posts, caption: text})}
            multiline
            inputContainerStyle={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderBottomWidth: 0.5,
            }}
          />
          <Input
            inputStyle={{fontSize: 14, textAlignVertical: 'center'}}
            value={posts.location}
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
