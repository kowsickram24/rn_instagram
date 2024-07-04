import firestore from '@react-native-firebase/firestore';
import { Avatar } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { Box, Text } from '../../theme';

const SharePost = ({postId, onMediaPress, onProfilePress}) => {
  const [post, setPost] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRef = await firestore().collection('posts').doc(postId).get();
        if (postRef.exists) {
          const postData = postRef.data();

          const userDoc = await firestore()
            .collection('users')
            .doc(postData.userId)
            .get();
          if (userDoc.exists) {
            postData.user = userDoc.data();
          }

          setPost(postData);
          console.log('Post with user data:', postData);
        } else {
          console.log('No such post document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <>
      <Box gap={'s'} padding={'s'} width={250}>
        <TouchableOpacity onPress={onProfilePress}>
          <Box gap={'s'} flexDirection="row" alignItems="center">
            <Avatar source={{uri: post?.user?.avatar}} rounded size={'small'} />
            <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
              {post?.user?.username}
            </Text>
          </Box>
        </TouchableOpacity>
        {post?.mediaUrls ? (
          <TouchableOpacity onPress={onMediaPress}>
            <FastImage
              source={{uri: post?.mediaUrls[0]}}
              resizeMode="cover"
              style={{width: '100%', height: 250}}
            />
          </TouchableOpacity>
        ) : null}
        {post?.videoUrl ? (
          <TouchableWithoutFeedback onPress={toggleMute}>
            <Video
              source={{uri: post?.videoUrl}}
              style={{width: '100%', height: 200}}
              playWhenInactive
              repeat
              muted={isMuted}
              resizeMode="cover"
            />
          </TouchableWithoutFeedback>
        ) : null}

        <Box alignItems="center" flexDirection="row" gap={'s'}>
          <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
            {post?.user?.username}
          </Text>
          <Text color={'mainblack'}>{post?.caption}</Text>
        </Box>
      </Box>
    </>
  );
};

export default SharePost;
