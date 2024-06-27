import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, Header, Input, LinearProgress} from '@rneui/themed';
import {Buffer} from 'buffer';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import {HelperText} from 'react-native-paper';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import BackBtn from '../../../../components/buttons/backButton';
import DropdownComponent from '../../../../components/dropdown/dropDownPicker';
import config from '../../../../config';
import {Defaultimage} from '../../../../constants/assets';
import {S3Bucket} from '../../../../services/aws/s3bucket';
import {Box, Text} from '../../../../theme';

const {width, height} = Dimensions.get('screen');
const EditProfile = ({navigation, route}) => {
  const UserDefault = Defaultimage;
  const currentUser = route?.params;
  const [uploadProgress, setUploadProgress] = useState(0);
  const user = useSelector(state => state.user.user);
  const [newImage, setNewImage] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    fullname: '',
    bio: '',
    gender: '',
  });
  const RBSheetref = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Prefer not to say', value: 'Prefer not to say'},
  ]);

  const fetchUserData = async () => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .where('email', '==', user?.email)
        .get();
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data();
        setUserData({
          ...userData,
          gender: userData.gender || '',
        });
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

  const removeProfile = async () => {
    try {
      setNewImage(UserDefault);
      await updateFirestore(UserDefault);
      navigation.navigate('Profile');
      console.log('Profile picture updated to default successfully');
    } catch (error) {
      console.error('Error updating profile picture to default: ', error);
      alert('Failed to update profile picture to default. Please try again.');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 1080,
        height: 1080,
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
      const options = {
        partSize: 5 * 1024 * 1024,
        queueSize: 1,
        onProgress: event => {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        },
      };
      await S3Bucket.upload(params, options).promise();
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
          gender: userData.gender, // Update gender field
        });
        setUserData(prevState => ({...prevState, avatar: imageUrl}));
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
      setIsLoading(true);
      let imageUrl = userData.avatar;
      if (newImage) {
        imageUrl = await uploadImageToS3(newImage);
      }
      await updateFirestore(imageUrl);
      setNewImage(null);
      navigation.navigate('Profile');
    } catch (error) {
      console.error('Error saving changes: ', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{
          flex: 3,
        }}
        leftComponent={
          <Box gap={'m'} alignItems="center" flexDirection="row">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text fontSize={14} color={'mainblack'}>
              Edit profile{' '}
            </Text>
          </Box>
        }
      />
      <Box padding={'m'} flex={1} paddingVertical={'l'}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Avatar
            containerStyle={{alignSelf: 'center'}}
            rounded
            size={'large'}
            source={{uri: newImage || currentUser?.avatar}}
          />
          <TouchableOpacity onPress={() => RBSheetref.current.open()}>
            <Text
              padding={'s'}
              fontSize={12}
              color="primaryBlue"
              textAlign="center">
              Edit Picture
            </Text>
          </TouchableOpacity>
          <Box gap={'l'}>
            <Input
              label={'Name'}
              renderErrorMessage={false}
              labelStyle={{fontWeight: '400', fontSize: 12, color: 'grey'}}
              inputContainerStyle={{
                borderBottomWidth: 0.5,
              }}
              inputStyle={{padding: 6, fontSize: 14}}
              value={userData?.username}
              onChangeText={text => setUserData({...userData, username: text})}
            />
            <Input
              label={'User Name'}
              renderErrorMessage={false}
              labelStyle={{fontWeight: '400', fontSize: 12, color: 'grey'}}
              inputContainerStyle={{
                borderBottomWidth: 0.5,
              }}
              inputStyle={{padding: 6, fontSize: 14}}
              placeholder="Bio"
              value={userData?.fullname}
              onChangeText={text => setUserData({...userData, fullname: text})}
            />
            <Input
              label={'Bio'}
              renderErrorMessage={false}
              labelStyle={{fontWeight: '400', fontSize: 12, color: 'grey'}}
              inputContainerStyle={{
                borderBottomWidth: 0.5,
              }}
              inputStyle={{padding: 6, fontSize: 14}}
              placeholder="Bio"
              value={userData?.bio}
              onChangeText={text => setUserData({...userData, bio: text})}
            />
          </Box>
          <Box alignSelf="flex-end">
            <HelperText type="info">
              <Text textAlign="right" fontSize={12}>
                150
              </Text>
            </HelperText>
          </Box>
          <DropdownComponent
            label={'Gender'}
            data={items}
            value={userData.gender}
            onChange={item => setUserData({...userData, gender: item.value})}
            placeholder={'Select gender'}
          />
          {isLoading && (
            <LinearProgress
              variant="indeterminate"
              color="blue"
              value={uploadProgress / 100}
            />
          )}
          <Button
            titleStyle={{fontSize: 14}}
            buttonStyle={{
              borderRadius: 6,
            }}
            containerStyle={{paddingVertical: 24}}
            title={'Save Changes'}
            onPress={handleSaveChanges}
          />
        </ScrollView>
      </Box>
      <RBSheet
        closeOnPressBack
        draggable
        ref={RBSheetref}
        height={height / 4}
        openDuration={100}
        customStyles={{
          container: {
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
          },
        }}>
        <Box flex={1} justifyContent="center" padding={'l'} gap={'xl'}>
          <TouchableOpacity onPress={pickImage}>
            <Text fontSize={14} color={'mainblack'}>
              New profile picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={removeProfile}>
            <Text fontSize={14} color={'red'}>
              Remove current picture
            </Text>
          </TouchableOpacity>
        </Box>
      </RBSheet>
    </Box>
  );
};

export default EditProfile;
