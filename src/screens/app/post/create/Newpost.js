import firestore from '@react-native-firebase/firestore';
import { Button, Header, Input } from '@rneui/themed';
import S3 from 'aws-sdk/clients/s3';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { Loader } from '../../../../components/loader/Loader';
import config from '../../../../config';
import { Back, Image_Fill } from '../../../../constants/assets';
import { Box, Text } from '../../../../theme';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});

const NewPost = ({navigation, route, getData}) => {
  const currentuser = useSelector(state => state.user.user);
  console.log(currentuser?.id, 'hiiiiii');
  const [userData, setUserData] = useState();
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      const userQuery = await firestore()
        .collection('users')
        .where('email', '==', currentuser.email)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        setUserData(userData);
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

  const handleCreatePost = async () => {
    if (postImage) {
      try {
        setLoading(true);
        const imageUrl = await UploadToAWS();
        const newPostRef = firestore().collection('posts').doc();
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

        await newPostRef.set(newPost);

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
        setLoading(false);
      }
    }
  };

  return (
    <Box style={{flex: 1, backgroundColor: 'white'}}>
      {loading ? (
        <Loader text={'Uploading Post'} />
      ) : (
        <>
          <Header
            backgroundColor="white"
            statusBarProps={{
              hidden: true,
            }}
            leftContainerStyle={{flex: 3}}
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Box gap={'m'} alignItems="center" flexDirection="row">
                  <Back />
                  <Text fontSize={14} color={'mainblack'}>
                    New Post
                  </Text>
                </Box>
              </TouchableOpacity>
            }
          />
          <ScrollView>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {postImage ? (
                <Image source={{uri: postImage}} style={styles.image} />
              ) : (
                <Image_Fill />
              )}
            </TouchableOpacity>
            <Box padding={'s'}>
              <Input
                inputStyle={{
                  padding: 12,
                  height: 100,
                  verticalAlign: 'top',
                  fontSize: 14,
                }}
                value={caption}
                onChangeText={setCaption}
                inputContainerStyle={{
                  borderColor: 'grey',
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderBottomWidth: 0.5,
                }}
                multiline
                placeholder="Caption"
              />
              <Input
                inputStyle={{
                  padding: 12,
                  fontSize: 14,
                }}
                value={location}
                onChangeText={setLocation}
                inputContainerStyle={{
                  borderColor: 'grey',
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderBottomWidth: 0.5,
                }}
                placeholder="Location"
              />
            </Box>
          </ScrollView>
          <Button
            titleStyle={{fontSize: 14}}
            loading={'true' ? loading : 'false'}
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
