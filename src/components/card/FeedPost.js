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
import {Avatar, Card, ListItem} from '@rneui/themed';
import {Image, TouchableOpacity, View} from 'react-native';
const Box = createBox();
const Text = createText();

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
  onSharePress,
  oncommentPress,
  ViewCmnt,
  onProfilePress,
  comments,
}) => {
  return (
    <Box>
      <Card
        containerStyle={{
          padding: 0,
          margin: 0,
          elevation: 0,
          borderWidth: 0,
        }}>
        <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
          <TouchableOpacity onPress={onProfilePress}>
            <Avatar
              avatarStyle={{borderRadius: 21}}
              containerStyle={{width: 42, height: 42}}
              source={{uri: ProfileUrl}}
            />
          </TouchableOpacity>
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <Box flexDirection="column">
              <TouchableOpacity onPress={onProfilePress}>
                <Text variant={'userName'}>{user}</Text>
              </TouchableOpacity>
              <Text variant={'ProInfo'}>{location}</Text>
            </Box>
            <TouchableOpacity onPress={onOptionpress}>
              <Box flex={1} padding={'s'} justifyContent="center">
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
          <Box flexDirection="row" justifyContent="center" gap={'m'}>
            <TouchableOpacity onPress={onLikePress}>
              {isLiked ? <Heaty_f /> : <Heaty_uf />}
            </TouchableOpacity>
            <TouchableOpacity onPress={oncommentPress}>
              <Comment />
            </TouchableOpacity>

            <TouchableOpacity onPress={onSharePress}>
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
            {user} {Caption}
          </Text>
        </Box>
        {comments?.length > 0 && (
          <Box paddingVertical="s" paddingHorizontal="s">
            <TouchableOpacity onPress={ViewCmnt}>
              <Text fontSize={14}>
                View{' '}
                {comments?.length > 1
                  ? `${comments?.length} comments`
                  : 'comment'}
              </Text>
            </TouchableOpacity>
          </Box>
        )}
      </Card>
      {comments?.map((comment, index) => (
        <Box
          key={index}
          paddingHorizontal={'s'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <TouchableOpacity onPress={ViewCmnt}>
            <Box marginLeft="s" flexDirection="row" gap={'s'}>
              <Text fontSize={14} color={'mainblack'}>
                {comment.username}
              </Text>
              <Text fontSize={14} color={'mainblack'}>
                {comment.comment}
              </Text>
            </Box>
          </TouchableOpacity>
          <Box>
            <Heaty_uf height="10" width="10" />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default FeedPost;
