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

const MyPosts = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentuser = useSelector(state => state.user.user);

  const fetchPosts = async () => {
    try {
      const userDocRef = firestore()
        .collection('instagram')
        .where('email', '==', currentuser.email);

      const querySnapshot = await userDocRef.get();

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        setPosts(userData.posts || []);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderPostItem = ({item}) => (
    <Box>
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDesc', { posts})}>
        <Image
          resizeMode="cover"
          style={{width: width / 3, height: 125}}
          source={{uri: item?.imageUrl}}
        />
      </TouchableOpacity>
    </Box>
  );

  const renderSkeletonItem = () => (
    <Skeleton
    animation='pulse'
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
            <RefreshControl refreshing={loading} onRefresh={fetchPosts} />
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
