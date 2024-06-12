import {Box, Text} from '../../../../theme';
import firestore from '@react-native-firebase/firestore';
import {Image, Dimensions} from 'react-native';
import {useState} from 'react';
import {Input} from '@rneui/themed';
import {Back} from '../../../../constants/assets';
import {PrimaryBtn} from '../../../../components/buttons/primaryButton';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
const {width, height} = Dimensions.get('screen');

const EditPost = ({ route, navigation }) => {
    const currentUser = useSelector(state => state.user.user);
    const [posts, setPosts] = useState(route.params.selectedPost);
  
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
              ? { ...p, caption: posts.caption, location: posts.location }
              : p
          );
  
          await firestore()
            .collection('instagram')
            .doc(userDoc.id)
            .update({ posts: updatedPosts });
  
          setPosts(updatedPosts);
  
          Alert.alert('Success', 'Post updated successfully', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Profile'),
            },
          ]);
  
          console.log('Post Updated successfully');
          navigation.navigate('Profile');
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error Updating post: ', error);
      }
    };
  
    const handleLocationChange = text => {
      setPosts({ ...posts, location: text }); 
    };
  
    return (
      <Box justifyContent="space-around" backgroundColor="mainwhite" padding="s" gap="s" flex={1}>
        <Box flexDirection="row" alignItems="center" gap="m">
          <Back />
          <Text>Edit Post</Text>
        </Box>
        <Image
        resizeMode="cover"
        source={{uri: posts?.imageUrl}}
        style={{height: 350}}
      />
        <Input
          value={posts.caption}
          onChangeText={text => setPosts({ ...posts, caption: text })}
          multiline
          inputContainerStyle={{ height: 100 }}
        />
        <Input
          value={posts.location}
          onChangeText={handleLocationChange} 
        />
        <PrimaryBtn onPress={handleEdit} title="Save Changes" />
      </Box>
    );
  };

export default EditPost;
