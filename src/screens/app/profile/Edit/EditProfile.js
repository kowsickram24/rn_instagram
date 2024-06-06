import React from 'react';
import {createBox, createText} from '@shopify/restyle';

const Box = createBox();
const Text = createText();
const EditProfile = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box flex={1}>
        <Text>Profile</Text>
      </Box>
    </Box>
  );
};

export default EditProfile;
