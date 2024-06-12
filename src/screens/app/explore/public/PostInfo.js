import {Box, Text} from '../../../../theme';
import {FlatList} from 'react-native';
import FeedPost from '../../../../components/card/FeedPost';
const PostInfo = ({route}) => {
  const User = route.params.user;
  console.log(User, 'hiiii');

  const renderItem = ({item}) => (
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
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        data={User?.posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No data Found</Text>}
      />
    </Box>
  );
};

export default PostInfo;
