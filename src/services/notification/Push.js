import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import notifee from '@notifee/react-native';

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
    <View style={styles.container}>
      <Button title="Display Notification" onPress={onDisplayNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default Push;
