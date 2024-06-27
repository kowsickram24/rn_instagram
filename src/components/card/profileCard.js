import {TouchableOpacity} from 'react-native';
import {Box, Text} from '../../theme';
import {Avatar, Card} from '@rneui/themed';

const ProfileCard = ({
  userAvatar,
  Postcount,
  followersCount,
  followingCount,
  onFollowersPress,
  onFollowingPress,
}) => {
  return (
    <Box>
      <Box
        flexDirection="row"
        marginVertical={'s'}
        marginHorizontal={'m'}
        alignItems="center"
        justifyContent="space-around">
        <Avatar
          rounded
          size={'large'}
          source={{
            uri: userAvatar,
          }}
        />
        <Box alignItems='center' flexDirection="row" gap={'l'}>
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
