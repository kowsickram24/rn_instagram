import {Avatar, ListItem} from '@rneui/themed';
import {FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {Box, Text} from '../../../theme';

const Following = ({userData, navigation}) => {
  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.push('ProfileView', {userId: item?.userId});
      }}>
      <ListItem>
        <Avatar size={'medium'} source={{uri: item?.avatar}} rounded />
        <ListItem.Content>
          <Text color={'mainblack'} fontSize={14}>
            {item?.username}
          </Text>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <FlatList
        data={userData}
        renderItem={renderItem}
        keyExtractor={item => item.userId.toString()}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No following yet</Text>
          </Box>
        }
      />
    </Box>
  );
};

export default Following;
