import { Header } from '@rneui/themed';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { Box, Text } from '../../../theme';

const NotificationSetup = ({navigation}) => {
  const LogUser = useSelector(state => state.user.user);
  const [notifications, setNotifications] = useState([]);

 

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Header
        barStyle="default"
        statusBarProps={{hidden: true}}
        leftContainerStyle={{padding: 8}}
        leftComponent={{
          text: 'Notifications',
          style: {color: '#000', fontSize: 16, width: 300},
        }}
        backgroundColor="white"
      />
      <FlatList
        // data={notifications}
        // renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No notifications</Text>
          </Box>
        }
      />
    </Box>
  );
};

export default NotificationSetup;
