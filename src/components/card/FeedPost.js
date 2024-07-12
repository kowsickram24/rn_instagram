import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { formatDistanceToNow, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { firestore } from '../../../firebase.config';
import {
  Comment,
  Heaty_f,
  Heaty_uf,
  Muted,
  Save,
  Save_f,
  Share,
  UnMuted,
} from '../../constants/assets';
import { Box, Text, width } from '../../theme';
import SkeletonCard from '../Skeleton/skeletonCard';
import CmtSheet from '../bottomsheet/CmtSheet';
import ShareSheet from '../bottomsheet/ShareSheet';
import PostHeader from './PostHeader';
import { useSelector } from 'react-redux';

const FeedPost = ({
  user,
  location,
  ProfileUrl,
  mediaSrc,
  Caption,
  onOptionpress,
  comments,
  userId,
  onProfilePress,
  postId,
  time,
  isMuted,
  toggleMute,
}) => {
  const navigation = useNavigation();
  const CmtRef = useRef();
  const VideoRefs = useRef();
  const Shareref = useRef();
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likedId, setLikedId] = useState([]);
  const images = mediaSrc?.filter(key => key?.endsWith('.jpg'));
  const videos = mediaSrc?.filter(key => key?.endsWith('.mp4'));
  const totalImages = images?.length || 0;
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  let formattedTime = '';

  try {
    const date = parse(time, 'M/dd/yyyy, h:mm:ss a', new Date(), {
      locale: enUS,
    });
    if (isNaN(date.getTime())) {
      throw new Error('Invalid Date');
    }
    formattedTime = formatDistanceToNow(date, {addSuffix: true});
  } catch (error) {
    formattedTime = 'Invalid time';
  }

  useFocusEffect(
    useCallback(() => {
      const videoRef = VideoRefs.current;
      if (videoRef) {
        videoRef.seek(0);
        videoRef.resume();
      }

      return () => {
        if (videoRef) {
          videoRef.pause();
        }
      };
    }, []),
  );

  const renderPaginationDots = () => {
    const dotPosition = Animated.divide(animatedValue, width);

    return (
      <Box flexDirection="row">
        {images?.map((_, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{
                opacity,
                height: 5,
                width: 5,
                backgroundColor: '#3797EF',
                marginHorizontal: 5,
                borderRadius: 5,
              }}
            />
          );
        })}
      </Box>
    );
  };

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postRef = firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();

        if (postDoc.exists) {
          const postData = postDoc.data();
          setIsLiked(postData.likes.includes(userId));

          const userRef = firestore().collection('users').doc(userId);
          const userDoc = await userRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setIsSaved(userData.savedPosts.includes(postId));
          }
        }
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [postId, userId]);

  useEffect(() => {
    const fetchLikedUsers = async () => {
      const postRef = firestore().collection('posts').doc(postId);

      const unsubscribe = postRef.onSnapshot(async postDoc => {
        if (postDoc.exists) {
          const postData = postDoc.data();
          const likedUserIds = postData.likes || [];
          setLikedId(likedUserIds);
          const userPromises = likedUserIds.map(async id => {
            const userDoc = await firestore().collection('users').doc(id).get();
            if (userDoc.exists) {
              return userDoc.data().username;
            }
            return null;
          });

          const usernames = await Promise.all(userPromises);
          setLikedUsers(usernames.filter(username => username !== null));
        }
      });

      return () => unsubscribe();
    };

    fetchLikedUsers();
  }, [postId]);

  const oncommentPress = () => {
    CmtRef.current.open();
  };
  const ViewCmnt = () => {
    CmtRef.current.open();
  };
  const onSharePress = () => {
    Shareref?.current?.open();
  };

  const onLikePress = async () => {
    try {
      const postRef = firestore().collection('posts').doc(postId);
      const userRef = firestore().collection('users').doc(userId);

      await firestore().runTransaction(async transaction => {
        const postDoc = await transaction.get(postRef);
        const userDoc = await transaction.get(userRef);

        if (!postDoc.exists || !userDoc.exists) {
          throw 'Document does not exist!';
        }

        const likes = postDoc.data().likes || [];
        let newLikes;

        if (likes.includes(userId)) {
          // Unlike the post
          newLikes = likes.filter(id => id !== userId);
          transaction.update(postRef, {likes: newLikes});

          // Remove postId from user's likedPosts
          const likedPosts = userDoc.data().likedPosts || [];
          transaction.update(userRef, {
            likedPosts: likedPosts.filter(id => id !== postId),
          });
        } else {
          // Like the post
          newLikes = [...likes, userId];
          transaction.update(postRef, {likes: newLikes});

          // Add postId to user's likedPosts
          const likedPosts = userDoc.data().likedPosts || [];
          transaction.update(userRef, {
            likedPosts: [...likedPosts, postId],
          });
        }
      });

      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  const onSavePress = async () => {
    try {
      const userRef = firestore().collection('users').doc(userId);

      await firestore().runTransaction(async transaction => {
        const userDoc = await transaction.get(userRef);

        if (!userDoc.exists) {
          throw 'User document does not exist!';
        }

        const savedPosts = userDoc.data().savedPosts || [];
        if (isSaved) {
          transaction.update(userRef, {
            savedPosts: savedPosts.filter(id => id !== postId),
          });
        } else {
          transaction.update(userRef, {
            savedPosts: [...savedPosts, postId],
          });
        }
      });

      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error updating saved posts: ', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <TouchableWithoutFeedback>
      <Box marginVertical={'s'}>
        <PostHeader
          user={user}
          location={location}
          onOptionpress={onOptionpress}
          ProfileUrl={ProfileUrl}
          onProfilePress={onProfilePress}
        />
        {images?.length > 0 && (
          <Animated.FlatList
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            pagingEnabled
            horizontal
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: animatedValue}}}],
              {
                useNativeDriver: true,
                listener: event => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const index = Math.round(offsetX / width);
                  setCurrentIndex(index);
                },
              },
            )}
            data={images}
            renderItem={({item}) => (
              <TouchableWithoutFeedback>
                <Box>
                  <FastImage
                    source={{uri: item}}
                    style={{width: width, height: 400}}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </Box>
              </TouchableWithoutFeedback>
            )}
          />
        )}
        {images?.length > 0 && images?.length != 1 && (
          <Box
            top={70}
            right={10}
            alignItems="center"
            justifyContent="center"
            position="absolute"
            backgroundColor={'mainblack'}
            borderRadius={'m'}
            width={30}
            height={25}>
            <Text textAlign="center" fontSize={10} color={'mainwhite'}>
              {`${currentIndex + 1} / ${totalImages}`}
            </Text>
          </Box>
        )}
        {videos?.length > 0 && (
          <>
            <Video
              source={{uri: videos[0]}}
              style={{height: 400, width: width}}
              playWhenInactive
              resizeMode="cover"
              repeat
              muted={isMuted}
            />
          </>
        )}
        {videos?.length > 0 && (
          <TouchableWithoutFeedback onPress={toggleMute}>
            <Box
              bottom={140}
              right={20}
              alignItems="center"
              justifyContent="center"
              position="absolute"
              backgroundColor={'mainblack'}
              borderRadius={'l'}
              width={20}
              height={20}>
              {isMuted ? (
                <Muted height="12" width="12" />
              ) : (
                <UnMuted height="12" width="12" />
              )}
            </Box>
          </TouchableWithoutFeedback>
        )}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          paddingVertical={'m'}
          paddingHorizontal={'xs'}>
          <Box flexDirection="row" alignItems="flex-start" gap={'m'}>
            <TouchableOpacity onPress={onLikePress}>
              {isLiked ? <Heaty_f /> : <Heaty_uf />}
            </TouchableOpacity>
            <TouchableOpacity onPress={oncommentPress}>
              <Comment />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSharePress}>
              <Share />
            </TouchableOpacity>
          </Box>
          <Box
            right={'50%'}
            left={'50%'}
            position="absolute"
            alignItems="center">
            {images?.length != 1 && totalImages > 0 && renderPaginationDots()}
          </Box>
          <Box>
            <TouchableOpacity onPress={onSavePress}>
              {isSaved ? <Save_f /> : <Save />}
            </TouchableOpacity>
          </Box>
        </Box>
        {/* {likedUsers} */}
        {likedUsers && (
          <TouchableOpacity
            onPress={() => navigation.navigate('LikedUsers', {likedId})}>
            {likedUsers && likedUsers.length !== 0 ? (
              <Box paddingHorizontal={'s'}>
                {likedUsers.length > 0 && (
                  <Text fontSize={14} color={'mainblack'}>
                    {likedUsers.length === 1 ? (
                      <Text fontSize={14}>
                        {`Liked by `}
                        <Text
                          fontSize={14}
                          fontWeight={'500'}>{`${likedUsers[0]}`}</Text>
                      </Text>
                    ) : (
                      <Text fontSize={14}>
                        {`Liked by `}
                        <Text fontWeight={'500'} fontSize={14}>
                          {`${likedUsers[0]} and ${
                            likedUsers.length - 1
                          } others`}
                        </Text>
                      </Text>
                    )}
                  </Text>
                )}
              </Box>
            ) : null}
          </TouchableOpacity>
        )}

        <Box padding={'s'}>
          <Text width={300} numberOfLines={1}>
            <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
              {user}{' '}
            </Text>
            <Text numberOfLines={3} fontSize={14} color={'mainblack'}>
              {Caption}
            </Text>
          </Text>
        </Box>

        {comments?.length > 0 && (
          <TouchableOpacity onPress={ViewCmnt}>
            <Text paddingHorizontal={'s'} fontSize={12}>
              View{' '}
              {comments?.length > 1
                ? `${comments?.length} comments`
                : 'comment'}
            </Text>
          </TouchableOpacity>
        )}

        {formattedTime && (
          <Text paddingTop={'s'} paddingHorizontal={'s'} fontSize={12}>
            {formattedTime}
          </Text>
        )}

        <ShareSheet postId={postId} ref={Shareref} />
        <CmtSheet
          navigation={navigation}
          ref={CmtRef}
          postId={postId}
          userId={userId}
        />
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default FeedPost;
