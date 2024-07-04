import notifee from '@notifee/react-native';
import React from 'react';
import { Button, View } from 'react-native';

const Push = () => {
  async function onDisplayNotification() {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
      });

      await notifee.displayNotification({
        title: 'Sample Notification',
        body: 'This is the main body content of the notification.',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          color: '#4caf50',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  }

  return (
    <View >
      <Button title="Display Notification" onPress={onDisplayNotification} />
    </View>
  );
};


export default Push;
