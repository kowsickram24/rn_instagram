import React from 'react';
import {createBox, createText} from '@shopify/restyle';

const Box = createBox();
const Text = createText();
const MyPosts = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>No Posts Yet</Text>
      </Box>
    </Box>
  );
};

export default MyPosts;
