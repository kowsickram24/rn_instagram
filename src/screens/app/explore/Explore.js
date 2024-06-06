import React from 'react';
import {createBox, createText} from '@shopify/restyle';

const Box = createBox();
const Text = createText();

const Explore = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Text>Explore</Text>
    </Box>
  );
};

export default Explore;
