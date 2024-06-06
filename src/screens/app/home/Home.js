import React from 'react';
import {createBox, createText} from '@shopify/restyle';
import {
  Camera,
  Comment,
  Heaty_uf,
  IGTV,
  Insta_Typo_logo,
  Save,
  Share,
} from '../../../constants/assets';
import {Divider, Card} from '@rneui/themed';
import {Image, ScrollView, TouchableOpacity} from 'react-native';
import config from '../../../config';

const Box = createBox();
const Text = createText();
const Home = ({navigation}) => {


  const CloudFront = config.CLDFRNTDOM;
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
          <IGTV />
          <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
          <Share />
          </TouchableOpacity>
        </Box>
      </Box>
      <Divider />
      <ScrollView flex={1}>
        <Card
          containerStyle={{
            padding: 0,
            margin: 0,
          }}>
          <Box>
            <Text>New Post</Text>
            <Text>Mexico</Text>
          </Box>
          <Image
            resizeMode="cover"
            style={{
              height: 400,
            }}
            source={{uri: `${CloudFront}/bird 1.jpg`}}
          />
          <Box flexDirection="row" justifyContent="space-between" padding={'m'}>
            <Box flexDirection="row" gap={'m'}>
              <Heaty_uf />
              <Comment />
              <Share />
            </Box>
            <Save />
          </Box>
          <Text>Liked by .....</Text>
          <Text>Bird </Text>
        </Card>
      </ScrollView>
    </Box>
  );
};

export default Home;
