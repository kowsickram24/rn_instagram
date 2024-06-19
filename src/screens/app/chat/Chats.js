import {FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Back, Camera, Search_uf} from '../../../constants/assets';
import {Avatar, Input} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import {Button} from 'react-native-paper';

const ChatBox = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = firestore().collection('users');

      try {
        const snapshot = await usersCollection.get();
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.log('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box padding="s" flex={1} backgroundColor="mainwhite">
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
        placeholder="Search Chat"
      />

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatBox')}>
            <Box
              flex={1}
              justifyContent="space-between"
              flexDirection="row"
              alignItems="center"
              paddingVertical="s"
              paddingHorizontal="m">
              <Box
                flexDirection="row"
                gap={'l'}
                alignItems="center"
                marginRight="m">
                <Image
                  source={{uri: item.avatar}}
                  style={{width: 50, height: 50, borderRadius: 25}}
                />
                <Text color={'mainblack'}>{item.username}</Text>
              </Box>
              <Box>
                <TouchableOpacity>
                  <Camera />
                </TouchableOpacity>
              </Box>
            </Box>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Box flex={1} alignItems="center" justifyContent="center">
            <Text>No Chats Yet</Text>
          </Box>
        }
      />
    </Box>
  );
};

export default ChatBox;
