import React from 'react';
import {Snackbar} from 'react-native-paper';
import {Box, Text} from '../../theme'; // Assuming Box and Text components are defined in your theme file

export const SnackBar = ({
  visible,
  content,
  duration = 3000,
  onDismiss,
}) => {
  return (
    <Box>
      <Snackbar visible={visible} duration={duration} onDismiss={onDismiss}>
        <Text>{content}</Text>
      </Snackbar>
    </Box>
  );
};
