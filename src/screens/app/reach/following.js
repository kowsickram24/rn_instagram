import {Avatar, ListItem} from '@rneui/themed';
import { FlatList } from 'react-native';
import React from 'react';
import {Box, Text} from '../../../theme';

const renderItem = ({item}) => (
  <ListItem>
    <Avatar
      size={'medium'}
      source={{uri: item?.profilepic}}
      rounded
    />
    <ListItem.Content>
      <ListItem.Title>
        {item?.username}
      </ListItem.Title>
    </ListItem.Content>
  </ListItem>
);

const Following = ({userData}) => {
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <FlatList
        data={userData?.following} 
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        ListEmptyComponent={
          <Box flex={1} justifyContent='center' alignItems='center'>
            <Text>
              No following Yet
            </Text>
            </Box>
        }
      />
    </Box>
  );
};

export default Following;
