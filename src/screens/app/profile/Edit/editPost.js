import {Box, Text} from '../../../../theme';
import firestore from '@react-native-firebase/firestore';
import {Image, Dimensions, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';
import {Input} from '@rneui/themed';
import {Back} from '../../../../constants/assets';
import {PrimaryBtn} from '../../../../components/buttons/primaryButton';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
const {width, height} = Dimensions.get('screen');
import ToastManager, {Toast} from 'toastify-react-native';
const EditPost = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState(route.params.selectedPost);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('instagram')
      .where('email', '==', currentUser.email)
      .onSnapshot(
        querySnapshot => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userPosts = userData.posts || [];
            const updatedPost = userPosts.find(
              p => p.imageUrl === posts.imageUrl,
            );
            if (updatedPost) {
              setPosts(updatedPost);
            }
          } else {
            console.log('No matching documents.');
          }
        },
        error => {
          console.error('Error fetching user data: ', error);
        },
      );

    return () => unsubscribe();
  }, [currentUser.email, posts.imageUrl]);

  const handleEdit = async () => {
    try {
      const userQuerySnapshot = await firestore()
        .collection('instagram')
        .where('email', '==', currentUser.email)
        .get();

      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();
        const userPosts = userData.posts || [];

        const updatedPosts = userPosts.map(p =>
          p.imageUrl === posts.imageUrl
            ? {...p, caption: posts.caption, location: posts.location}
            : p,
        );

        await firestore()
          .collection('instagram')
          .doc(userDoc.id)
          .update({posts: updatedPosts})
          .then(() => Toast.success('Updated Post'));
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error Updating post: ', error);
    } finally {
      navigation.navigate('Profile');
    }
  };

  const handleLocationChange = text => {
    setPosts({...posts, location: text});
  };

  return (
    <Box
      justifyContent="space-around"
      backgroundColor="mainwhite"
      padding="s"
      gap="s"
      flex={1}>
      <ToastManager position="top" />
      <Box flexDirection="row" alignItems="center" gap="m">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'}>Edit Post</Text>
      </Box>
      <Image
        resizeMode="cover"
        source={{uri: posts?.imageUrl}}
        style={{height: 350}}
      />
      <Input
        value={posts.caption}
        onChangeText={text => setPosts({...posts, caption: text})}
        multiline
        inputContainerStyle={{height: 100}}
      />
      <Input value={posts.location} onChangeText={handleLocationChange} />
      <PrimaryBtn onPress={handleEdit} title="Save Changes" />
    </Box>
  );
};

export default EditPost;
