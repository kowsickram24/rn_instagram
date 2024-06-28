import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Avatar, Button, Card, Input} from '@rneui/themed';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  Dimensions,
  FlatList,
  Share as Shre,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Divider} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {formatDistanceToNow} from 'date-fns';
import {parse} from 'date-fns';
import {enUS} from 'date-fns/locale';
import {
  Comment,
  Heaty_f,
  Heaty_uf,
  LInk,
  Save,
  Save_f,
  Share,
  Three_dots,
} from '../../constants/assets';
import {Box, Text} from '../../theme';
import SkeletonCard from '../Skeleton/skeletonCard';
const {width, height} = Dimensions.get('screen');
import {SearchBar} from '@rneui/themed';
import Carousel from 'react-native-reanimated-carousel';
const PostHeader = ({
  location,
  user,
  onOptionpress,
  ProfileUrl,
  onProfilePress,
}) => {
  return (
    <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
      <TouchableOpacity onPress={onProfilePress}>
        <Avatar
          avatarStyle={{borderRadius: 21}}
          containerStyle={{width: 42, height: 42}}
          source={{uri: ProfileUrl}}
        />
      </TouchableOpacity>
      <Box flex={1} flexDirection="row" justifyContent="space-between">
        <Box flexDirection="column">
          <TouchableOpacity onPress={onProfilePress}>
            <Text fontWeight={'500'} color={'mainblack'}>
              {user}
            </Text>
          </TouchableOpacity>
          <Text color={'mainblack'} fontSize={12}>
            {location}
          </Text>
        </Box>
        <TouchableOpacity onPress={onOptionpress}>
          <Box flex={1} padding={'s'} justifyContent="center">
            <Three_dots />
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

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
  videoSrc,
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
      <Box flex={1}>
        <Card
          containerStyle={{
            flex: 1,
            padding: 0,
            margin: 0,
            elevation: 0,
            borderWidth: 0,
          }}>
          <PostHeader
            user={user}
            location={location}
            onOptionpress={onOptionpress}
            ProfileUrl={ProfileUrl}
            onProfilePress={onProfilePress}
          />
          {mediaSrc?.length > 0 && (
            <Carousel
              onSnapToItem={index => console.log('current index:', index)}
              snapEnabled
              pagingEnabled
              autoPlay={false}
              width={width}
              height={400}
              data={mediaSrc}
              renderItem={({item}) => (
                <FastImage
                  source={{uri: item}}
                  style={{width: width, height: 400}}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
            />
          )}
          {videoSrc ? (
            <TouchableWithoutFeedback onPress={toggleMute}>
              <Video
                source={{uri: videoSrc}}
                style={{height: 400, width: width}}
                playWhenInactive
                resizeMode="cover"
                repeat
                muted={!isMuted}
              />
            </TouchableWithoutFeedback>
          ) : null}

          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingTop={'s'}
            paddingHorizontal={'xs'}>
            <Box flexDirection="row" justifyContent="center" gap={'m'}>
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
            <TouchableOpacity onPress={onSavePress} style={{padding: 10}}>
              {isSaved ? <Save_f /> : <Save />}
            </TouchableOpacity>
          </Box>
          {/* {likedUsers} */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LikedUsers', {likedId})}>
            {likedUsers.length !== 0 ? (
              <Box paddingHorizontal={'s'}>
                {likedUsers.length > 0 && (
                  <Text fontSize={14} color={'mainblack'}>
                    {likedUsers.length === 1
                      ? `Liked by ${likedUsers[0]}`
                      : `Liked by ${likedUsers[0]} and ${
                          likedUsers.length - 1
                        } others`}
                  </Text>
                )}
              </Box>
            ) : null}
          </TouchableOpacity>
          <Box padding={'s'}>
            <Text width={300} numberOfLines={1}>
              <Text fontWeight={'500'} fontSize={14} color={'mainblack'}>
                {user}{' '}
              </Text>
              <Text fontSize={14} color={'mainblack'}>
                {Caption}
              </Text>
            </Text>
          </Box>
          {comments?.length > 0 && (
            <TouchableOpacity onPress={ViewCmnt}>
              <Text paddingHorizontal={'s'} fontSize={14}>
                View{' '}
                {comments?.length > 1
                  ? `${comments?.length} comments`
                  : 'comment'}
              </Text>
            </TouchableOpacity>
          )}
        </Card>

        <ShareBox postId={postId} ref={Shareref} />
        <CommentBox
          navigation={navigation}
          ref={CmtRef}
          postId={postId}
          userId={userId}
        />
        <Text paddingTop={'s'} paddingHorizontal={'s'} fontSize={12}>
          {formattedTime}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );
};

const ShareBox = forwardRef(({ postId }, ref) => {
  const currentUser = useSelector(state => state.user.user);
  const [shareUsers, setShareUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

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

      setShareUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUsers(shareUsers);
    } else {
      const filtered = shareUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, shareUsers]);

  const handleShare = async userId => {
    try {
      // Check if a chat already exists
      const chatQuerySnapshot = await firestore()
        .collection('chats')
        .where('members', 'array-contains', currentUser.userId)
        .get();

      let chatDoc;
      chatQuerySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.members.includes(userId)) {
          chatDoc = doc;
        }
      });

      if (!chatDoc) {
        // Create a new chat
        chatDoc = await firestore()
          .collection('chats')
          .add({
            members: [currentUser.userId, userId],
            lastMessage: {},
            messages: [],
          });
      }

      // Share the post in the chat
      const timestamp = firestore.Timestamp.now();
      const newMessage = {
        userId: currentUser.userId,
        messageType: 'post',
        message: postId,
        time: timestamp,
      };

      await firestore()
        .collection('chats')
        .doc(chatDoc.id)
        .update({
          messages: firestore.FieldValue.arrayUnion(newMessage),
          lastMessage: newMessage,
        });

      ref.current.close();
    } catch (error) {
      console.error('Error sharing post: ', error);
    }
  };

  const renderSharelist = ({ item }) => (
    <Box paddingVertical={'s'} paddingHorizontal={'s'}>
      <Box
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center">
        <Box flexDirection="row" gap={'s'} alignItems="center">
          <Avatar rounded size={'medium'} source={{ uri: item?.avatar }} />
          <Text fontSize={14} color={'mainblack'}>
            {item.username}
          </Text>
        </Box>
        <Button
          containerStyle={{ borderRadius: 8 }}
          onPress={() => handleShare(item.id)}
          title={'Share'}
          titleStyle={{ fontSize: 12 }}
        />
      </Box>
    </Box>
  );

  const handleShareOtherApps = async () => {
    try {
      const result = await Shre.share({
        title: 'Instagram Post',
        message: `Check out this post`,
      });

      ref.current.close();

      if (result.action === Shre.sharedAction) {
        console.log('Post shared');
      } else if (result.action === Shre.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <RBSheet
      draggable
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      }}
      closeOnPressBack
      ref={ref}
      height={height / 2}>
      <Box flex={1} padding="s">
        <SearchBar
          inputStyle={{ fontSize: 14 }}
          platform={Platform.OS === 'android' ? 'android' : 'ios'}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
        />
        <FlatList
          data={filteredUsers}
          renderItem={renderSharelist}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text fontSize={12}>No Users to Share</Text>}
        />
        <Box alignSelf="center" padding="s">
          <TouchableOpacity onPress={handleShareOtherApps}>
            <Box
              padding="m"
              gap="s"
              borderRadius="l"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              backgroundColor="dullwhite">
              <LInk />
              <Text fontSize={14}>Other Apps</Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </RBSheet>
  );
});

const CommentBox = forwardRef(({postId, userId, navigation}, ref) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [userAvatar, setUserAvatar] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      const postRef = firestore().collection('posts').doc(postId);

      const unsubscribe = postRef.onSnapshot(async doc => {
        if (doc.exists) {
          const postData = doc.data();
          const commentsWithUserDetails = await Promise.all(
            (postData.comments || []).map(async comment => {
              const userDoc = await firestore()
                .collection('users')
                .doc(comment.userId)
                .get();
              if (userDoc.exists) {
                const userData = userDoc.data();
                return {
                  ...comment,
                  username: userData.username,
                  userAvatar: userData.avatar,
                };
              }
              return comment;
            }),
          );
          setComments(commentsWithUserDetails);
        }
      });

      return () => unsubscribe();
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserAvatar(userData.avatar || '');
        } else {
          setUserAvatar('');
        }
      } catch (error) {
        console.error('Error fetching user avatar: ', error);
      }
    };

    fetchUserAvatar();
  }, [userId]);

  const handleComment = async () => {
    if (commentText.trim() === '') return;

    try {
      const newComment = {
        userId: userId,
        comment: commentText,
        time: new Date().toISOString(),
        likes: [],
        replies: [],
      };

      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: firestore.FieldValue.arrayUnion(newComment),
        });

      setCommentText('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleLikeComment = async (comment, isLiked) => {
    try {
      const updatedLikes = isLiked
        ? comment.likes.filter(id => id !== userId)
        : [...comment.likes, userId];

      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: comments.map(c =>
            c.time === comment.time ? {...c, likes: updatedLikes} : c,
          ),
        });
    } catch (error) {
      console.error('Error liking comment: ', error);
    }
  };

  const handleReply = async comment => {
    if (replyText.trim() === '') return;

    try {
      const newReply = {
        userId: userId,
        comment: replyText,
        time: new Date().toISOString(),
        likes: [],
      };

      const updatedReplies = await Promise.all(
        [...comment.replies, newReply].map(async reply => {
          const userDoc = await firestore()
            .collection('users')
            .doc(reply.userId)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            return {
              ...reply,
              username: userData.username,
              userAvatar: userData.avatar,
            };
          }
          return reply;
        }),
      );

      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: comments.map(c =>
            c.time === comment.time ? {...c, replies: updatedReplies} : c,
          ),
        });

      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error replying to comment: ', error);
    }
  };

  const renderCommentItem = ({item}) => (
    <Box key={item.time} paddingHorizontal="m" paddingVertical="s">
      <Box flexDirection="row" alignItems="center">
        <Avatar source={{uri: item.userAvatar}} size="small" rounded />
        <Box marginLeft="s">
          <TouchableOpacity
            onPress={() =>
              navigation.push('ProfileView', {userId: item.userId})
            }>
            <Text fontSize={14} color="mainblack" fontWeight="400">
              {item.username}
            </Text>
          </TouchableOpacity>
          <Box
            flex={1}
            flexDirection="row"
            alignItems="center"
            gap={'s'}
            justifyContent="space-between">
            <Text fontSize={14} color="mainblack">
              {item.comment}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleLikeComment(item, item.likes.includes(userId))
              }>
              {item.likes.includes(userId) ? (
                <Heaty_f height="10" width="10" />
              ) : (
                <Heaty_uf height="10" width="10" />
              )}
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <TouchableOpacity onPress={() => setReplyingTo(item)}>
        <Text color={'mainblack'} fontSize={12}>
          Reply
        </Text>
      </TouchableOpacity>

      {item.replies && item.replies.length > 0 && (
        <Box marginLeft="l">
          {item.replies.map(reply => (
            <Box
              key={reply.time}
              flexDirection="row"
              alignItems="center"
              marginTop="s">
              <Avatar source={{uri: reply.userAvatar}} size="small" rounded />
              <Box marginLeft="s">
                <Text fontSize={12} color={'mainblack'}>
                  {reply.username}
                </Text>
                <Text fontSize={12} color={'mainblack'}>
                  {reply.comment}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <RBSheet
      draggable
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        },
      }}
      closeOnPressBack
      ref={ref}
      height={400}>
      <Box flex={1}>
        <Text
          padding="s"
          fontWeight="bold"
          fontSize={12}
          textAlign="center"
          color="mainblack">
          Comments
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.time}
          ListEmptyComponent={
            <Box flex={1} alignItems="center" justifyContent="center">
              <Text color={'mainblack'} fontWeight={'bold'} paddingVertical="s">
                No Comments Yet
              </Text>
            </Box>
          }
        />
        {replyingTo && (
          <Box flexDirection="row" alignItems="center" padding="s">
            <Avatar source={{uri: userAvatar}} size="small" rounded />
            <TextInput
              style={{flex: 1, fontSize: 14, marginLeft: 10}}
              placeholder="Write a reply"
              value={replyText}
              onChangeText={setReplyText}
            />
            <TouchableOpacity onPress={() => handleReply(replyingTo)}>
              <Text>Send</Text>
            </TouchableOpacity>
          </Box>
        )}
        {!replyingTo && (
          <Input
            inputStyle={{fontSize: 14}}
            leftIcon={
              <Avatar source={{uri: userAvatar}} size="small" rounded />
            }
            rightIcon={
              <TouchableOpacity onPress={handleComment}>
                <Text>Send</Text>
              </TouchableOpacity>
            }
            value={commentText}
            onChangeText={setCommentText}
            inputContainerStyle={{borderBottomWidth: 0}}
            placeholder="Write a comment"
          />
        )}
      </Box>
    </RBSheet>
  );
});

export default FeedPost;
