import {useSelector} from 'react-redux';
import FeedPost from '../../../components/card/FeedPost';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {useState, useEffect} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import {Header} from '@rneui/themed';
const MySaves = ({ navigation }) => {
  const currentUser = useSelector(state => state.user.user);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);
      try {
        const savedPosts = currentUser?.savedposts || [];
        const postPromises = savedPosts.map(async postId => {
          const postSnapshot = await firestore().collection('posts').doc(postId).get();
          if (postSnapshot.exists) {
            const postData = postSnapshot.data();
            const userSnapshot = await firestore().collection('users').doc(postData.userId).get();
            if (userSnapshot.exists) {
              const userData = userSnapshot.data();
              return { ...postData, user: userData };
            }
          }
          return null;
        });

        const posts = await Promise.all(postPromises);
        setSavedItems(posts.filter(post => post !== null));
      } catch (error) {
        console.error('Error fetching saved items: ', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchSavedItems();
    }
  }, [currentUser]);

  const handleLike = (item) => {
    // Handle like logic here
  };

  const OpenCmtBox = (item) => {
    // Handle open comment box logic here
  };

  const OpenShareSheet = (item) => {
    // Handle open share sheet logic here
  };

  const handleSave = (item) => {
    // Handle save logic here
  };

  const renderItem = ({ item }) => (
    <Box marginBottom="m">
      <FeedPost
        ProfileUrl={item.user.avatar}
        user={item.user.username}
        location={item.location}
        Caption={item.caption}
        imageSrc={item.imageUrl}
        isLiked={item.likes.some(like => like.username === currentUser.username)}
        likedUsers={item.likes.map(like => like.username).join(', ')}
        onLikePress={() => handleLike(item)}
        onCommentPress={() => OpenCmtBox(item)}
        onSharePress={() => OpenShareSheet(item)}
        ViewCmnt={() => OpenCmtBox(item)}
        comments={item?.comments}
        onSavePress={() => handleSave(item)}
      />
    </Box>
  );

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </Box>
    );
  }

  return (
    <Box backgroundColor="mainwhite" flex={1}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box gap={'m'} alignItems="center" flexDirection="row">
              <Back />
              <Text color={'mainblack'}> My Saves</Text>
            </Box>
          </TouchableOpacity>
        }
      />
      <Box flex={1}>
        <FlatList
          ListEmptyComponent={
            <Text textAlign='center'> No Saves Yet </Text>
          }
          data={savedItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}_${index}`}
        />
      </Box>
    </Box>
  );
};


export default MySaves;
