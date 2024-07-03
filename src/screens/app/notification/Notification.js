import {Header} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {Box, Text} from '../../../theme';
import BackBtn from '../../../components/buttons/backButton';

const NotificationSetup = ({navigation}) => {
  const LogUser = useSelector(state => state.user.user);
  const [notifications, setNotifications] = useState([]);

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Header
        barStyle="default"
        statusBarProps={{hidden: true}}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text numberOfLines={1} color={'mainblack'}>
              Notifications
            </Text>
          </Box>
        }
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
