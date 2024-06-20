import firestore from '@react-native-firebase/firestore';
import {Badge, Divider, Header} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {
  Camera,
  Heaty_uf,
  Insta_Typo_logo,
  Msg_Icon,
} from '../../../constants/assets';
import {Box, Text} from '../../../theme';

import FeedPost from '../../../components/card/FeedPost';
import StoryAvatar from '../../../components/avatar/StoryAvatar';
import {StoryData} from '../../../utils/randomData';
import {useSelector} from 'react-redux';

const Home = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .onSnapshot(snapshot => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        console.log('postsData: ', postsData);

        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => (
    <>
      <FeedPost
        location={item?.location}
        ProfileUrl={item.user?.avatar}
        Caption={item.caption}
        userId={currentUser?.userId}
        postId={item?.postId}
        // location={item.posts[0]?.location}
        imageSrc={item?.imageUrl}
        user={item?.user?.username}
        comments={item?.comments}
      />
    </>
  );
  const renderStory = ({item}) => (
    <>
      <Box alignItems="center">
        <StoryAvatar source={item?.Url} />
        <Text fontSize={12} color={'mainblack'} textAlign="center">
          {item?.name}
        </Text>
      </Box>
    </>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        placement="center"
        barStyle="default"
        statusBarProps={{
          hidden: true,
        }}
        containerStyle={{
          paddingVertical: 12,
        }}
        leftComponent={<Camera />}
        centerComponent={<Insta_Typo_logo width="120" />}
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
                <Badge
                
                  badgeStyle={{backgroundColor: 'red'}}
                  value={10}
                  textStyle={{color:'white', fontSize:10}}
                  containerStyle={{position: 'absolute', bottom: 12, left: 12}}
                />
                <Msg_Icon />
              </TouchableOpacity>
            </Box>
          </Box>
        }
      />
      <Divider />
      <Box paddingVertical={'s'}>
        <ScrollView>
          <FlatList
            scrollEnabled
            horizontal
            keyExtractor={item => item.id}
            renderItem={renderStory}
            data={StoryData}
          />
        </ScrollView>
      </Box>
      <Divider />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text> No More Posts </Text>}
          />
        </ScrollView>
      )}
    </Box>
  );
};

export default Home;
