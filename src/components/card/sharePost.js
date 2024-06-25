import firestore from '@react-native-firebase/firestore';
import {Avatar} from '@rneui/themed';
import {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {Box, Text} from '../../theme';
const SharePost = ({postId}) => {
  const [post, setPost] = useState(null);
  console.log('postId: ', post);

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
        <Box gap={'s'} flexDirection="row" alignItems="center">
          <Avatar source={{uri: post?.user?.avatar}} rounded size={'small'} />
          <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
            {' '}
            {post?.user?.username}
          </Text>
        </Box>
        <FastImage
          source={{uri: post?.imageUrl}}
          resizeMode="cover"
          style={{width: '100%', height: 400}}
        />
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
