import {FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Avatar, Button, ListItem} from '@rneui/themed';
import {Box, Text} from '../../../theme';
import Animated from 'react-native-reanimated';

import firestore from '@react-native-firebase/firestore';

const renderItem = ({item}) => {
  const handleRemoveFollower = async () => {
    try {
      const userRef = firestore().collection('users').doc(item.userId);

      await userRef.update({
        followers: firestore.FieldValue.arrayRemove({
          username: item.username,
          profilepic: item.profilepic,
        }),
      });

      console.log('Follower removed successfully');
    } catch (error) {
      console.error('Error removing follower: ', error);
    }
  };

  return (
    <ListItem>
      <Avatar size={'medium'} source={{uri: item?.profilepic}} rounded />
      <ListItem.Content>
        <ListItem.Title>{item?.username}</ListItem.Title>
      </ListItem.Content>
      <Button
        onPress={handleRemoveFollower}
        containerStyle={{borderRadius: 6}}
        titleStyle={{color: 'black'}}
        buttonStyle={{backgroundColor: 'lightgrey'}}
        title={'remove'}
      />
    </ListItem>
  );
};

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
