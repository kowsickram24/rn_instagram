import React from 'react';
import {Box, Text} from '../../theme';
import {Dialog} from '@rneui/themed';
import {ActivityIndicator} from 'react-native';

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
