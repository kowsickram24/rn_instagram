import firestore from '@react-native-firebase/firestore';
import { Divider, Header } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
  Heaty_uf,
  Insta_Typo_logo,
  Msg_Icon
} from '../../../constants/assets';
import { Box, Text } from '../../../theme';

import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import StoryAvatar from '../../../components/avatar/StoryAvatar';
import FeedPost from '../../../components/card/FeedPost';
import { Data } from '../../../utils/randomData';

const Home = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .onSnapshot(async snapshot => {
        const postsData = [];
        for (const doc of snapshot.docs) {
          const postData = {
            id: doc.id,
            ...doc.data(),
          };
          try {
            const userDoc = await firestore()
              .collection('users')
              .doc(postData.userId)
              .get();

            if (userDoc.exists) {
              postData.user = userDoc.data();
            } else {
              console.log(`User with ID ${postData.userId} not found.`);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }

          postsData.push(postData);
        }

        setPosts(postsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => (
    <FeedPost
      location={item?.location}
      ProfileUrl={item.user?.avatar}
      Caption={item.caption}
      userId={currentUser?.userId}
      postId={item?.postId}
      mediaSrc={item?.mediaUrl}
      mediaType={item?.mediaType}
      user={item?.user.username}
      comments={item?.comments}
      onProfilePress={() =>
        navigation.navigate('ProfileView', {userId: item?.userId})
      }
    />
  );

  const renderStory = ({item}) => (
    <Box alignItems="center">
      <StoryAvatar source={item?.Url} />
      <Text fontSize={12} color={'mainblack'} textAlign="center">
        {item?.name}
      </Text>
    </Box>
  );

  const ListHeaderComponent = () => (
    <>
      <Header
        statusBarProps={{hidden: true}}
        containerStyle={{paddingVertical: 12}}
        leftComponent={<Insta_Typo_logo width="120" />}
        backgroundColor="white"
        rightComponent={
          <Box flexDirection="row" gap={'m'}>
            <Box>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}>
                <Heaty_uf />
              </TouchableOpacity>
            </Box>
            <Box>
              <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                <Msg_Icon />
              </TouchableOpacity>
            </Box>
          </Box>
        }
      />
      <Divider />
      <Box paddingVertical={'s'}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={item => item.id}
          renderItem={renderStory}
          data={Data}
        />
      </Box>
      <Divider />
    </>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={<Text> No More Posts </Text>}
        />
      )}
    </Box>
  );
};

export default Home;
