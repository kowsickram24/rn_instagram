import {Skeleton} from '@rneui/themed';
import React,{useState} from 'react';
import {Dimensions, FlatList, RefreshControl ,TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {usePosts} from '../../../../hooks/data/fetchPosts';
import {Box, Text} from '../../../../theme';
const {width, height} = Dimensions.get('screen');

const PostsView = ({user, navigation}) => {
  const {data: postData, isLoading, refetch : refetchPosts } = usePosts(user?.userId);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchPosts();
    setRefreshing(false);
  };
  const renderSkeletonItem = () => (
    <Skeleton
      animation="pulse"
      style={{
        width: width / 3,
        height: 125,
        margin: 2,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
      }}
    />
  );

  if (isLoading) {
    return (
      <FlatList
        data={[...Array(postData?.length).keys()]}
        renderItem={renderSkeletonItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
        contentContainerStyle={{
          flex: 1,
        }}
      />
    );
  }

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity onPress={() => navigation.navigate('PostInfo', {item})}>
        {item?.mediaUrls ? (
          <FastImage
            resizeMode="cover"
            style={{width: width / 3, height: width / 3}}
            source={{uri: item?.mediaUrls[0]}}
          />
        ) : item?.videoUrl ? (
          <Video
            paused
            source={{uri: item?.videoUrl}}
            style={{backgroundColor: 'red', width: 120, height: 120}}
            resizeMode="cover"
          />
        ) : null}
      </TouchableOpacity>
    </Box>
  );

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <FlatList
        data={postData}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} justifyContent="center" alignItems="center">
            <Text>No Posts Yet</Text>
          </Box>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
            progressBackgroundColor="#ffffff"
          />
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
