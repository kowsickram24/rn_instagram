import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Box, Text } from '../../theme';

export const Loader = ({text}) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator color={'Primary'} size={'large'} />
      <Text textAlign="center" color={'mainblack'}>
        {text}
      </Text>
    </Box>
  );
};
