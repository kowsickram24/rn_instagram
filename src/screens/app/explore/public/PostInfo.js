import {Box, Text} from '../../../../theme';
import {useState, useRef} from 'react';
import {
  FlatList,
  Share,
  Linking,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import FeedPost from '../../../../components/card/FeedPost';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, Divider, Input} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Cmt_Share, Heaty_uf, LInk, Within} from '../../../../constants/assets';
import {Avatar, ListItem} from '@rneui/themed';
const {width, height} = Dimensions.get('screen');

const PostInfo = ({route}) => {
  const RBref = useRef();
  const Optionref = useRef();
  const Shareref = useRef();
  const currentUser = useSelector(state => state.user.user);
  const User = route.params.user;
  const [posts, setPosts] = useState(User.posts);
  const [currentPost, setCurrentPost] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handleOption = () => {
    Optionref.current.open();
  };

  const openDeepLink = () => {
    const postId = generateUniqueId(); 
    const deepLink = generateDeepLink(postId, currentPost.username);
    Linking.openURL(deepLink);
  };

  const generateDeepLink = (postId, username) => {
    // Construct the deep link URL for sharing the post within the Instagram app
    const deepLink = `instagram://library?Local=share&Text=${encodeURIComponent(
      'Check out this post on Instagram:',
    )}&Link=instagram.com/post/${postId}&Owner=${encodeURIComponent(username)}`;
    return deepLink;
  };

  const handleShareOtherApps = async () => {
    try {
      const postId = generateUniqueId();
      const deepLink = generateDeepLink(postId, currentPost.username);
      console.log(deepLink);
      const result = await Share.share({
        title: 'Instagram Post',
        message: `${deepLink}`,
      });
      Shareref.current.close();
      if (result.action === Share.sharedAction) {
        console.log('Post shared');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const OpenCmtBox = item => {
    setCurrentPost(item);
    RBref.current.open();
  };

  const OpenShareSheet = item => {
    setCurrentPost(item);
    Shareref.current.open();
  };

  const handleLike = async item => {
    try {
      const postIndex = posts.findIndex(
        post => post.imageUrl === item.imageUrl,
      );
      if (postIndex !== -1) {
        const updatedPosts = [...posts];
        const post = updatedPosts[postIndex];

        const isLiked = post.likes.some(
          like => like.username === currentUser.username,
        );
        if (isLiked) {
          post.likes = post.likes.filter(
            like => like.username !== currentUser.username,
          );
        } else {
          post.likes.push({
            username: currentUser.username,
            profilepic: currentUser.profilepic,
          });
        }
        setPosts(updatedPosts);

        const userQuery = await firestore()
          .collection('instagram')
          .where('email', '==', User?.email)
          .get();

        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          await firestore()
            .collection('instagram')
            .doc(userDoc.id)
            .update({posts: updatedPosts});
          console.log('Post likes updated successfully');
        } else {
          console.error('User document not found');
        }
      }
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  };

  const generateUniqueId = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleComment = async () => {
    try {
      if (currentPost && commentText) {
        const postIndex = posts.findIndex(
          post => post.imageUrl === currentPost.imageUrl,
        );
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          const post = updatedPosts[postIndex];
          const newComment = {
            id: generateUniqueId(),
            username: currentUser.username,
            profilepic: currentUser.profilepic,
            comment: commentText,
            date: new Date().toISOString(),
          };
          post.comments.push(newComment);
          setPosts(updatedPosts);

          const userQuery = await firestore()
            .collection('instagram')
            .where('email', '==', User?.email)
            .get();

          if (!userQuery.empty) {
            const userDoc = userQuery.docs[0];
            await firestore()
              .collection('instagram')
              .doc(userDoc.id)
              .update({posts: updatedPosts});
            console.log('Comment added successfully');
            setCommentText('');
            RBref.current.close();
          } else {
            console.error('User document not found');
          }
        }
      }
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const renderItem = ({item}) => (
    <Box marginVertical="m">
      <FeedPost
        ProfileUrl={item.profilepic}
        user={item.username}
        location={item.location}
        Caption={item.caption}
        imageSrc={item.imageUrl}
        onOptionpress={handleOption}
        isLiked={item.likes.some(
          like => like.username === currentUser.username,
        )}
        isSaved={false}
        likedUsers={item.likes.map(like => like.username).join(', ')}
        onLikePress={() => handleLike(item)}
        oncommentPress={() => OpenCmtBox(item)}
        onSharePress={() => OpenShareSheet(item)}
        ViewCmnt={() => OpenCmtBox(item)}
        comments={item?.comments}
      />
    </Box>
  );

  const renderComments = ({item}) => {
    return (
      <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
        <Avatar size={'medium'} source={{uri: item?.profilepic}} rounded />
        <Box>
          <Text fontSize={12} color={'mainblack'}>
            {item?.username}
          </Text>
          <Text fontSize={14} color={'mainblack'}>
            {item?.comment}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No data Found</Text>}
      />
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            justifyContent: 'center',
          },
        }}
        closeOnPressBack
        ref={RBref}
        height={height / 2}>
        <Box flex={1} padding="s">
          <Text
            padding="s"
            fontWeight={'bold'}
            fontSize={12}
            textAlign="center"
            color="mainblack">
            Comments
          </Text>
          <Divider />
          <FlatList
            data={currentPost?.comments}
            renderItem={renderComments}
            keyExtractor={index => index.id.toString()}
            ListEmptyComponent={
              <Text paddingVertical={'s'} textAlign="center">
                No comments yet
              </Text>
            }
          />
          <Input
            leftIcon={
              <Avatar
                source={{uri: currentUser?.profilepic}}
                size={'small'}
                rounded
              />
            }
            rightIcon={
              <TouchableOpacity onPress={handleComment}>
                <Cmt_Share />
              </TouchableOpacity>
            }
            value={commentText}
            onChangeText={setCommentText}
            inputContainerStyle={{borderBottomWidth: 0}}
            placeholder="write a comment"
          />
        </Box>
      </RBSheet>
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            justifyContent: 'center',
          },
        }}
        closeOnPressBack
        ref={Optionref}
        height={height / 4}>
        <Box flex={1} padding="s" justifyContent="center">
          <Text padding="s" fontSize={16} textAlign="center" color="red">
            Report
          </Text>
          <Text padding="s" fontSize={16} textAlign="center" color="mainblack">
            Share Profile
          </Text>
        </Box>
      </RBSheet>
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
        }}
        closeOnPressBack
        ref={Shareref}
        height={height / 5}>
        <Box flex={1} padding="s">
          <Text
            fontWeight={'bold'}
            padding="s"
            fontSize={16}
            textAlign="center"
            color="mainblack">
            Share
          </Text>
          <Box
            margin={'l'}
            justifyContent="center"
            flexDirection="row"
            gap={'l'}>
            <TouchableOpacity
              onPress={() => {
                Shareref.current.close();
                console.log('Share within Instagram');
              }}>
              <Box
                justifyContent="center"
                alignItems="center"
                backgroundColor={'dullwhite'}
                height={50}
                width={50}
                borderRadius={'xl'}>
                <Within />
              </Box>
              <Text fontSize={12}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShareOtherApps}>
              <Box
                justifyContent="center"
                alignItems="center"
                backgroundColor={'dullwhite'}
                height={50}
                width={50}
                borderRadius={'xl'}>
                <LInk />
              </Box>
              <Text fontSize={12}>Other Apps</Text>
            </TouchableOpacity>
            {/* <Button title="Open Deep Link" onPress={openDeepLink} /> */}
          </Box>
        </Box>
      </RBSheet>
    </Box>
  );
};

export default PostInfo;
