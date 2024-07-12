import { Avatar } from '@rneui/themed';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Plus_blue } from '../../constants/assets';
import { Box, Text } from '../../theme';
const ProfileCard = ({
  userAvatar,
  Postcount,
  followersCount,
  followingCount,
  onFollowersPress,
  onFollowingPress,
  onAvatarPress,
  onAvatarLongPress,
  onAvatarPressout,
  onPostPress,
  show,
}) => {
  return (
    <Box
      flexDirection="row"
      paddingVertical={'s'}
      alignItems="center"
      justifyContent="space-evenly">
      <TouchableWithoutFeedback
      onPress={onAvatarPress}
        onPressOut={onAvatarPressout}
        onLongPress={onAvatarLongPress}>
        <Avatar
          containerStyle={{borderWidth: 2, borderColor: 'darkviolet', padding:2}}
          rounded
          size={'large'}
          source={{
            uri: userAvatar,
          }}>
          {show && <Avatar.Accessory size={23} Component={Plus_blue} />}
        </Avatar>
      </TouchableWithoutFeedback>
      <Box gap={'xl'} alignItems="center" flexDirection="row">
        <TouchableOpacity onPress={onPostPress}>
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
        </TouchableOpacity>

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
      </Box>
    </Box>
  );
};

export default ProfileCard;
