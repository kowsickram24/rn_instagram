import firestore from '@react-native-firebase/firestore';
import {Skeleton} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {Box, Text} from '../../../../theme';
const {width} = Dimensions.get('screen');
const MyPosts = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(state => state.user.user);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postSnapshot = await firestore()
        .collection('posts')
        .where('userId', '==', currentUser?.userId)
        .get();

      const userPosts = await Promise.all(
        postSnapshot.docs.map(async doc => {
          const postData = doc.data();
          const userSnapshot = await firestore()
            .collection('users')
            .doc(postData.userId)
            .get();
          const userData = userSnapshot.exists ? userSnapshot.data() : {};
          return {...postData, user: userData};
        }),
      );

      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDesc', {post: item})}>
        {item.mediaType === 'image' ? (
          <FastImage
            resizeMode="cover"
            style={{width: width / 3, height: width / 3}}
            source={{uri: item?.mediaUrl}}
          />
        ) : (
          <Video
            paused
            poster="Video"
            source={{uri: item?.mediaUrl}}
            style={{width: width / 3, height: width / 3}}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    </Box>
  );

  const renderSkeletonItem = () => (
    <Skeleton
      animation="pulse"
      style={{
        width: width / 3,
        height: 125,
        margin: 2,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
      }}
    />
  );

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      {loading ? (
        <FlatList
          data={[...Array(9).keys()]}
          renderItem={renderSkeletonItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{
            flex: 1,
          }}
        />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchPosts} />
          }
          data={posts}
          renderItem={renderPostItem}
          keyExtractor={(item, index) => index.toString()}
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
      )}
    </Box>
  );
};
export default MyPosts;
