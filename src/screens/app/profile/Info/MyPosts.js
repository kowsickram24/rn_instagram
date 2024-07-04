import firestore from '@react-native-firebase/firestore';
import { Skeleton } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  TouchableOpacity
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { Box, Text } from '../../../../theme';
const {width} = Dimensions.get('screen');

const MyPosts = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector(state => state.user.user);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = firestore()
        .collection('posts')
        .orderBy('time','desc')
        .where('userId', '==', currentUser?.userId)
        .onSnapshot(
          async snapshot => {
            setLoading(true);
            const userPosts = await Promise.all(
              snapshot.docs.map(async doc => {
                const postData = doc.data();
                const userSnapshot = await firestore()
                  .collection('users')
                  .doc(postData.userId)
                  .get();
                const userData = userSnapshot.exists ? userSnapshot.data() : {};
                return {id: doc.id, ...postData, user: userData};
              }),
            );
            setPosts(userPosts);
            setLoading(false);
          },
          error => {
            // console.error('Error fetching posts:', error);
            setLoading(false);
          },
        );
      return () => unsubscribe();
    }
  }, [currentUser]);

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDesc', {post: item})}>
        {item?.mediaUrls ? (
          <FastImage
            resizeMode="cover"
            style={{width: width / 3, height: width / 3}}
            source={{uri: item?.mediaUrls[0]}}
          />
        ) : item?.videoUrl ? (
          <Video
            paused
            source={{uri: item?.videoUrl}}
            style={{backgroundColor: 'red', width: 120, height: 120}}
            resizeMode="cover"
          />
        ) : null}
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

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      {loading ? (
        <FlatList
          data={[...Array(posts?.length).keys()]}
          renderItem={renderSkeletonItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{
            flex: 1,
          }}
        />
      ) : (
        <FlatList
          style={{flex: 1}}
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
