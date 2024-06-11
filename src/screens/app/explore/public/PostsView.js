import {createBox, createText} from '@shopify/restyle';
import React from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';

const Box = createBox();
const Text = createText();
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('screen');
const PostsView = ({user}) => {
  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity>
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
        ListEmptyComponent={<Text>No Posts Yet</Text>}
        numColumns={3}
        contentContainerStyle={{
          flex: 1,
        }}
      />
    </Box>
  );
};

export default PostsView;
