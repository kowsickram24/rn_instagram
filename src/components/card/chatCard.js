import {Box, Text} from '../../theme';
import {Avatar, Divider} from '@rneui/themed';
import {Skeleton} from '@rneui/themed';
import {useState, useEffect} from 'react';
import {Camera, Share} from '../../constants/assets';
import {TouchableOpacity} from 'react-native';
import {Card} from '@rneui/themed';

const ChatCard = ({
  Username = 'Charles Clark',
  LastMessage = 'hii',
  ProfileUrl,
  loading,
}) => {
  if (loading) {
    return <ChatCardSkeleton />;
  }
  return (
    <Card
      containerStyle={{
        padding: 0,
        margin: 0,
        elevation: 0,
        borderWidth: 0,
      }}>
      <Box padding={'s'} flexDirection="row" gap={'s'}>
        <Avatar size={'medium'} rounded source={{uri: ProfileUrl}} />
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
            <TouchableOpacity>
              <Share />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>

    </Card>
  );
};
export default ChatCard;

const ChatCardSkeleton = () => {
  return (
    <Card
      containerStyle={{
        padding: 0,
        margin: 0,
        elevation: 0,
        borderWidth: 0,
      }}>
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
    </Card>
  );
};
