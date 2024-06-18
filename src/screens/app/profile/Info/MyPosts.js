import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {Skeleton} from '@rneui/themed';

const Box = createBox();
const Text = createText();
const {width} = Dimensions.get('screen');

const MyPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentuser = useSelector(state => state.user.user);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .where('userId', '==', currentuser.userId)
      .onSnapshot(querySnapshot => {
        const userPosts = querySnapshot.docs.map(doc => doc.data());
        setPosts(userPosts);
        setLoading(false);
      }, error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [currentuser.userId]);



  const renderPostItem = ({ item }) => (
    <Box>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDesc', { post: item })}>
        <Image
          resizeMode="cover"
          style={{ width: width / 3, height: 125 }}
          source={{ uri: item?.imageUrl }}
        />
      </TouchableOpacity>
    </Box>
  );

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

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      {loading ? (
        <FlatList
          data={[...Array(9).keys()]}
          renderItem={renderSkeletonItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          contentContainerStyle={{
            flex: 1,
          }}
        />
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={loading}  />
          }
          data={posts}
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
      )}
    </Box>
  );
};


export default MyPosts;
