import {Avatar, Card, Input, Dialog, Header} from '@rneui/themed';
import React, {useRef, forwardRef} from 'react';
import {useState, useEffect} from 'react';
import {FlatList, Dimensions, Image, TouchableOpacity} from 'react-native';
import {Skeleton} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {
  GestureDetector,
  GestureHandlerRootView,
  TapGestureHandler,
} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('screen');
import {
  Cmt_Share,
  Comment,
  Heaty_f,
  Heaty_uf,
  LInk,
  Save,
  Save_f,
  Share,
  Three_dots,
  Within,
} from '../../constants/assets';
import {Box, Text} from '../../theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import SkeletonCard from '../Skeleton/skeletonCard';

const emojis = ['smile', 'heart', 'thumbs-up', 'surprise', 'laugh'];

const EmojiReactions = ({onEmojiPress}) => {
  return (
    <Box
      padding={'s'}
      justifyContent="space-evenly"
      flexDirection="row"
      gap={'l'}>
      {emojis.map((emoji, index) => (
        <TouchableOpacity key={index} onPress={() => onEmojiPress(emoji)}>
          <Icon name={emoji} size={24} />
        </TouchableOpacity>
      ))}
    </Box>
  );
};

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
  imageSrc,
  Caption,
  onOptionpress,
  comments,
  userId,
  postId,
}) => {
  const navigation = useNavigation();
  const CmtRef = useRef();
  const Shareref = useRef();
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [likedId, setLikedId] = useState([]);

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

  const fetchUsers = async () => {
    try {
      const postRef = firestore().collection('users');
      const snapshot = await postRef.get();
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const postRef = firestore().collection('posts');
      const snapshot = await postRef.get();
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

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

  const onProfilePress = () => {
    navigation.navigate('Profile');
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
    <GestureHandlerRootView>
      <Box>
        <Card
          containerStyle={{
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
          <TapGestureHandler onActivated={onLikePress} numberOfTaps={2}>
            <Image
              resizeMode="cover"
              style={{
                height: 400,
                width: '100%',
              }}
              alt="Post Image"
              source={{uri: imageSrc}}
            />
          </TapGestureHandler>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            padding={'s'}>
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
          <TouchableOpacity
            onPress={() => navigation.navigate('LikedUsers', {likedId})}>
            {likedUsers != 0 ? (
              <Box paddingHorizontal={'s'}>
                <Text fontSize={14} color={'mainblack'}>
                  {likedUsers.length !== 0
                    ? `Liked by ${likedUsers.join(', ')}`
                    : null}
                </Text>
              </Box>
            ) : null}
          </TouchableOpacity>
          <Box paddingVertical={'s'} paddingHorizontal={'s'}>
            <Text
              width={300}
              fontSize={14}
              color={'mainblack'}
              numberOfLines={1}>
              {user} {Caption}
            </Text>
          </Box>
          {comments?.length > 0 && (
            <Box paddingVertical="s" paddingHorizontal="s">
              <TouchableOpacity onPress={ViewCmnt}>
                <Text fontSize={14}>
                  View{' '}
                  {comments?.length > 1
                    ? `${comments?.length} comments`
                    : 'comment'}
                </Text>
              </TouchableOpacity>
            </Box>
          )}
        </Card>

        <ShareBox ref={Shareref} />
        <CommentBox
          navigation={navigation}
          ref={CmtRef}
          postId={postId}
          userId={userId}
        />
        <Divider />
      </Box>
    </GestureHandlerRootView>
  );
};

const ShareBox = forwardRef(({currentPost}, ref) => {
  const handleShareOtherApps = async () => {
    try {
      const postId = currentPost?.id;
      const username = currentPost?.username;
      if (!postId || !username) {
        console.error('Post ID or username is missing');
        return;
      }

      const deepLink = generateDeepLink(postId, username);

      const result = await Share.share({
        title: 'Instagram Post',
        message: `${deepLink}`,
      });

      ref.current.close();

      if (result.action === Share.sharedAction) {
        console.log('Post shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <>
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
        }}
        closeOnPressBack
        ref={ref}
        height={height / 5}>
        <Box flex={1} padding="s">
          <Text
            fontWeight="bold"
            padding="s"
            fontSize={16}
            textAlign="center"
            color="mainblack">
            Share
          </Text>
          <Box margin="l" justifyContent="center" flexDirection="row" gap="l">
            <TouchableOpacity
              onPress={() => {
                ref.current.close();
                console.log('Share within Instagram');
              }}>
              <Box
                justifyContent="center"
                alignItems="center"
                backgroundColor="dullwhite"
                height={50}
                width={50}
                borderRadius="xl">
                <Within />
              </Box>
              <Text fontSize={12}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShareOtherApps}>
              <Box
                justifyContent="center"
                alignItems="center"
                backgroundColor="dullwhite"
                height={50}
                width={50}
                borderRadius="xl">
                <LInk />
              </Box>
              <Text fontSize={12}>Other Apps</Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </RBSheet>
    </>
  );
});

const CommentBox = forwardRef(({postId, userId, navigation}, ref) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [userAvatar, setUserAvatar] = useState('');
  const [replyTxt, setReplyTxt] = useState([]);
  useEffect(() => {
    const fetchComments = async () => {
      const postRef = firestore().collection('posts').doc(postId);

      const unsubscribe = postRef.onSnapshot(doc => {
        if (doc.exists) {
          const postData = doc.data();
          setComments(postData.comments || []);
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
        createdAt: new Date().toISOString(),
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
            c.createdAt === comment.createdAt ? {...c, likes: updatedLikes} : c,
          ),
        });
    } catch (error) {
      console.error('Error liking comment: ', error);
    }
  };

  const handleReply = async (comment, replyText) => {
    if (replyText.trim() === '') return;

    try {
      const newReply = {
        userId: userId,
        comment: replyText,
        createdAt: new Date().toISOString(),
        likes: [],
      };

      const updatedReplies = [...comment.replies, newReply];

      await firestore()
        .collection('posts')
        .doc(postId)
        .update({
          comments: comments.map(c =>
            c.createdAt === comment.createdAt
              ? {...c, replies: updatedReplies}
              : c,
          ),
        });
    } catch (error) {
      console.error('Error replying to comment: ', error);
    }
  };

  const renderCommentItem = ({item}) => (
    <Box
      justifyContent="space-evenly"
      key={item.createdAt}
      paddingHorizontal="m"
      paddingVertical="s">
      {console.log('item: ', item)}
      <Box flexDirection="row" alignItems="center">
        <Avatar source={{uri: ''}} size="small" rounded />
        <Box marginLeft="s">
          <TouchableOpacity
            onPress={() =>
              navigation.push('ProfileView', {userId: item?.userId})
            }>
            <Text fontSize={14} color={'mainblack'} fontWeight={'400'}>
              {item?.userId}
            </Text>
          </TouchableOpacity>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Text fontSize={14} color={'mainblack'}>
              {item.comment}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleLikeComment(item, item.likes.includes(userId))
              }>
              <Text>
                {item.likes.includes(userId) ? (
                  <Heaty_f height="10" width="10" />
                ) : (
                  <Heaty_uf height="10" width="10" />
                )}
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
      <TouchableOpacity onPress={() => handleReply(item, 'Reply text')}>
        <Text fontSize={12}>Reply</Text>
      </TouchableOpacity>

      {item.replies && item.replies.length > 0 && (
        <Box marginLeft="l">
          {item.replies.map(reply => (
            <Box
              key={reply.createdAt}
              flexDirection="row"
              alignItems="center"
              marginTop="s">
              <Avatar source={{uri: reply.avatar}} size="small" rounded />
              <Box marginLeft="s">
                <Text fontWeight="bold">{reply.username}</Text>
                <Text>{reply.comment}</Text>
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
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.createdAt.toString()}
          ListEmptyComponent={
            <Text paddingVertical="s" textAlign="center">
              No comments yet
            </Text>
          }
        />
        <Input
          inputStyle={{fontSize: 14}}
          leftIcon={<Avatar source={{uri: userAvatar}} size="small" rounded />}
          rightIcon={
            <TouchableOpacity onPress={handleComment}>
              <Cmt_Share />
            </TouchableOpacity>
          }
          value={commentText}
          onChangeText={setCommentText}
          inputContainerStyle={{borderBottomWidth: 0}}
          placeholder="Write a comment"
        />
      </Box>
    </RBSheet>
  );
});

export default FeedPost;
