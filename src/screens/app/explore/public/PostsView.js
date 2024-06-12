import React from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import {Box, Text} from '../../../../theme';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('screen');

const PostsView = ({user, navigation}) => {
  const renderPostItem = ({item}) => (
    <Box flex={1}>
      <TouchableOpacity onPress={() => navigation.navigate('PostInfo', {user})}>
        <Image
          resizeMode="cover"
          style={{width: width / 3, height: 125}}
          source={{uri: item?.imageUrl}}
        />
      </TouchableOpacity>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        data={user?.posts}
        renderItem={renderPostItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No Posts Yet</Text>
          </Box>
        }
        numColumns={3}
        contentContainerStyle={{
          flex: 1,
        }}
      />
    </Box>
  );
};

export default PostsView;
