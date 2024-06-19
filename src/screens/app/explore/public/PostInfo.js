import { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  FlatList
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RBSheet from 'react-native-raw-bottom-sheet';
import FeedPost from '../../../../components/card/FeedPost';
import { Box, Text } from '../../../../theme';
import { currentuser } from '../../../../constants/data';
import { useSelector } from 'react-redux';
const {width, height} = Dimensions.get('screen');

const PostInfo = ({ route }) => {
  const currentUser = useSelector(state => state.user.user);
  const RBref = useRef();
  const Optionref = useRef();
  const { item: post } = route.params;
  const [posts, setPosts] = useState([post]);
  const [currentPost, setCurrentPost] = useState(null);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = firestore().collection('users').doc(post.userId);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          setUser(userDoc.data());
        } else {
          console.log(`User with ID ${post.userId} not found.`);
          setUser(null); // Handle case where user document doesn't exist
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [post.userId]); // Fetch user whenever post.userId changes

  const handleOption = () => {
    Optionref.current.open();
  };

  const renderItem = ({ item }) => (
    <Box marginVertical="m">
      <FeedPost
        ProfileUrl={user?.avatar}
        user={user?.username}
        location={item.location}
        Caption={item.caption}
        imageSrc={item.imageUrl}
        onOptionpress={handleOption}
        comments={item.comments}
        userId={currentUser?.userId}
        postId={item?.postId}
      />
    </Box>
  );

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No data Found</Text>}
      />

      {/* RBSheet for options */}
      <RBSheet
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            justifyContent: 'center',
          },
        }}
        closeOnPressBack
        ref={Optionref}
        height={height / 4}
      >
        <Box flex={1} padding="s" justifyContent="center">
          <Text padding="s" fontSize={16} textAlign="center" color="red">
            Report
          </Text>
          <Text padding="s" fontSize={16} textAlign="center" color="mainblack">
            Share Profile
          </Text>
        </Box>
      </RBSheet>
    </Box>
  );
};



export default PostInfo;
