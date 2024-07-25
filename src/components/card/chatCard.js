import { Avatar, Skeleton } from '@rneui/themed';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Msg_Icon, } from '../../constants/assets';
import { Box, Text } from '../../theme';

const ChatCard = ({
  Username = 'Charles Clark',
  LastMessage = 'hii',
  ProfileUrl,
  loading,
  onAvatarPress,
  iSstory,
}) => {
  if (loading) {
    return <ChatCardSkeleton />;
  }
  return (
    <Box padding={'s'} flexDirection="row" gap={'s'}>
      <TouchableWithoutFeedback onPress={onAvatarPress}>
        <Avatar
          containerStyle={[
            iSstory
              ? {
                  borderWidth: 2,
                  borderColor: 'darkviolet',
                  padding: 2,
                }
              : {},
          ]}
          size={'medium'}
          rounded
          source={{uri: ProfileUrl}}
        />
      </TouchableWithoutFeedback>
      <Box
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flexDirection="column">
          <Text
            numberOfLines={1}
            fontWeight={'400'}
            fontSize={16}
            color={'mainblack'}>
            {Username}
          </Text>
          <Text numberOfLines={1} fontSize={14} color={'darkgrey'}>
            {LastMessage}
          </Text>
        </Box>
        <Box alignItems="center" justifyContent="center">
            <Msg_Icon />        
        </Box>
      </Box>
    </Box>
  );
};
export default ChatCard;

const ChatCardSkeleton = () => {
  return (
    <Box padding={'s'} flexDirection="row" gap={'s'}>
      <Skeleton
        animation="pulse"
        width={50}
        height={50}
        circle
        style={{marginRight: 8}}
      />
      <Box
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flexDirection="column">
          <Skeleton
            animation="pulse"
            width={120}
            height={15}
            style={{borderRadius: 5}}
          />
          <Skeleton
            animation="pulse"
            width={80}
            height={15}
            style={{marginTop: 10, borderRadius: 5}}
          />
        </Box>
        <Box alignItems="center" justifyContent="center">
          <TouchableOpacity>
            <Skeleton circle animation="pulse" width={30} height={30} />
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};
