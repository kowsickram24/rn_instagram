import React, {useState, useCallback, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Button} from '@rneui/themed';
const Box = createBox();
const Text = createText();
import {Dimensions} from 'react-native';
import S3 from 'aws-sdk/clients/s3';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {Input} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Image_Fill, Rt_Arrow, Loc, Back} from '../../../../constants/assets';
import {useFocusEffect} from '@react-navigation/native';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
import config from '../../../../config';
import {Header} from '@rneui/themed';
import {useSelector} from 'react-redux';
import { Loader } from '../../../../components/loader/Loader';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});

const NewPost = ({navigation, route, getData}) => {
  const currentuser = useSelector(state => state.user.user);
 console.log(currentuser?.id,'hiiiiii')
  const [userData, setUserData] = useState();
  const [postImage, setPostImage] = useState(null);
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      if (route.params?.location) {
        setLocation(route.params.location);
      }
    }, [route.params?.location]),
  );

  const fetchUser = async () => {
    try {
      const userQuery = await firestore()
        .collection('users')
        .where('email', '==', currentuser.email)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        setUserData(userData)
        console.log('userData ', userData.id);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        width: 1080,
        height: 1080,
        cropping: true,
      });
      setPostImage(result.path);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const UploadToAWS = async () => {
    try {
      const bucketName = 'instaaws';
      const key = `post_${Date.now()}_.jpg`;
      const imageUrl = await uploadImageToS3(postImage, bucketName, key);
      console.log('Image uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const uploadImageToS3 = async (imageUri, bucketName, key) => {
    const imageData = await RNFS.readFile(imageUri, 'base64');
    const buffer = Buffer.from(imageData, 'base64');

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(`https://${bucketName}.s3.amazonaws.com/${key}`);
        }
      });
    });
  };
  
  console.log('currentuser: ', currentuser);
  const handleCreatePost = async () => {
    if (postImage) {
      try {
        setLoading(true);
        const imageUrl = await UploadToAWS();
        const newPostRef = firestore().collection('posts').doc(); // Create a new post document reference with an auto-generated ID
        const newPostId = newPostRef.id;
        const newPost = {
          postId: newPostId,
          userId: currentuser.userId,
          imageUrl,
          caption,
          location,
          likes: [],
          comments: [],
          time: new Date().toLocaleString(),
        };
          console.log('newPost: ', newPost);

        // Add the post to the posts collection
        await newPostRef.set(newPost);

        // Update the user's posts array with the new post ID
        const userDocRef = firestore()
          .collection('users')
          .doc(currentuser.userId);

        await userDocRef.update({
          posts: firestore.FieldValue.arrayUnion(newPostId),
        });

        await getData();
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box gap={'m'} alignItems="center" flexDirection="row">
              <Back />
              <Text color={'mainblack'}> New Post </Text>
            </Box>
          </TouchableOpacity>
        }
      />
      {loading ? (<Loader text={'Uploading Post'}/>) :(

        <>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {postImage ? (
            <Image source={{uri: postImage}} style={styles.image} />
          ) : (
            <Image_Fill />
          )}
        </TouchableOpacity>
        <KeyboardAvoidingView enabled behavior="height">
          <Box padding={'m'} gap={'l'}>
            <Input
              inputStyle={{
                borderBottomWidth: 0,
              }}
              value={caption}
              onChangeText={setCaption}
              containerStyle={{
                borderRadius: 10,
                borderWidth: 0.5,
                borderBottomWidth: 0.5,
              }}
              multiline
              placeholder="Caption"
              />
            <Box>
              <Box margin={'s'} borderWidth={0.5} borderRadius={'s'}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Addlocation')}>
                  <Box
                    padding={'s'}
                    flexDirection="row"
                    align
                    alignItems="center"
                    justifyContent="space-between">
                    <Text color={'mainblack'}>Add location</Text>
                    <Rt_Arrow />
                  </Box>
                </TouchableOpacity>
              </Box>
              <Text padding={'s'} color={'mainblack'}>
                {location && location}
              </Text>
            </Box>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Tagpeople')}>
        <Box
        flexDirection="row"
        align
        alignItems="center"
        justifyContent="space-between">
        <Text color={'mainblack'}>Tag People</Text>
        <Rt_Arrow />
        </Box>
        </TouchableOpacity> */}
          </Box>
          <Button
            containerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
            buttonStyle={{
              borderRadius: 5,
            }}
            title="Share"
            onPress={handleCreatePost}
            />
        </KeyboardAvoidingView>
      </>
  )}
    </Box>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    borderRadius: 6,
    margin: 6,
    width: 350,
    height: 350,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  image: {
    borderRadius: 6,
    width: '100%',
    height: '100%',
  },
});

export default NewPost;
