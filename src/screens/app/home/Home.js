import {Divider} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import config from '../../../config';
import {
  Camera,
  Heaty_uf,
  IGTV,
  Insta_Typo_logo,
  Share,
} from '../../../constants/assets';
import notifee from '@notifee/react-native';
const Box = createBox();
const Text = createText();

import FeedPost from '../../../components/card/FeedPost';

const Home = ({navigation}) => {
  const CloudFront = config.CLDFRNTDOM;

  const [posts, setPosts] = useState([
    {
      user: 'Sam',
      location: 'Mexico',
      ProfileUrl: `https://randomuser.me/api/portraits/men/26.jpg`,
      imageSrc: `${CloudFront}/bird 1.jpg`,
      isLiked: false,
      Caption: 'Beautiful bird!',
      likedUsers: 'user1, user2',
      isSaved: false,
    },
  ]);

  const handleLikePress = async index => {
    setPosts(prevPosts => {
      const newPosts = [...prevPosts];
      newPosts[index].isLiked = !newPosts[index].isLiked;
      return newPosts;
    });

    try {
      const updatedPosts = [...posts];
      const isLiked = updatedPosts[index].isLiked;
      if (isLiked) {
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          sound: 'default',
        });
        await notifee.displayNotification({
          title: 'Like',
          body: `  liked your post.`,
          android: {
            channelId,
            color: '#4caf50',
            pressAction: {
              id: 'default',
            },
          },
        });
      }
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  const handleSavePress = index => {
    setPosts(prevPosts => {
      const newPosts = [...prevPosts];
      newPosts[index].isSaved = !newPosts[index].isSaved;
      return newPosts;
    });
  };

  const renderItem = ({item, index}) => (
    <FeedPost
      user={item.user}
      location={item.location}
      ProfileUrl={item.ProfileUrl}
      imageSrc={item.imageSrc}
      isLiked={item.isLiked}
      Caption={item.Caption}
      likedUsers={item.likedUsers}
      isSaved={item.isSaved}
      onLikePress={() => handleLikePress(index)}
      onSavePress={() => handleSavePress(index)}
    />
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
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </Box>
  );
};

export default Home;
