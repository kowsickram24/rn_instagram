import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import {Header} from '@rneui/themed';
import {Box, Text} from '../../../theme';
import {Back} from '../../../constants/assets';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import FastImage from 'react-native-fast-image';
const {width, height} = Dimensions.get('screen');
import Video from 'react-native-video';
const SavedPosts = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [savedPosts, setSavedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .where('email', '==', currentUser.email)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const userData = userDoc.data();
            setSavedPosts(userData.savedPosts || []);
          } else {
            setSavedPosts([]);
          }
        },
        error => {
          console.error('Error fetching liked posts:', error);
        },
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (savedPosts.length > 0) {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const postPromises = savedPosts.map(postId =>
            firestore().collection('posts').doc(postId).get(),
          );
          const postSnapshots = await Promise.all(postPromises);
          const fetchedPosts = postSnapshots.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        } catch (error) {
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [savedPosts]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}>Saves</Text>
          </Box>
        }
      />

      <FlatList
        horizontal
        data={posts}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Box flex={1} alignItems="center">
            <Text>No Saved Posts Yet</Text>
          </Box>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('PostPage', {postId: item?.postId})
            }>
              {item.mediaType === 'image' ? (
              <FastImage
                resizeMode="cover"
                source={{uri: item?.mediaUrl}}
                style={{width: width / 3, height: width / 3}}
              />
            ) : (
              <Video
              controls
                resizeMode="cover"
                source={{uri: item?.mediaUrl}}
                style={{width: width / 3, height: width / 3}}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </Box>
  );
};

export default SavedPosts;
