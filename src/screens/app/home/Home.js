import {Divider} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React, {useState, useEffect} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import config from '../../../config';
import {
  Camera,
  Heaty_uf,
  IGTV,
  Insta_Typo_logo,
  Share,
} from '../../../constants/assets';
import firestore from '@react-native-firebase/firestore';
import notifee from '@notifee/react-native';
const Box = createBox();
const Text = createText();

import FeedPost from '../../../components/card/FeedPost';

const Home = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('instagram')
      .onSnapshot(snapshot => {
        const postsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({item}) => (
    <>
      {console.log(item.posts)}
      <FeedPost
        ProfileUrl={item.profilepic}
        Caption={item.caption}
        location={item.posts[0]?.location}
        imageSrc={item.posts[0]?.imageUrl}
        user={item.username}
      />
    </>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box
        paddingVertical={'s'}
        paddingHorizontal={'m'}
        flexDirection="row"
        alignItems="center"
        alignContent="center"
        justifyContent="space-between">
        <Camera />
        <Box al="center">
          <Insta_Typo_logo width="120" />
        </Box>
        <Box flexDirection="row" gap={'l'}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}>
            <Heaty_uf />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
            <Share />
          </TouchableOpacity>
        </Box>
      </Box>
      <Divider />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text> No More Posts </Text>}
        />
      )}
    </Box>
  );
};

export default Home;
