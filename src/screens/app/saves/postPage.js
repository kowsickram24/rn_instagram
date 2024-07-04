import { Header } from '@rneui/themed';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import BackBtn from '../../../components/buttons/backButton';
import FeedPost from '../../../components/card/FeedPost';
import { Insta_Typo_logo } from '../../../constants/assets';
import { usePostbyId } from '../../../hooks/data/fetchPosts';
import { Box } from '../../../theme';
const PostPage = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const postId = route.params?.postId;
  const {data: postData} = usePostbyId(postId)
  console.log('postData: ', postData.user.userId);

  const [mutedStates, setMutedStates] = useState({});

  const toggleMute = postId => {
    setMutedStates(prevState => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };



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
              navigation.navigate('ProfileView', {userId: postData?.user?.userId})
            }
            ProfileUrl={postData.user?.avatar}
            userId={currentUser?.userId}
            postId={postData.id}
            mediaSrc={postData.mediaUrls}
            isMuted={!mutedStates[postData.id]}
            toggleMute={() => toggleMute(postData.id)}
            mediaType={postData.mediaType}
            Caption={postData.caption}
            user={postData.user?.username}
            location={postData.location}
            time={postData.time}
            comments={postData.comments}
          />
       
      </ScrollView>
    </Box>
  );
};

export default PostPage;
