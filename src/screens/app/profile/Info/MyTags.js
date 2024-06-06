import React from 'react';
import {createBox, createText} from '@shopify/restyle';

const Box = createBox();
const Text = createText();
const MyTags = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>No Tags Yet</Text>
      </Box>
    </Box>
  );
};

export default MyTags;
