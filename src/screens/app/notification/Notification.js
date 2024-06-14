import React from 'react';
import { FlatList, TouchableOpacity, Image } from 'react-native';
import { createBox, createText } from '@shopify/restyle';
import Push from '../../../services/notification/Push';

const Box = createBox();
const Text = createText();

const notifications = [
  {
    id: '1',
    type: 'like',
    user: 'john_doe',
    userProfile: 'https://randomuser.me/api/portraits/men/1.jpg',
    postImage: 'https://placekitten.com/200/200',
    message: 'liked your photo',
  },
  {
    id: '2',
    type: 'comment',
    user: 'jane_doe',
    userProfile: 'https://randomuser.me/api/portraits/women/2.jpg',
    postImage: 'https://placekitten.com/200/201',
    message: 'commented: "Nice shot!"',
  },
  {
    id: '3',
    type: 'follow',
    user: 'jack_smith',
    userProfile: 'https://randomuser.me/api/portraits/men/3.jpg',
    message: 'started following you',
  },
];

const NotificationItem = ({ item }) => (
  <Box
    flexDirection="row"
    alignItems="center"
    padding="s"
  >
    <Image
      source={{ uri: item.userProfile }}
      style={{ width: 40, height: 40, borderRadius: 20 }}
    />
    <Box flex={1} marginLeft="s">
      <Text >
        <Text >{item.user}</Text> {item.message}
      </Text>
    </Box>
    {item.type !== 'follow' && (
      <Image
        source={{ uri: item.postImage }}
        style={{ width: 40, height: 40, borderRadius: 5 }}
      />
    )}
  </Box>
);

const Notification = () => {
  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Box padding="m" >
        <Text variant={'title'} >Notifications</Text>
      </Box>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      {/* <Push /> */}
    </Box>
  );
};

export default Notification;
