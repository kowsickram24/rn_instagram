import {FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Avatar, Button, ListItem} from '@rneui/themed';
import {Box, Text} from '../../../theme';


const Followers = ({userData, navigation}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={() => navigation.push('ProfileView', {userId : item?.userId})}>
        <ListItem>
          <Avatar size={'medium'} source={{uri: item?.avatar}} rounded />
          <ListItem.Content>
            <Text color={'mainblack'} fontSize={14}>
              {item?.username}
            </Text>
            <Text color={'mainblack'} fontSize={14}>
              {item?.fullname}
            </Text>
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <FlatList
        data={userData}
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
