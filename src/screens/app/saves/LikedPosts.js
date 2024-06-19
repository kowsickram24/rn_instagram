import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Header} from '@rneui/themed';
import {Box, Text} from '../../../theme';
import {Back} from '../../../constants/assets';
import firestore from '@react-native-firebase/firestore';

import { useSelector } from 'react-redux';
const {width, height} = Dimensions.get('screen')
const LikedPosts = ({navigation}) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box flexDirection="row" alignItems="center" gap={'s'}>
              <Back />
              <Text color={'mainblack'}>Likes</Text>
            </Box>
          </TouchableOpacity>
        }
      />

      <ScrollView>
        <FlatList
        horizontal
          data={posts}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text>No Liked Posts Yet</Text>}
          renderItem={({item}) => (
            <Image
            resizeMode='cover'
              source={{uri: item?.imageUrl}}
              style={{width: width /3, height: width /3}}
            />
          )}
        />
      </ScrollView>
    </Box>
  );
};

export default LikedPosts;
