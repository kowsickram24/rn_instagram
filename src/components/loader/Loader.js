import React from 'react';
import { Box, Text } from '../../theme';
import { Dialog } from '@rneui/themed';

export const Loader = ({ text }) => {
  return (
    <Box
      flex={1}
      style={{ backgroundColor: 'white' }}
      justifyContent="center"
      alignItems="center"
    >
      <Dialog.Loading />
      <Text textAlign='center' color={'mainblack'}>
        {text}
      </Text>
    </Box>
  );
};
