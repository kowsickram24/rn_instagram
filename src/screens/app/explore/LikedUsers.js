import firestore from '@react-native-firebase/firestore';
import { Avatar, Header } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import BackBtn from '../../../components/buttons/backButton';
import { Heaty_uf } from '../../../constants/assets';
import { Box, Text } from '../../../theme';

const LikedUsers = ({navigation, route}) => {
  const {likedId} = route.params;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!likedId || likedId.length === 0) return;

    const unsubscribe = firestore()
      .collection('users')
      .where(firestore.FieldPath.documentId(), 'in', likedId)
      .onSnapshot(
        snapshot => {
          const fetchedUsers = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(fetchedUsers);
        },
        error => {
          console.error('Error fetching liked users:', error);
        },
      );
    return () => unsubscribe();
  }, [likedId]);

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          <Box gap={'m'} alignItems="center" flexDirection="row">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}>Likes</Text>
          </Box>
        }
      />

      <Box
        alignItems="center"
        gap={'s'}
        padding={'s'}
        backgroundColor={'dullwhite'}>
        <Heaty_uf />
        <Text textAlign="center" color={'mainblack'}>
          {users?.length} likes
        </Text>
      </Box>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text> No Likes Yet</Text>}
        renderItem={({item}) => (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProfileView', {userId: item?.userId})
              }>
              <Box
                padding={'s'}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" gap={'s'}>
                  <Avatar
                    source={{uri: item?.avatar}}
                    rounded
                    size={'medium'}
                  />
                  <Box flexDirection="column">
                    <Text fontSize={14} color={'mainblack'}>
                      {item?.username}
                    </Text>
                    <Text fontSize={14} color={'darkgrey'}>
                      {item?.fullname}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </TouchableOpacity>
          </>
        )}
      />
    </Box>
  );
};

export default LikedUsers;
