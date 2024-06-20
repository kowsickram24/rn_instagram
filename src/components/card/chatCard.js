import {Box, Text} from '../../theme';
import {Avatar} from '@rneui/themed';
import {Skeleton} from '@rneui/themed';
import {useState} from 'react';
import {Camera} from '../../constants/assets';
import {TouchableOpacity} from 'react-native';
import {Card} from '@rneui/themed';
const ChatCard = ({Username = 'Charles Clark', LastMessage = 'hii'}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Card
      containerStyle={{
        padding: 0,
        margin: 0,
        elevation: 0,
        borderWidth: 0,
      }}>
      <Box padding={'s'} flexDirection="row" gap={'s'}>
        <Avatar
          size={'medium'}
          rounded
          source={{uri: 'https://randomuser.me/api/portraits/men/15.jpg'}}
        />
        <Box flex={1} flexDirection="row" alignItems='center' justifyContent="space-between">
          <Box flexDirection="column">
            <Text color={'mainblack'}> {Username}</Text>
            <Text color={'mainblack'}> {LastMessage}</Text>
          </Box>
          <Box alignItems='center' justifyContent='center'>
            <TouchableOpacity>
              <Camera />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
export default ChatCard;
