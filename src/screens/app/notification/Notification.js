// NotificationSetup.js

import React, {useEffect, useState} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {useSelector} from 'react-redux';
import {Box, Text} from '../../../theme'; 
import {Header} from '@rneui/themed';

const NotificationSetup = ({navigation}) => {
  const LogUser = useSelector(state => state.user.user);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .doc(LogUser.userId)
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const notifs = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setNotifications(notifs);
      });

    return () => unsubscribe();
  }, []);

  const addNotification = async (toUserId, notification) => {
    try {
      await firestore()
        .collection('users')
        .doc(toUserId)
        .collection('notifications')
        .add(notification);
    } catch (error) {
      console.error('Error adding notification: ', error);
    }
  };

  const notifyUser = async (toUserId, fromUserId, type, postId, message) => {
    const notification = {
      type,
      fromUserId,
      postId,
      message,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };
    await addNotification(toUserId, notification);

    // Send push notification
    await sendPushNotification('New Notification', message);
  };

  const sendPushNotification = async (title, body) => {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Box padding={'s'} flexDirection="row" alignItems="center">
        <Text>{item.message}</Text>
      </Box>
    </TouchableOpacity>
  );

  const handleNotificationPress = item => {
    switch (item.type) {
      case 'like':
        navigation.push('PostView', {postId: item.postId});
        break;
      case 'comment':
        navigation.push('PostView', {postId: item.postId});
        break;
      case 'message':
        navigation.push('ChatView', {userId: item.fromUserId});
        break;
      case 'follow':
        navigation.push('ProfileView', {userId: item.fromUserId});
        break;
      default:
        break;
    }
  };

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
        data={notifications}
        renderItem={renderItem}
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
