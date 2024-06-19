import {Avatar, Card, Input, Dialog, Header} from '@rneui/themed';
import React, {useRef, forwardRef} from 'react';
import {useState, useEffect} from 'react';
import {FlatList, Dimensions, Image, TouchableOpacity} from 'react-native';
import {Skeleton} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

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
            <Text fontWeight={'600'} color={'mainblack'}>
              {user}
            </Text>
          </TouchableOpacity>
          <Text variant={'ProInfo'}>{location}</Text>
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
  likedUsers,
  onOptionpress,
  ViewCmnt,
  comments,
  userId,  
  postId   
}) => {
  const navigation = useNavigation();
  const CmtRef = useRef();
  const Shareref = useRef();
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchUsers = async () => {
    try {
      const postRef = firestore().collection('users');
      const snapshot = await postRef.get();
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('fetchedUsers: ', fetchedUsers);
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
      console.log('fetchedPosts: ', fetchedPosts);
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

        const newLikes = postDoc.data().likes + (isLiked ? -1 : 1);
        transaction.update(postRef, { likes: newLikes });

        const likedPosts = userDoc.data().likedPosts || [];
        if (isLiked) {
          transaction.update(userRef, {
            likedPosts: likedPosts.filter(id => id !== postId),
          });
        } else {
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
        <Image
          resizeMode="cover"
          style={{
            height: 400,
            width: '100%',
          }}
          source={{ uri: imageSrc }}
        />
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
          <TouchableOpacity onPress={onSavePress} style={{ padding: 10 }}>
            {isSaved ? <Save_f /> : <Save />}
          </TouchableOpacity>
        </Box>
        <TouchableOpacity onPress={() => navigation.navigate('LikedUsers')}>
          <Text padding={'s'} color={'mainblack'} fontWeight={'500'}>
            {likedUsers?.length > 0 && likedUsers?.length} likes
          </Text>
        </TouchableOpacity>
        <Box paddingHorizontal={'s'}>
          <Text variant={'Liked'}>Liked by {likedUsers}</Text>
        </Box>
        <Box paddingVertical={'s'} paddingHorizontal={'s'}>
          <Text width={300} numberOfLines={1} variant={'Desc'}>
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
      {comments?.map((comment, index) => (
        <Box
          key={index}
          paddingHorizontal={'s'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <TouchableOpacity onPress={ViewCmnt}>
            <Box marginLeft="s" flexDirection="row" gap={'s'}>
              <Text fontSize={14} color={'mainblack'}>
                {comment?.username}
              </Text>
              <Text fontSize={14} color={'mainblack'}>
                {comment?.comment}
              </Text>
            </Box>
          </TouchableOpacity>
          <Box>
            <Heaty_uf height="10" width="10" />
          </Box>
        </Box>
      ))}
      <ShareBox ref={Shareref} />
      <CommentBox ref={CmtRef} />
    </Box>
  );
};


const ShareBox = forwardRef(({ currentPost }, ref) => {
  const generateDeepLink = (postId, username) => {
    const deepLink = `instagram://library?Local=share&Text=${encodeURIComponent(
      'Check out this post on Instagram:'
    )}&Link=instagram.com/post/${postId}&Owner=${encodeURIComponent(username)}`;
    return deepLink;
  };

  const handleShareOtherApps = async () => {
    try {
      const postId = currentPost?.id;
      const username = currentPost?.username;
      if (!postId || !username) {
        console.error('Post ID or username is missing');
        return;
      }

      const deepLink = generateDeepLink(postId, username);
      console.log(deepLink);

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
        height={height / 5}
      >
        <Box flex={1} padding="s">
          <Text
            fontWeight="bold"
            padding="s"
            fontSize={16}
            textAlign="center"
            color="mainblack"
          >
            Share
          </Text>
          <Box
            margin="l"
            justifyContent="center"
            flexDirection="row"
            gap="l"
          >
            <TouchableOpacity
              onPress={() => {
                ref.current.close();
                console.log('Share within Instagram');
              }}
            >
              <Box
                justifyContent="center"
                alignItems="center"
                backgroundColor="dullwhite"
                height={50}
                width={50}
                borderRadius="xl"
              >
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
                borderRadius="xl"
              >
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


const CommentBox = forwardRef(({postId, currentUser}, ref) => {
  const [commentText, setCommentText] = useState('');

  const handleComment = async () => {
    if (commentText.trim() === '') return;

    try {
      const newComment = {
        userId: currentUser?.userId,
        comment: commentText,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      await firestore.collection('posts').doc(postId).add(newComment);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment: ', error);
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
      <Box flex={1}>
        <Text
          padding="s"
          fontWeight="bold"
          fontSize={12}
          textAlign="center"
          color="mainblack">
          Comments
        </Text>
        <Divider bold />
        <FlatList
          // data={comments}
          // renderItem={renderComments}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text paddingVertical="s" textAlign="center">
              No comments yet
            </Text>
          }
        />
        {/* <EmojiReactions /> */}
        <Divider bold />
        <Input
          leftIcon={
            <Avatar source={{uri: currentUser?.avatar}} size="small" rounded />
          }
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


