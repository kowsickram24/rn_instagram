import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Box, Text} from '../../theme';
import {Avatar, Card} from '@rneui/themed';

const ProfileCard = ({
  userAvatar,
  Postcount,
  followersCount,
  followingCount,
  onFollowersPress,
  onFollowingPress,
  onAvatarLongPress,
  onAvatarPressout,
}) => {
  return (
    <Box
      flexDirection="row"
      paddingVertical={'s'}
      alignItems="center"
      justifyContent="space-evenly">
      <TouchableWithoutFeedback
        onPressOut={onAvatarPressout}
        onLongPress={onAvatarLongPress}>
        <Avatar
          rounded
          size={'large'}
          source={{
            uri: userAvatar,
          }}
        />
      </TouchableWithoutFeedback>
      <Box gap={'xl'} alignItems="center" flexDirection="row">
        <Card
          containerStyle={{
            padding: 0,
            margin: 0,
            elevation: 0,
            borderWidth: 0,
          }}>
          <Text
            color={'mainblack'}
            fontWeight={'500'}
            fontSize={16}
            textAlign="center">
            {Postcount}
          </Text>
          <Text color={'mainblack'} fontSize={13}>
            posts
          </Text>
        </Card>

        <Card
          containerStyle={{
            padding: 0,
            margin: 0,
            elevation: 0,
            borderWidth: 0,
          }}>
          <TouchableOpacity onPress={onFollowersPress}>
            <Text
              color={'mainblack'}
              fontWeight={'500'}
              fontSize={16}
              textAlign="center">
              {followersCount}
            </Text>
            <Text color={'mainblack'} fontSize={13}>
              followers
            </Text>
          </TouchableOpacity>
        </Card>

        <Card
          containerStyle={{
            padding: 0,
            margin: 0,
            elevation: 0,
            borderWidth: 0,
          }}>
          <TouchableOpacity onPress={onFollowingPress}>
            <Text
              color={'mainblack'}
              fontWeight={'500'}
              fontSize={16}
              textAlign="center">
              {followingCount}
            </Text>
            <Text color={'mainblack'} fontSize={13}>
              following
            </Text>
          </TouchableOpacity>
        </Card>
      </Box>
    </Box>
  );
};

export default ProfileCard;
