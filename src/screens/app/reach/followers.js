import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';
import {Avatar, ListItem} from '@rneui/themed';
const Box = createBox();
const Text = createText();

const Followers = ({userData}) => {
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      {/* <ListItem>
        <Avatar
          size={'medium'}
          source={{uri: userData.followers[0].profilepic}}
          rounded
        />
        <ListItem.Content>
          <ListItem.Title>
            {userData?.following[0] ? userData.followers[0].username : ''}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem> */}
      <Text>No Followers yet</Text>
    </Box>

  );
};


export default Followers;