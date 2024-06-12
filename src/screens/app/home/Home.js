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
      <FlatList ListEmptyComponent={<Text> No More Posts </Text>} />
    </Box>
  );
};

export default Home;
