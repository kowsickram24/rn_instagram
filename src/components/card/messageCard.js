import {Avatar} from '@rneui/themed';
import {Box, Text} from '../../theme';
import {Camera} from '../../constants/assets';
const MessageCard = ({user, lastmessage, userImg}) => {
  return (
    <Box
      backgroundColor={'red'}
      alignItems="center"
      width={'100%'}
      height={50}
      flexDirection="row">
      <Box flex={1} justifyContent="space-between" flexDirection="row">
        <Avatar size={'small'} source={{uri: userImg}} rounded />
        <Box flexDirection="column">
          <Text>{user}</Text>
          <Text>{lastmessage}</Text>
        </Box>
        <Box>
          <Camera />
        </Box>
      </Box>
    </Box>
  );
};

export default MessageCard;
