import {createBox, createText} from '@shopify/restyle';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Dimensions, TouchableOpacity} from 'react-native';
import FeedPost from '../../../../components/card/FeedPost';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Cmt_Share, Dustbin, Pencil} from '../../../../constants/assets';
import {useSelector} from 'react-redux';
import {Divider} from 'react-native-paper';
import {Input, Avatar} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
import ToastManager, {Toast} from 'toastify-react-native';
const {width, height} = Dimensions.get('screen');
const Box = createBox();
const Text = createText();

const PostDesc = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [selectedPost, setSelectedPost] = useState();
  const RBref = useRef();
  const CmtRef = useRef();
  const [commentText, setCommentText] = useState('');
  const [posts, setPosts] = useState([route.params.post]);

  const handleOptions = data => {
    RBref.current.open();
    setSelectedPost(data);
  };

  const handleComment = async () => {
    try {
      if (selectedPost && commentText) {
        const postIndex = posts.findIndex(
          post => post.imageUrl === selectedPost.imageUrl,
        );
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          const post = updatedPosts[postIndex];
          const newComment = {
            username: currentUser.username,
            profilepic: currentUser.profilepic,
            comment: commentText,
            date: new Date().toISOString(),
          };
          post.comments.push(newComment);
          setPosts(updatedPosts);

          const postRef = firestore()
            .collection('posts')
            .doc(selectedPost.postId);
          await postRef.update({comments: post.comments});

          setCommentText('');
          CmtRef.current.close();
        }
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentPress = item => {
    CmtRef.current.open();
    setSelectedPost(item);
  };
  const handleLikePress = async postId => {
    try {
      const postRef = firestore().collection('posts').doc(postId);

      if (selectedPost.likes.includes(currentUser.userId)) {
        await postRef.update({
          likes: firestore.FieldValue.arrayRemove(currentUser.userId),
        });
      } else {
        await postRef.update({
          likes: firestore.FieldValue.arrayUnion(currentUser.userId),
        });
      }

      // Assuming you update the state of 'posts' or fetch updated data after this action
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSavePress = async (postId) => {
    try {
      console.log(postId)
      const userRef = firestore().collection('users').doc(currentUser?.userId);
      if (currentUser && selectedPost) {
        if (!currentUser.savedposts.includes(postId)) {
          await userRef.update({
            savedposts: firestore.FieldValue.arrayUnion(postId),
          });
        } else {
          await userRef.update({
            savedposts: firestore.FieldValue.arrayRemove(postId),
          });
        }
      } else {
        console.error('Current user or selected post is undefined');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };
  

  const handleDeletePost = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const postRef = firestore()
                .collection('posts')
                .doc(selectedPost.postId);
              await postRef.delete();

              const userRef = firestore()
                .collection('users')
                .doc(currentUser?.userId);
              await userRef.update({
                posts: firestore.FieldValue.arrayRemove(selectedPost.postId),
              });

              RBref.current.close();
              navigation.navigate('Profile');
            } catch (error) {
              console.error('Error deleting post:', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const renderPostItem = ({item}) => (
    <Box marginVertical="m">
      <FeedPost
        onOptionpress={() => handleOptions(item)}
        location={item?.location}
        Caption={item?.caption}
        imageSrc={item?.imageUrl}
        comments={item?.comments}
        user={currentUser?.username}
        ProfileUrl={currentUser?.avatar}
        isSaved={currentUser.savedposts?.includes(item.postId)}
        isLiked={item.likes?.includes(currentUser?.userId)}
        ViewCmnt={() => CmtRef.current.open()}
        onLikePress={() => handleLikePress(item.postId)}
        oncommentPress={() => handleCommentPress(item)}
        onSavePress={() => handleSavePress(item?.postId)}
        likedUsers={item.likes}
      />
    </Box>
  );

  const renderComments = ({item}) => (
    <Box padding="s" flexDirection="row" alignItems="center" gap="s">
      <Avatar size="medium" source={{uri: item?.avatar}} rounded />
      <Box>
        <Text fontSize={12} color="mainblack">
          {item?.username}
        </Text>
        <Text fontSize={14} color="mainblack">
          {item?.comment}
        </Text>
      </Box>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <ToastManager position="top" />
      <FlatList
        data={posts}
        ListEmptyComponent={<Text>No Posts</Text>}
        renderItem={renderPostItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 45,
            borderTopLeftRadius: 45,
            justifyContent: 'center',
          },
        }}
        height={250}
        ref={RBref}>
        <Box alignItems="center" gap="xl" flex={1}>
          <Box marginVertical="l">
            <Text
              fontSize={18}
              fontWeight="bold"
              textAlign="center"
              color="mainblack">
              Post
            </Text>
          </Box>
          <Box gap="xl" alignItems="center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Editpost', {selectedPost})}>
              <Box flexDirection="row" gap="s" alignItems="center">
                <Pencil />
                <Text fontSize={18} textAlign="center" color="mainblack">
                  Edit
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePost}>
              <Box flexDirection="row" gap="s" alignItems="center">
                <Dustbin />
                <Text fontSize={18} textAlign="center" color="red">
                  Delete
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>
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
        ref={CmtRef}
        height={height / 2}>
        <Box flex={1} padding="s">
          <Text
            padding="s"
            fontWeight="bold"
            fontSize={12}
            textAlign="center"
            color="mainblack">
            Comments
          </Text>
          <Divider />
          <FlatList
            data={selectedPost?.comments}
            renderItem={renderComments}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <Text paddingVertical="s" textAlign="center">
                No comments yet
              </Text>
            }
          />
          <Input
            leftIcon={
              <Avatar
                source={{uri: currentUser?.avatar}}
                size="small"
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
            placeholder="Write a comment"
          />
        </Box>
      </RBSheet>
    </Box>
  );
};

export default PostDesc;
