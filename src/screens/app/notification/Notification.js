import { Header } from '@rneui/themed';
import React from 'react';
import { Image } from 'react-native';
import { Box, Text } from '../../../theme';



const NotificationItem = ({item}) => (
  <Box flexDirection="row" alignItems="center" padding="s">
    <Image
      source={{uri: item.userProfile}}
      style={{width: 40, height: 40, borderRadius: 20}}
    />
    <Box flex={1} marginLeft="s">
      <Text>
        <Text>{item.user}</Text> {item.message}
      </Text>
    </Box>
    {item.type !== 'follow' && (
      <Image
        source={{uri: item.postImage}}
        style={{width: 40, height: 40, borderRadius: 5}}
      />
    )}
  </Box>
);

const Notification = () => {
  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Header
        barStyle="default"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{
         padding:8
        }}
        leftComponent={{
          text: 'Notifications',
          style: {color: '#000', fontSize: 16, width:300},
        }}
        backgroundColor="white"
      />
    </Box>
  );
};

export default Notification;
