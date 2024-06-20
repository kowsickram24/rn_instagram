import {FlatList, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {Back, Cmt_Share, Search_uf} from '../../../constants/assets';
import {Input} from '@rneui/themed';

import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import MessageBox from '../../../components/Input/messageBox';

const ChatBox = () => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <ScrollView />
      <MessageBox />
    </Box>
  );
};

export default ChatBox;
