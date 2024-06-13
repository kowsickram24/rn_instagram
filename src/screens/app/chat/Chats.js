import {FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {Back, Search_uf} from '../../../constants/assets';
import {Input} from '@rneui/themed';

import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';

const Chats = () => {
  const currentUser = useSelector(state => state.user.user);
  return (
    <Box padding={'s'} flex={1} backgroundColor={'mainwhite'}>

        <Text textAlign="center" padding={'s'} fontSize={16} color={'mainblack'}>
          {currentUser.username}
        </Text>

      <Input
        leftIconContainerStyle={{
          padding: 6,
        }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          backgroundColor: '#FAFAFA',
          borderRadius: 10,
        }}
        leftIcon={<Search_uf />}
      />

      <FlatList
        ListEmptyComponent={
          <Box flex={1} alignItems="center">
            <Text>No Chats Yet</Text>
          </Box>
        }
      />
    </Box>
  );
};

export default Chats;

const styles = StyleSheet.create({});
