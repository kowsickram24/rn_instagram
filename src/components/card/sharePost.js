import {Avatar} from '@rneui/themed';
import {useState} from 'react';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {usePostbyId} from '../../hooks/data/fetchPosts';
import {Box, Text} from '../../theme';

const SharePost = ({postId, onMediaPress, onProfilePress}) => {
  const [isMuted, setIsMuted] = useState(true);
  const {data: postData} = usePostbyId(postId);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <Box gap={'s'} padding={'s'} width={250}>
        <TouchableOpacity onPress={onProfilePress}>
          <Box gap={'s'} flexDirection="row" alignItems="center">
            <Avatar
              source={{uri: postData?.user?.avatar}}
              rounded
              size={'small'}
            />
            <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
              {postData?.user?.username}
            </Text>
          </Box>
        </TouchableOpacity>
        {postData?.mediaUrls ? (
          <TouchableOpacity onPress={onMediaPress}>
            <FastImage
              source={{uri: postData?.mediaUrls[0]}}
              resizeMode="cover"
              style={{width: '100%', height: 250}}
            />
          </TouchableOpacity>
        ) : null}
        {postData?.videoUrl ? (
          <TouchableWithoutFeedback onPress={toggleMute}>
            <Video
              source={{uri: postData?.videoUrl}}
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
            {postData?.user?.username}
          </Text>
          <Text color={'mainblack'}>{postData?.caption}</Text>
        </Box>
      </Box>
    </>
  );
};

export default SharePost;
