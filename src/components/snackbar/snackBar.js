import React from 'react';
import {Snackbar} from 'react-native-paper';
import {Box, Text} from '../../theme';

const SnackBar = ({visible, content, duration = 3000, onDismiss}) => {
  return (
    <Box>
      <Snackbar
        style={{backgroundColor: '#fff'}}
        visible={visible}
        duration={duration}
        onDismiss={onDismiss}
        action={{
          mode:'text',
          labelStyle: {color: 'darkviolet'},
          label: 'Ok',
          // onPress: onDismiss,
        }}>
        <Text fontSize={14} color={'mainblack'}>
          {content}
        </Text>
      </Snackbar>
    </Box>
  );
};

export default SnackBar;
