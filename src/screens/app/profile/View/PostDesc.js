import { createBox, createText } from '@shopify/restyle';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import FeedPost from '../../../../components/card/FeedPost';

const Box = createBox();
const Text = createText();

const PostDesc = ({route}) => {
  const {fetchPosts, posts} = route.params
  console.log(posts);
  const getPosts = async () => {
    const fetchedPosts = await fetchPosts();
  };
  useEffect(() => {
    getPosts();
  }, [fetchPosts]);

  const renderPostItem = ({item}) => (
    <Box marginVertical="m">
      <FeedPost
        ProfileUrl={item?.profilepic}
        user={item?.username}
        location={item.location}
        Caption={item.caption}
        imageSrc={item.imageUrl}
        
      />
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <FlatList
        data={posts}
        ListEmptyComponent={<Text>No Posts</Text>}
        renderItem={renderPostItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </Box>
  );
};

export default PostDesc;
