import {useSelector} from 'react-redux';
import FeedPost from '../../../components/card/FeedPost';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {useState, useEffect} from 'react';
import {FlatList, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import {Header} from '@rneui/themed';
const MySaves = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      setLoading(true);
      try {
        const userRef = firestore()
          .collection('instagram')
          .where('email', '==', currentUser.email);
        const snapshot = await userRef.get();
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          if (userData.saves) {
            setSavedItems(userData.saves);
          } else {
            setSavedItems([]);
          }
        } else {
          setSavedItems([]);
        }
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

  const renderItem = ({item}) => (
    <Box marginBottom="m">
      <FeedPost
        ProfileUrl={item.profilepic}
        user={item.username}
        location={item.location}
        Caption={item.caption}
        imageSrc={item.imageUrl}
        isLiked={item.likes.some(
          like => like.username === currentUser.username,
        )}
        likedUsers={item.likes.map(like => like.username).join(', ')}
        onLikePress={() => handleLike(item)}
        oncommentPress={() => OpenCmtBox(item)}
        onSharePress={() => OpenShareSheet(item)}
        ViewCmnt={() => OpenCmtBox(item)}
        comments={item?.comments}
        onSavePress={() => handleSave(item)}
        isSaved={true}
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
            keyExtractor={(item, index) => `${item.imageUrl}_${index}`}
          />

      </Box>
    </Box>
  );
};

export default MySaves;
