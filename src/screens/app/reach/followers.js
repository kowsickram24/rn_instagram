import {createBox, createText} from '@shopify/restyle';
import React, {useState} from 'react';

const Box = createBox();
const Text = createText();

const Followers = () => {
  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <Box flexDirection='row' gap={'m'} alignItems='center'>

        <Text> Followers</Text>
      </Box>
    </Box>
  );
};


export default Followers;