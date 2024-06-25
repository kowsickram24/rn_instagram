import firestore from '@react-native-firebase/firestore';
import { Header } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import { Box, Text } from '../../../theme';
const {width, height} = Dimensions.get('screen');
const LikedPosts = ({navigation}) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log('posts: ', posts);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('email', '==', currentUser.email)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();
            setLikedPosts(userData.likedPosts || []);
          } else {
            setLikedPosts([]);
          }
        },
        error => {
          console.error('Error fetching liked posts:', error);
        },
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (likedPosts.length > 0) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const postPromises = likedPosts.map(postId =>
            firestore().collection('posts').doc(postId).get(),
          );
          const postSnapshots = await Promise.all(postPromises);
          const fetchedPosts = postSnapshots.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [likedPosts]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}>Likes</Text>
          </Box>
        }
      />

      <FlatList
        horizontal
        data={posts}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text textAlign="center">No Liked Posts Yet</Text>}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PostPage', {postId: item.id});
            }}>
            {item.mediaType === 'image' ? (
              <FastImage
                resizeMode="cover"
                source={{uri: item?.mediaUrl}}
                style={{width: width / 3, height: width / 3}}
              />
            ) : (
              <Video
                controls
                resizeMode="cover"
                source={{uri: item?.mediaUrl}}
                style={{width: width / 3, height: width / 3}}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </Box>
  );
};

export default LikedPosts;
