import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Header, Divider, LinearProgress, Button} from '@rneui/themed';
import {
  Insta_Typo_logo,
  Msg_Icon,
  Notifi,
  Reels,
} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {usePosts} from '../../../hooks/data/fetchPosts';
import StoryAvatar from '../../../components/avatar/StoryAvatar';
import FeedPost from '../../../components/card/FeedPost';
import {ProgressContext} from '../../../context/Upload/progressCtxt';
import {fetchStories} from '../../../store/slices/storiesSlice';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const stories = useSelector(state => state.stories.stories);
  const {data: postData, isSuccess: postsFetched, refetch} = usePosts();
  const currentUser = useSelector(state => state.user.user);
  const {progress} = useContext(ProgressContext);
  const [mutedStates, setMutedStates] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (postsFetched) {
      setRefreshing(false);
    }
  }, [postsFetched]);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const toggleMute = postId => {
    setMutedStates(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };



  const renderItem = ({item}) => (
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
          navigation.navigate('ProfileView', {userId: item?.userId})
        }
        mediaSrc={item?.mediaUrls}
        isMuted={!mutedStates[item.postId]}
        toggleMute={() => toggleMute(item.postId)}
      />
    </Box>
  );

  const renderStory = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('Stories', {stories: stories})}>
      <Box alignItems="center">
        <StoryAvatar source={item?.user?.avatar} />
        <Text
          fontSize={12}
          numberOfLines={1}
          color={'mainblack'}
          textAlign="center">
          {item?.user?.username}
        </Text>
      </Box>
    </TouchableWithoutFeedback>
  );

  const ListHeaderComponent = () => (
    <>
      <Header
        statusBarProps={{hidden: true}}
        leftComponent={<Insta_Typo_logo width="120" />}
        backgroundColor="white"
        rightComponent={
          <Box flexDirection="row" gap={'m'}>
            <Box>
              <TouchableOpacity
                onPress={() => navigation.navigate('ReelsFeed')}>
                <Reels />
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
          data={stories}
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

  const onRefresh = () => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        overScrollMode="never"
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        data={postData}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3797EF']}
          />
        }
      />

    </Box>
  );
};

export default Home;
