import {Avatar, ListItem} from '@rneui/themed';
import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';

const Box = createBox();
const Text = createText();

const Following = ({userData}) => {

  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <ListItem>
        <Avatar
          size={'medium'}
          source={{uri: userData?.following[0].profilepic}}
          rounded
        />
        <ListItem.Content>
          <ListItem.Title>
            {userData?.following[0] ? userData.following[0].username : ''}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </Box>
  );
};

export default Following;
