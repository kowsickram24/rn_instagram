import {Avatar, ListItem, SearchBar} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {FlatList, Platform} from 'react-native';
import {useSearchUsersQuery} from '../../../store/slices/apiSlice';
import {Box, Text} from '../../../theme';
import Gallery from './Gallery';

const Explore = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const {data: searchResults = []} = useSearchUsersQuery(
    debouncedQuery.trim().toLowerCase(),
    {
      skip: debouncedQuery.trim() === '',
    },
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const renderItem = ({item}) => (
    <ListItem
      onPress={() => navigation.navigate('ProfileView', {userId: item.userId})}>
      <Avatar size={'medium'} source={{uri: item.avatar}} rounded />
      <ListItem.Content>
        <Text fontSize={14} color={'mainblack'}>
          {item?.username}
        </Text>
        <Text fontSize={14} color={'darkgrey'}>
          {item?.fullname}
        </Text>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <SearchBar
              searchIcon={{
          name: 'search',
        }}
        clearIcon={{
          name: 'close',
        }}
        inputStyle={{fontSize: 14}}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search"
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        inputContainerStyle={{
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderBottomWidth: 0,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Gallery />}
      />
    </Box>
  );
};

export default Explore;
