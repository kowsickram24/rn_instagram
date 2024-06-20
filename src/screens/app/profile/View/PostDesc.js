import firestore from '@react-native-firebase/firestore';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import ToastManager from 'toastify-react-native';
import FeedPost from '../../../../components/card/FeedPost';
import { Dustbin, Pencil } from '../../../../constants/assets';
import { Box, Text } from '../../../../theme';
const {width, height} = Dimensions.get('screen');

const PostDesc = ({ route, navigation }) => {
  const currentUser = useSelector(state => state.user.user);
  const [selectedPost, setSelectedPost] = useState();
  const RBref = useRef();
  const CmtRef = useRef();
  const [posts, setPosts] = useState([route.params.post]);
  console.log('posts: ', posts);

  const handleOptions = data => {
    RBref.current.open();
    setSelectedPost(data);
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
      { cancelable: false }
    );
  };

  const renderPostItem = ({ item }) => (
    <Box marginVertical="m">
      <FeedPost
        onOptionpress={() => handleOptions(item)}
        location={item?.location}
        Caption={item?.caption}
        imageSrc={item?.imageUrl}
        comments={item?.comments}
        user={item?.user?.username}
        ProfileUrl={item?.user?.avatar}
        likedUsers={item.likes}
        userId={currentUser?.userId}  
        postId={item?.postId}         
      />
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
        ref={RBref}
      >
        <Box alignItems="center" gap="xl" flex={1}>
          <Box marginVertical="l">
            <Text
              fontSize={18}
              fontWeight="bold"
              textAlign="center"
              color="mainblack"
            >
              Post
            </Text>
          </Box>
          <Box gap="xl" alignItems="center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Editpost', { selectedPost })}
            >
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
    </Box>
  );
};

export default PostDesc;
