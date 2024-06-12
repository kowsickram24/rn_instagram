import {createBox, createText} from '@shopify/restyle';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import FeedPost from '../../../../components/card/FeedPost';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dustbin, Pencil} from '../../../../constants/assets';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';
const Box = createBox();
const Text = createText();

const PostDesc = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [userData, setUserData] = useState();
  const [selectedPost, setSelectedPost] = useState();
  const RBref = useRef();
  const [posts, setPosts] = useState(route.params.posts);

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
              const userQuery = await firestore()
                .collection('instagram')
                .where('email', '==', currentUser.email)
                .get();

              if (!userQuery.empty) {
                const userDoc = userQuery.docs[0];
                const userData = userDoc.data();
                const userPosts = userData.posts || [];

                const updatedPosts = userPosts.filter(
                  post => post.imageUrl !== selectedPost.imageUrl,
                );

                await firestore()
                  .collection('instagram')
                  .doc(userDoc.id)
                  .update({posts: updatedPosts});
                setPosts(updatedPosts);

                console.log('Post deleted successfully');
                RBref.current.close();
                NavigationContainer.navigate('Profile');
              } else {
                console.error('User document not found');
              }
            } catch (error) {
              console.error('Error deleting post: ', error);
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
        ProfileUrl={item?.profilepic}
        user={item?.username}
        location={item?.location}
        Caption={item?.caption}
        imageSrc={item?.imageUrl}
      />
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="mainwhite">
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
        <Box alignItems="center" gap={'xl'} flex={1}>
          <Box marginVertical={'l'}>
            <Text
              fontSize={18}
              fontWeight={'bold'}
              textAlign="center"
              color={'mainblack'}>
              Post
            </Text>
          </Box>
          <Box gap={'xl'} alignItems="center">
            <TouchableOpacity
              onPress={() => navigation.navigate('Editpost', {selectedPost})}>
              <Box flexDirection="row" gap={'s'} alignItems="center">
                <Pencil />
                <Text fontSize={18} textAlign="center" color={'mainblack'}>
                  Edit
                </Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePost}>
              <Box flexDirection="row" gap={'s'} alignItems="center">
                <Dustbin />
                <Text fontSize={18} textAlign="center" color={'red'}>
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
