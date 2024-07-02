import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, Image, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import {Box, Text} from '../../../../theme';
const {width, height} = Dimensions.get('screen');
const PostsView = ({user, navigation}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = firestore().collection('posts');
        const userPosts = user?.posts || [];

        const unsubscribe = postsRef.onSnapshot(snapshot => {
          const fetchedPosts = [];

          snapshot.forEach(doc => {
            if (userPosts.includes(doc.id)) {
              fetchedPosts.push(doc.data());
            }
          });

          setPosts(fetchedPosts);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [user]);

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity onPress={() => navigation.navigate('PostInfo', {item})}>
        {item?.mediaUrls ? (
          <Image
            resizeMode="cover"
            style={{width: width / 3, height: 125}}
            source={{uri: item?.mediaUrls[0]}}
          />
        ) : null}
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
