import firestore from '@react-native-firebase/firestore';
import { Header } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import FeedPost from '../../../components/card/FeedPost';
import { Insta_Typo_logo } from '../../../constants/assets';
import { Box } from '../../../theme';
const PostPage = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  console.log('route.params?.postId;: ', route.params?.postId);
  const [post, setPost] = useState(null);
  console.log('post: ', post);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = route.params?.postId;
        if (!postId) {
          console.log('No postId provided in route params.');
          return;
        }

        const postRef = await firestore().collection('posts').doc(postId).get();
        if (postRef.exists) {
          const postData = {
            id: postRef.id,
            ...postRef.data(),
          };

          // Fetch user data based on userId
          const userDoc = await firestore()
            .collection('users')
            .doc(postData.userId)
            .get();
          if (userDoc.exists) {
            postData.user = userDoc.data();
          } else {
            console.log(`User with ID ${postData.userId} not found.`);
          }

          setPost(postData);
          setLoading(false);
        } else {
          console.log(`Post with ID ${postId} not found.`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [route.params?.postId]);

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <Header
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap="s">
            <BackBtn onPress={() => navigation.goBack()} />
            <Insta_Typo_logo />
          </Box>
        }
        leftContainerStyle={{flex: 3}}
        statusBarProps={{hidden: false}}
        backgroundColor="white"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <FeedPost
          onProfilePress={() =>
            navigation.navigate('ProfileView', {userId: post?.user?.userId})
          }
          ProfileUrl={post?.user?.avatar}
          userId={currentUser?.userId}
          postId={post?.postId}
          mediaSrc={post?.mediaUrls}
          isMuted={true}
          mediaType={post?.mediaType}
          Caption={post?.caption}
          user={post?.user?.username}
          location={post?.location}
          time={post?.time}
          comments={post?.comments}
        />
      </ScrollView>
    </Box>
  );
};

export default PostPage;
