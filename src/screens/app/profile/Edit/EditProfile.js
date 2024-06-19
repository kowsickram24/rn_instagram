import firestore from '@react-native-firebase/firestore';
import {Button, Header, Input} from '@rneui/themed';
import S3 from 'aws-sdk/clients/s3';
import {Buffer} from 'buffer';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import config from '../../../../config';
import {Back} from '../../../../constants/assets';
import {Box, Text} from '../../../../theme';
import {Toast} from 'toastify-react-native';
const {width, height} = Dimensions.get('screen');
import ToastManager from 'toastify-react-native';
import {Loader} from '../../../../components/loader/Loader';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});
const EditProfile = ({navigation, route}) => {
  const currentUser = route?.params;
  console.log('route?.params: ', route?.params);
  const user = useSelector(state => state.user.user);
  const [newImage, setNewImage] = useState(null);
  const [userData, setUserData] = useState({});
  const RBSheetref = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const fetchUserData = async () => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .where('email', '==', user?.email)
        .get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setUserData(userData);
      } else {
        console.log('No matching documents.');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 300,
        height: 300,
        mediaType: 'photo',
        showCropFrame: false,
        forceJpg: true,
        cropping: true,
        showCropGuidelines: false,
        cropperCircleOverlay: true,
        freeStyleCropEnabled: true,
        cropperToolbarTitle: 'Profile',
        hideBottomControls: true,
      });
      setNewImage(result.path);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const uploadImageToS3 = async imagePath => {
    try {
      const imageData = await RNFS.readFile(imagePath, 'base64');
      const buffer = Buffer.from(imageData, 'base64');
      const filename = `profile_${Date.now()}.jpg`;
      const params = {
        Bucket: config.BUCKETNAME,
        Key: filename,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      };
      await s3.upload(params).promise();
      const imageUrl = `https://${config.BUCKETNAME}.s3.amazonaws.com/${filename}`;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const updateFirestore = async imageUrl => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .where('email', '==', user?.email)
        .get();

      if (!userDoc.empty) {
        const userDocRef = userDoc.docs[0].ref;
        await userDocRef.update({
          avatar: imageUrl || userData?.avatar,
          username: userData?.username,
          fullname: userData?.fullname,
          bio: userData.bio,
        });
        setUserData(prevState => ({...prevState, avatar: imageUrl}));
        //Toast
        Toast.success('Update Successful');
        console.log('User profile updated successfully');
      } else {
        console.log('No matching documents.');
      }
    } catch (error) {
      console.error('Error updating Firestore: ', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      let imageUrl = userData.avatar;
      if (newImage) {
        imageUrl = await uploadImageToS3(newImage);
      }
      await updateFirestore(imageUrl);
      setNewImage(null); // Clear new image after updating
    } catch (error) {
      console.error('Error saving changes: ', error);
      alert('Failed to update profile. Please try again.');
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
              <Text color={'mainblack'}>Edit </Text>
            </Box>
          </TouchableOpacity>
        }
      />
      <ToastManager position="top" />

      <Box padding={'m'} flex={1} paddingVertical={'l'}>
        <Image
          resizeMode="cover"
          style={{
            alignSelf: 'center',
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
          source={{uri: newImage || currentUser?.avatar}}
        />
        <TouchableOpacity onPress={() => RBSheetref.current.open()}>
          <Text padding={'s'} color="primaryBlue" textAlign="center">
            Edit Picture
          </Text>
        </TouchableOpacity>
        <Text color={'lightgrey'} textAlign="left">
          {' '}
          Username
        </Text>
        <Input
          value={userData?.username}
          onChangeText={text => setUserData({...userData, username: text})}
        />
        <Text color={'lightgrey'} textAlign="left">
          {' '}
          Fullname
        </Text>
        <Input
          placeholder="Bio"
          value={userData?.fullname}
          onChangeText={text => setUserData({...userData, fullname: text})}
        />
        <Text color={'lightgrey'} textAlign="left">
          {' '}
          Bio
        </Text>
        <Input
          placeholder="Bio"
          value={userData?.bio}
          onChangeText={text => setUserData({...userData, bio: text})}
        />
        <Button
          containerStyle={{paddingVertical: 24}}
          title={'Save Changes'}
          onPress={handleSaveChanges}
        />
      </Box>
      <RBSheet
        ref={RBSheetref}
        height={height / 3}
        openDuration={100}
        customStyles={{
          container: {
            borderTopRightRadius: 35,
            borderTopLeftRadius: 35,
          },
        }}>
        <Box
          flex={1}
          padding={'l'}
          alignItems="center"
          justifyContent="center"
          gap={'xl'}>
          <TouchableOpacity onPress={pickImage}>
            <Text fontSize={18} color={'mainblack'}>
              New profile picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text fontSize={18} color={'red'}>
              Remove current picture
            </Text>
          </TouchableOpacity>
        </Box>
      </RBSheet>
    </Box>
  );
};

export default EditProfile;
