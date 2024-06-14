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
import {Image_Fill, Rt_Arrow, Loc} from '../../../../constants/assets';
import {useFocusEffect} from '@react-navigation/native';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;
import config from '../../../../config';
import {useSelector} from 'react-redux';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});

const NewPost = ({navigation, route, getData}) => {
  const currentuser = useSelector(state => state.user.user);
  const [userData, setUserData] = useState()
  const [postImage, setPostImage] = useState(null);
  const [location, setLocation] = useState('');
  const [caption, setCaption] = useState('');

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
        .collection('instagram')
        .where('email', '==', currentuser.email)
        .get();
  
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        setUserData(userData);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };
  

  useEffect(() => {
    fetchUser();
  },[]);

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
        const imageUrl = await UploadToAWS();
        const newPost = {
          username: userData.username,
          profilepic: userData.profilepic,
          imageUrl,
          caption,
          location,
          likes: [],
          comments: [],
          time: new Date().toLocaleTimeString(),
        };

        const userDocRef = firestore()
          .collection('instagram')
          .where('email', '==', currentuser.email);

        const querySnapshot = await userDocRef.get();

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          const updatedPosts = [...userData.posts, newPost];

          await userDoc.ref.update({posts: updatedPosts});

          await getData();
          navigation.navigate('Home');
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
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
            value={caption}
            onChangeText={setCaption}
            style={{height: 120}}
            multiline
            placeholder="Caption"
          />
          <TouchableOpacity onPress={() => navigation.navigate('Addlocation')}>
            <Box
              flexDirection="row"
              align
              alignItems="center"
              justifyContent="space-between">
              <Text color={'mainblack'}>Add location</Text>
              <Rt_Arrow />
            </Box>
          </TouchableOpacity>
          <Text>{location && location}</Text>
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
    </Box>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    width: Width,
    height: 300,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default NewPost;
