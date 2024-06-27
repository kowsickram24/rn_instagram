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
    <Box>
      <Box
        flexDirection="row"
        paddingVertical={'s'}
        alignItems="center"
        gap={'xl'}
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
        <Box alignItems="center" flexDirection="row" gap={'l'}>
          <Box alignSelf="center">
            <Text color={'mainblack'} fontSize={20} textAlign="center">
              {Postcount}
            </Text>
            <Text color={'mainblack'} fontSize={12}>
              posts
            </Text>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity onPress={onFollowersPress}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {followersCount}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                followers
              </Text>
            </TouchableOpacity>
          </Box>
          <Box alignSelf="center">
            <TouchableOpacity onPress={onFollowingPress}>
              <Text color={'mainblack'} fontSize={20} textAlign="center">
                {followingCount}
              </Text>
              <Text color={'mainblack'} fontSize={12}>
                following
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileCard;
