import React, {useState, useEffect} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import {Input, Avatar, ListItem, Header} from '@rneui/themed';
import {useSearchUsersQuery} from '../../../store/slices/apiSlice';
import {Search_uf} from '../../../constants/assets';
import {ActivityIndicator} from 'react-native';

const Box = createBox();
const Text = createText();

const Explore = ({ navigation }) => {
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

  const renderItem = ({ item }) => (
    <ListItem onPress={() => navigation.navigate('ProfileView', { userId: item.id })}>
      <Avatar size={'medium'} source={{ uri: item.profilepic }} rounded />
      <ListItem.Content>
        <ListItem.Title>{item.username}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <Box flex={1} padding={'s'} backgroundColor={'mainwhite'}>

      <Input
        leftIcon={<Search_uf />}
        leftIconContainerStyle={{ marginRight: 8, padding: 6 }}
        containerStyle={{ paddingVertical: 12 }}
        inputContainerStyle={{
          borderBottomWidth: 0,
          backgroundColor: '#FAFAFA',
          borderRadius: 10,
        }}
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={() => setDebouncedQuery(searchQuery)}
      />
      {isLoading && <ActivityIndicator />}
      {isError && <Text>Error fetching data</Text>}
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </Box>
  );
};


export default Explore;
