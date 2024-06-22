import {Avatar, Input, ListItem} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, ScrollView} from 'react-native';
import {Search_uf} from '../../../constants/assets';
import {useSearchUsersQuery} from '../../../store/slices/apiSlice';
import {Box, Text} from '../../../theme';
import {Loader} from '../../../components/loader/Loader';
import Gallery from './Gallery';

const Explore = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const {
    data: searchResults = [],
    isLoading,
    isError,
  } = useSearchUsersQuery(debouncedQuery.trim().toLowerCase(), {
    skip: debouncedQuery.trim() === '',
  });

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
        <Text fontSize={14} color={'mainblack'}>{item?.username}</Text>
        <Text fontSize={14} color={'darkgrey'}>
          {item?.fullname}
        </Text>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Input
        leftIcon={<Search_uf />}
        leftIconContainerStyle={{marginRight: 8, padding: 6}}
        containerStyle={{paddingVertical: 12}}
        inputContainerStyle={{
          borderBottomWidth: 0,
          backgroundColor: '#FAFAFA',
          borderRadius: 10,
          elevation: 2,
        }}
        inputStyle={{fontSize: 14}}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => setDebouncedQuery(searchQuery)}
      />
      {isLoading && <Loader />}
      {isError && <Text>Error fetching data</Text>}
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
