import {Avatar, Button, ListItem, Overlay, SearchBar} from '@rneui/themed';
import {FlatList, Platform, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

const Following = ({currentUser, userData, navigation}) => {
  const LogUser = useSelector(state => state.user.user);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUnFollow = () => {
    console.log('unfollow');
  };
  const isCurrentUser = LogUser.userId === currentUser.userId;
  console.log('isCurrentUser: ', isCurrentUser);
  const renderItem = ({item}) => {
    if (
      item?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.push('ProfileView', {userId: item?.userId})
          }>
          <ListItem>
            <Avatar size={'medium'} source={{uri: item?.avatar}} rounded />
            <ListItem.Content>
              <Text color={'mainblack'} fontSize={14}>
                {item?.username}
              </Text>
              <Text color={'mainblack'} fontSize={14}>
                {item?.fullname}
              </Text>
            </ListItem.Content>
            {isCurrentUser ? (
              <Button
                buttonStyle={{backgroundColor: 'lightgrey', borderRadius: 6}}
                onPress={handleUnFollow(item)}
                title={'following'}
                titleStyle={{fontSize: 14, color: 'black'}}
              />
            ) : null}
          </ListItem>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <SearchBar
        inputStyle={{fontSize: 14}}
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        data={userData.filter(
          item =>
            item?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.fullname.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No users found </Text>
          </Box>
        }
      />
      <Overlay isVisible={''}>
        <Box padding={4} backgroundColor={'mainwhite'} borderRadius={10}>
          <Text fontSize={18} color={'mainblack'}>
            Unfollow?
          </Text>
        </Box>
      </Overlay>
    </Box>
  );
};

export default Following;
