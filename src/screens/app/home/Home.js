import firestore from '@react-native-firebase/firestore';
import { Divider, Header, LinearProgress } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSelector } from 'react-redux';
import StoryAvatar from '../../../components/avatar/StoryAvatar';
import FeedPost from '../../../components/card/FeedPost';
import { Insta_Typo_logo, Msg_Icon, Notifi } from '../../../constants/assets';
import { ProgressContext } from '../../../context/Upload/progressCtxt';
import { Box, Text } from '../../../theme';
import { Data } from '../../../utils/randomData';

const fetchPosts = async (currentUser, setPosts, setLoading) => {
  const unsubscribe = firestore()
    .collection('posts')
    .orderBy('time', 'desc')
    .onSnapshot(async (snapshot) => {
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

  return unsubscribe;
};

const Home = ({ navigation }) => {
  const currentUser = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutedStates, setMutedStates] = useState({});
  const { progress } = useContext(ProgressContext);

  const toggleMute = (postId) => {
    setMutedStates((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  useEffect(() => {
    const unsubscribe = fetchPosts(currentUser, setPosts, setLoading);
    return () => unsubscribe();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <Box>
      <FeedPost
        location={item?.location}
        ProfileUrl={item.user?.avatar}
        Caption={item.caption}
        userId={currentUser?.userId}
        postId={item?.postId}
        user={item?.user.username}
        comments={item?.comments}
        time={item?.time}
        onProfilePress={() =>
          navigation.navigate('ProfileView', { userId: item?.userId })
        }
        mediaSrc={item?.mediaUrls}
        isMuted={!mutedStates[item.postId]}
        toggleMute={() => toggleMute(item.postId)}
      />
    </Box>
  );

  const renderStory = ({ item }) => (
    <TouchableWithoutFeedback>
      <Box alignItems="center">
        <StoryAvatar source={item?.Url} />
        <Text fontSize={12} color={'mainblack'} textAlign="center">
          {item?.name}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );

  const ListHeaderComponent = () => (
    <>
      <Header
        statusBarProps={{ hidden: true }}
        leftComponent={<Insta_Typo_logo width="120" />}
        backgroundColor="white"
        rightComponent={
          <Box flexDirection="row" gap={'m'}>
            <Box>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notifications')}>
                <Notifi />
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
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={item => item.id}
          renderItem={renderStory}
          data={Data}
        />
      </Box>

      {progress > 0 && (
        <Box gap={'s'} padding={'s'}>
          <Text color={'mainblack'} fontSize={12}>
            {progress === 100 ? 'Uploaded Post' : `Uploading ${progress}%`}
          </Text>
          <LinearProgress color="#3797EF" value={progress} />
        </Box>
      )}
    </>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        overScrollMode="never"
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          <Text
            fontWeight={'heavy'}
            color={'mainblack'}
            fontSize={14}
            textAlign="center">
            No More Feeds
          </Text>
        }
      />
    </Box>
  );
};

export default Home;
