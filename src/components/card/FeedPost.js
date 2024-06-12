import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';
import {
  Comment,
  Save,
  Save_f,
  Heaty_uf,
  Heaty_f,
  Three_dots,
  Share,
} from '../../constants/assets';
import {Avatar, Card} from '@rneui/themed';
import {Image, TouchableOpacity, View} from 'react-native';
import config from '../../config';
const Box = createBox();
const Text = createText();
const CloudFront = config.CLDFRNTDOM;
const FeedPost = ({
  user,
  location,
  ProfileUrl,
  imageSrc,
  isLiked,
  Caption,
  likedUsers,
  isSaved,
  onLikePress,
  onSavePress,
  onOptionpress,
  oncommentPress
}) => {
  return (
    <Box marginVertical={'s'}>
      <Card
        containerStyle={{
          padding: 0,
          margin: 0,
          elevation: 0,
          borderWidth: 0,
        }}>
        <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
          <Avatar
            avatarStyle={{borderRadius: 21}}
            containerStyle={{width: 42, height: 42}}
            source={{uri: ProfileUrl}}
          />
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <Box flexDirection="column">
              <Text variant={'userName'}>{user}</Text>
              <Text variant={'ProInfo'}>{location}</Text>
            </Box>
            <TouchableOpacity onPress={onOptionpress}>
              <Box flex={1} padding={'s'} justifyContent="center" >
                <Three_dots />
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
        <Image
          resizeMode="cover"
          style={{
            height: 400,
            width: '100%',
          }}
          source={{uri: imageSrc}}
        />
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          padding={'s'}>
          <Box flexDirection="row" justifyContent="center"  gap={'m'}>
            <TouchableOpacity onPress={onLikePress}>
              {isLiked ? <Heaty_f /> : <Heaty_uf />}
            </TouchableOpacity>
            <TouchableOpacity onPress={oncommentPress}>
              <Comment />
            </TouchableOpacity>

            <TouchableOpacity>
              <Share />
            </TouchableOpacity>
          </Box>
          <TouchableOpacity onPress={onSavePress} style={{padding: 10}}>
            {isSaved ? <Save_f /> : <Save />}
          </TouchableOpacity>
        </Box>
        <Box paddingHorizontal={'s'}>
          <Text variant={'Liked'}>Liked by {likedUsers}</Text>
        </Box>
        <Box paddingVertical={'s'} paddingHorizontal={'s'}>
          <Text width={300} numberOfLines={1} variant={'Desc'}>
            {Caption}
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export default FeedPost;
