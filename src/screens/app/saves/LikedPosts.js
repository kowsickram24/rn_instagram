import firestore from '@react-native-firebase/firestore';
import { Header } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import { Box, Text } from '../../../theme';

const { width } = Dimensions.get('screen');

const fetchLikedPosts = async (email) => {
  const snapshot = await firestore()
    .collection('users')
    .where('email', '==', email)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    return userData.likedPosts || [];
  } else {
    return [];
  }
};

const fetchPostsDetails = async (likedPosts) => {
  const postPromises = likedPosts.map(postId =>
    firestore().collection('posts').doc(postId).get(),
  );
  const postSnapshots = await Promise.all(postPromises);
  return postSnapshots.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const LikedPosts = ({ navigation }) => {
  const currentUser = useSelector(state => state.user.user);

  const { data: likedPosts, isLoading: likedPostsLoading } = useQuery({
    queryKey: ['likedPosts', currentUser.email],
    queryFn: () => fetchLikedPosts(currentUser.email),
    enabled: !!currentUser.email,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['postsDetails', likedPosts],
    queryFn: () => fetchPostsDetails(likedPosts),
    enabled: !!likedPosts?.length,
  });

  if (likedPostsLoading || postsLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{ flex: 3 }}
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
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PostPage', { postId: item.id });
            }}>
            {item?.mediaUrls ? (
              <FastImage
                resizeMode="cover"
                source={{ uri: item?.mediaUrls[0] }}
                style={{ width: width / 3, height: width / 3 }}
              />
            ) : null}
            {item?.videoUrl ? (
              <Video
                resizeMode="cover"
                source={{ uri: item?.videoUrl }}
                style={{ width: width / 3, height: width / 3 }}
              />
            ) : null}
          </TouchableOpacity>
        )}
      />
    </Box>
  );
};

export default LikedPosts;
