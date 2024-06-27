import React, {useState, useEffect} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {Box, Text} from '../../../../theme';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('screen');
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
const PostsView = ({user, navigation}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = firestore().collection('posts');
        const userPosts = user?.posts || [];
        const fetchPromises = userPosts.map(async postId => {
          const postDoc = await postsRef.doc(postId).get();
          if (postDoc.exists) {
            return postDoc.data();
          } else {
            console.log(`Post with ID ${postId} does not exist.`);
            return null;
          }
        });

        // Execute all promises and set posts
        const fetchedPosts = await Promise.all(fetchPromises);
        setPosts(fetchedPosts.filter(post => post !== null));
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity onPress={() => navigation.navigate('PostInfo', {item})}>
        {item.mediaType === 'image' ? (
          <Image
            resizeMode="cover"
            style={{width: width / 3, height: 125}}
            source={{uri: item?.mediaUrl}}
          />
        ) : (
          <Video
          paused
            source={{uri: item?.mediaUrl}}
            style={{width: width / 3, height: 125}}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No Posts Yet</Text>
          </Box>
        }
        numColumns={3}
        contentContainerStyle={{
          flex: 1,
        }}
      />
    </Box>
  );
};

export default PostsView;
