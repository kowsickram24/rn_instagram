import {Box, Text} from '../../../../theme';
import firestore from '@react-native-firebase/firestore';
import {Image, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {useState, useEffect} from 'react';
import {Header, Input} from '@rneui/themed';
import {Back} from '../../../../constants/assets';
import {PrimaryBtn} from '../../../../components/buttons/primaryButton';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
const {width, height} = Dimensions.get('screen');
import ToastManager, {Toast} from 'toastify-react-native';
const EditPost = ({route, navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [posts, setPosts] = useState(route.params.selectedPost);

  const handleEdit = async () => {
    try {
      const postRef = firestore().collection('posts').doc(posts.postId);

      await postRef.update({
        caption: posts.caption,
        location: posts.location,
      });

      console.log('Post updated successfully');
    } catch (error) {
      console.error('Error updating post: ', error);
    } finally {
      navigation.navigate('Profile');
    }
  };

  const handleLocationChange = text => {
    setPosts({...posts, location: text});
  };

  return (
    <Box backgroundColor="mainwhite" padding="s" flex={1}>
      <ToastManager position="top" />
      <Header
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box flexDirection="row" gap={'s'} alignItems="center">
              <Back />
              <Text fontSize={14} color={'mainblack'}>
                Edit Post
              </Text>
            </Box>
          </TouchableOpacity>
        }
        leftContainerStyle={{flex: 3}}
        backgroundColor="white"
        statusBarProps={{hidden: true}}
      />
      <ScrollView overScrollMode="never" showsVerticalScrollIndicator={false}>
        <Box gap={'s'}>
          <Image
            resizeMode="cover"
            source={{uri: posts?.imageUrl}}
            style={{height: 350, borderRadius: 10}}
          />
          <Input
            inputStyle={{fontSize: 14,height:60, textAlignVertical: 'top'}}
            value={posts.caption}
            onChangeText={text => setPosts({...posts, caption: text})}
            multiline
            inputContainerStyle={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderBottomWidth: 0.5,
            }}
          />
          <Input
            inputStyle={{fontSize: 14, textAlignVertical: 'center'}}
            value={posts.location}
            onChangeText={handleLocationChange}
            inputContainerStyle={{
              borderWidth: 0.5,
              borderRadius: 10,
              borderBottomWidth: 0.5,
            }}
          />
          <PrimaryBtn onPress={handleEdit} title="Save Changes" />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default EditPost;
