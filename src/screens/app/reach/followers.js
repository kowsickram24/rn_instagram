import {FlatList} from 'react-native';
import React, {useState} from 'react';
import {Avatar, ListItem} from '@rneui/themed';
import {Box, Text} from '../../../theme';

const renderItem = ({item}) => (
  <ListItem>
    <Avatar size={'medium'} source={{uri: item.profilepic}} rounded />
    <ListItem.Content>
      <ListItem.Title>{item?.username}</ListItem.Title>
    </ListItem.Content>
  </ListItem>
);

const Followers = ({userData}) => {
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <FlatList
        data={userData?.followers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No Followers yet</Text>
          </Box>
        }
      />
    </Box>
  );
};

export default Followers;
