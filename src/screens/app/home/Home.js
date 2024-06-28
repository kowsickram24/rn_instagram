import firestore from '@react-native-firebase/firestore';
import {Divider, Header} from '@rneui/themed';
import React, {Fragment, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import StoryAvatar from '../../../components/avatar/StoryAvatar';
import FeedPost from '../../../components/card/FeedPost';
import {Heaty_uf, Insta_Typo_logo, Msg_Icon} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {Data} from '../../../utils/randomData';
const Home = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutedStates, setMutedStates] = useState({});
  const toggleMute = postId => {
    setMutedStates(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
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
          if (postData.userId !== currentUser?.userId) {
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
        }

        setPosts(postsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [currentUser]);

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
        videoSrc={item?.videoUrl}
        isMuted={!!mutedStates[item.postId]}
        toggleMute={() => toggleMute(item.postId)}
      />
    </Box>
  );

  const renderStory = ({item}) => (
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
        statusBarProps={{hidden: true}}
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
          overScrollMode="never"
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
    <Fragment>
      <Box flex={1} backgroundColor={'mainwhite'}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            overScrollMode="never"
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={
              <Text fontSize={14} textAlign="center">
                {' '}
                No More Feeds{' '}
              </Text>
            }
          />
        )}
      </Box>
    </Fragment>
  );
};

export default Home;
