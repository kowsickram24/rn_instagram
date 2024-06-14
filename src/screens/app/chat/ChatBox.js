import {FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {Back, Cmt_Share, Search_uf} from '../../../constants/assets';
import {Input} from '@rneui/themed';

import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';

const ChatBox = () => {
  const currentUser = useSelector(state => state.user.user);
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Box>
        <Text color={'mainblack'}> {currentUser?.username}</Text>
      </Box>
      <Box flex={1} justifyContent="flex-end">
        <Input
          placeholder="Send Message"
          rightIconContainerStyle={{
            margin: 10,
          }}
          inputStyle={{
            padding: 10,
          }}
          inputContainerStyle={{
            borderBottomWidth: 1,
            backgroundColor: 'white',
            borderRadius: 30,
            borderWidth: 1,
            padding: 2,
          }}
          rightIcon={<Cmt_Share />}
        />
      </Box>
    </Box>
  );
};

export default ChatBox;
