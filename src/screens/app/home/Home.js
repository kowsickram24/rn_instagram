import firestore from '@react-native-firebase/firestore';
import { Divider, Header } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { ScrollView,FlatList, TouchableOpacity } from 'react-native';
import {
  Camera,
  Heaty_uf,
  Insta_Typo_logo,
  Msg_Icon
} from '../../../constants/assets';
import { Box, Text } from '../../../theme';

import FeedPost from '../../../components/card/FeedPost';

const Home = ({navigation}) => {
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
        ProfileUrl={item.avatar}
        Caption={item.caption}
        // location={item.posts[0]?.location}
        // imageSrc={item.posts[0]?.imageUrl}
        // user={item.username}
      />
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
                <Msg_Icon />
              </TouchableOpacity>
            </Box>
          </Box>
        }
      />
      <Divider />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView>
          {/* <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text> No More Posts </Text>}
          /> */}
        </ScrollView>
      )}
    </Box>
  );
};

export default Home;
