import React, {useEffect, useRef, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import {Fragment} from 'react';
import {Back} from '../../../../constants/assets';
import S3 from 'aws-sdk/clients/s3';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import ImageCropPicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import config from '../../../../config';
import {useSelector} from 'react-redux';
import {Button, Input} from '@rneui/themed';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dimensions} from 'react-native';
import {DefPP} from '../../../../constants/assets';
const {width, height} = Dimensions.get('screen');
const Box = createBox();
const Text = createText();
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});
const EditProfile = ({navigation}) => {
  const [newImage, setNewImage] = useState(null);
  const user = useSelector(state => state.user.user);
  const [userData, setUserData] = useState();
  const RBSheetref = useRef();

  const fetchUserData = async () => {
    try {
      const userDoc = await firestore()
        .collection('instagram')
        .where('email', '==', user?.email)
        .get();
      if (!userDoc.empty) {
        const userdata = userDoc.docs[0].data();
        setUserData(userdata);
      } else {
        console.log('No matching documents.');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

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
        .collection('instagram')
        .where('email', '==', user?.email)
        .get();

      if (!userDoc.empty) {
        const userDocRef = userDoc.docs[0].ref;
        await userDocRef.update({
          profilepic: imageUrl,
          username: userData.username,
          bio: userData.bio,
        });
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
      let imageUrl = userData.profilepic;
      if (newImage) {
        imageUrl = await uploadImageToS3(newImage);
      }
      await updateFirestore(imageUrl);
      alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving changes: ', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <Box flex={1} padding={'m'} backgroundColor={'mainwhite'}>
      <Box flexDirection="row" alignItems="center" gap={'l'}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'} fontSize={18}>
          Edit Profile
        </Text>
      </Box>
      <Box flex={1} paddingVertical={'l'}>
        <Image
          resizeMode="cover"
          style={{
            alignSelf: 'center',
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
          source={{uri: newImage || userData?.profilepic}}
        />

        <TouchableOpacity onPress={() => RBSheetref.current.open()}>
          <Text color="primaryBlue" textAlign="center">
            Edit Picture
          </Text>
        </TouchableOpacity>
        <Input
          value={userData?.username}
          onChangeText={text => setUserData({...userData, username: text})}
        />
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
