import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import FeedPost from '../../../../components/card/FeedPost';
import { useSelector } from 'react-redux';

const Box = createBox();
const Text = createText();

const PostDesc = ({route}) => {
  const user = useSelector(state => state.user.user)
  const {fetchPosts, posts} = route.params;
  const [postDetails, setPostDetails] = useState([]);
console.log(posts)
  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPostDetails(fetchedPosts);
    };

    getPosts();
  }, [fetchPosts]);

  const renderPostItem = ({item}) => (
    <Box marginVertical="m">
      <FeedPost ProfileUrl={user.profilepic} user={user.username} location={item.location} Caption={item.caption} imageSrc={item.imageUrl} />
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
