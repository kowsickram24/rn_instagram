import { firestore } from '../../../../firebase.config';
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

const fetchSavedPosts = async (email) => {
  const snapshot = await firestore()
    .collection('users')
    .where('email', '==', email)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    return userData.savedPosts || [];
  } else {
    return [];
  }
};

const fetchPostsDetails = async (savedPosts) => {
  const postPromises = savedPosts.map(postId =>
    firestore().collection('posts').doc(postId).get(),
  );
  const postSnapshots = await Promise.all(postPromises);
  return postSnapshots.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const SavedPosts = ({ navigation }) => {
  const currentUser = useSelector(state => state.user.user);

  const { data: savedPosts, isLoading: savedPostsLoading } = useQuery({
    queryKey: ['savedPosts', currentUser.email],
    queryFn: () => fetchSavedPosts(currentUser.email),
    enabled: !!currentUser.email,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['postsDetails', savedPosts],
    queryFn: () => fetchPostsDetails(savedPosts),
    enabled: !!savedPosts?.length,
  });

  if (savedPostsLoading || postsLoading) {
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
            <Text color={'mainblack'}>Saves</Text>
          </Box>
        }
      />

      <FlatList
        horizontal
        data={posts}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} alignItems="center">
            <Text>No Saved Posts Yet</Text>
          </Box>
        }
        renderItem={({ item }) => (
          <Box >
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PostPage', { postId: item.id })
            }>
            {item?.mediaUrls ? (
              <FastImage
                resizeMode="cover"
                source={{ uri: item?.mediaUrls[0] }}
                style={{ width: width / 3, height: width / 3, borderRadius:10 }}
              />
            ) : null}
            {item?.videoUrl ? (
              <Video
                playWhenInactive
                resizeMode="cover"
                source={{ uri: item?.videoUrl }}
                style={{ width: width / 3, height: width / 3 }}
              />
            ) : null}
          </TouchableOpacity>
          </Box>
        )}
      />
    </Box>
  );
};

export default SavedPosts;
