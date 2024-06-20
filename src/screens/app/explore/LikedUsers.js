import React, {useEffect, useState} from 'react';
import {ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {Avatar, Button, Header} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';

const LikedUsers = ({navigation, route}) => {
  const currentUser = useSelector(state => state.user.user);
  const {likedId} = route.params;
  const [users, setUsers] = useState([]);
  const [isFollowed, setIsFollowed] = useState(false);

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box gap={'m'} alignItems="center" flexDirection="row">
              <Back />
              <Text color={'mainblack'}>Likes</Text>
            </Box>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding={'s'} backgroundColor={'dullwhite'}>
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
                      <Text fontSize={14} color={'lightgrey'}>
                        {item?.fullname}
                      </Text>
                    </Box>
                  </Box>
                  {/* {isFollowed ? (
                    <Button
                      containerStyle={{width: 150, paddingHorizontal: 6}}
                      titleStyle={{
                        color: '#000',
                        fontSize: 14,
                        fontWeight: '100',
                      }}
                      buttonStyle={{
                        borderRadius: 6,
                        backgroundColor: 'lightgrey',
                      }}
                      title={'Following'}
                      onPress={() => setIsFollowed(!isFollowed)}
                    />
                  ) : (
                    <Button
                      containerStyle={{width: 150, paddingHorizontal: 6}}
                      titleStyle={{fontSize: 14, fontWeight: '100'}}
                      buttonStyle={{borderRadius: 6}}
                      title={'Follow'}
                      onPress={() => setIsFollowed(!isFollowed)}
                    />
                  )} */}
                </Box>
              </TouchableOpacity>
            </>
          )}
        />
      </ScrollView>
    </Box>
  );
};

export default LikedUsers;
