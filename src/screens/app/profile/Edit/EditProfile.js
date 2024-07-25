import { firestore } from '../../../../../firebase.config';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Avatar, Button, Header, Input } from '@rneui/themed';
import { Buffer } from 'buffer';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSelector } from 'react-redux';
import BackBtn from '../../../../components/buttons/backButton';
import DropdownComponent from '../../../../components/dropdown/dropDownPicker';
import Config from 'react-native-config';
import { Defaultimage } from '../../../../constants/assets';
import { S3Bucket } from '../../../../services/aws/s3bucket';
import { Box, Text } from '../../../../theme';
import { ProfileSchema } from '../../../../utils/validation';
const {width, height} = Dimensions.get('screen');

const EditProfile = ({navigation, route}) => {
  const UserDefault = Defaultimage;
  const currentUser = route?.params;
  const user = useSelector(state => state.user.user);
  const [newImage, setNewImage] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    fullname: '',
    bio: '',
    gender: '',
  });
  const RBSheetref = useRef();
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
      await updateFirestore(UserDefault, userData);
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
      RBSheetref.current.close();
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
        Bucket: Config.AWS_BUCKET_NAME,
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
          console.log(`Upload Progress: ${progress}%`);
        },
      };
      await S3Bucket.upload(params, options).promise();
      const imageUrl = `${Config.AWS_CLOUDFRONT_DOMAIN}/${filename}`;
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error;
    }
  };

  const updateFirestore = async (imageUrl, values) => {
    try {
      const userDoc = await firestore()
        .collection('users')
        .where('email', '==', user?.email)
        .get();

      if (!userDoc.empty) {
        const userDocRef = userDoc.docs[0].ref;
        await userDocRef.update({
          avatar: imageUrl || userData?.avatar,
          username: values?.username,
          fullname: values?.fullname,
          bio: values?.bio,
          gender: values.gender,
        });
        setUserData(prevState => ({...prevState, ...values, avatar: imageUrl}));
        console.log('User profile updated successfully');
      } else {
        console.log('No matching documents.');
      }
    } catch (error) {
      console.error('Error updating Firestore: ', error);
    }
  };

  const handleSaveChanges = async values => {
    try {
      let imageUrl = userData.avatar;
      if (newImage) {
        imageUrl = await uploadImageToS3(newImage);
      }
      await updateFirestore(imageUrl, values).then(() => {
        notifee.displayNotification({
          title: `${currentUser.username}`,
          body: 'Updated profile' ,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
          },
        });
      })
      setNewImage(null);
      navigation.navigate('Profile');
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
          <Formik
            enableReinitialize
            initialValues={{
              username: userData.username,
              fullname: userData.fullname,
              bio: userData.bio,
              gender: userData.gender,
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleSaveChanges}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
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
                    label={'Username'}
                    renderErrorMessage={false}
                    labelStyle={{
                      fontWeight: '400',
                      fontSize: 12,
                      color: 'grey',
                      paddingVertical: 6,
                    }}
                    inputContainerStyle={{
                      borderBottomWidth: 0.5,
                      borderWidth: 0.5,
                      borderRadius: 10,
                    }}
                    inputStyle={{padding: 6, fontSize: 14}}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    errorMessage={
                      touched.username && errors.username ? errors.username : ''
                    }
                  />
                  <Input
                    label={'Full Name'}
                    renderErrorMessage={false}
                    labelStyle={{
                      fontWeight: '400',
                      fontSize: 12,
                      color: 'grey',
                      paddingVertical: 6,
                    }}
                    inputContainerStyle={{
                      borderBottomWidth: 0.5,
                      borderWidth: 0.5,
                      borderRadius: 10,
                    }}
                    inputStyle={{padding: 6, fontSize: 14}}
                    value={values.fullname}
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                    errorMessage={
                      touched.fullname && errors.fullname ? errors.fullname : ''
                    }
                  />
                  <Input
                    label={'Bio'}
                    renderErrorMessage={false}
                    labelStyle={{
                      fontWeight: '400',
                      fontSize: 12,
                      color: 'grey',
                      paddingVertical: 6,
                    }}
                    inputContainerStyle={{
                      borderBottomWidth: 0.5,
                      borderWidth: 0.5,
                      borderRadius: 10,
                      height: 100,
                    }}
                    inputStyle={{
                      height: 100,
                      textAlignVertical:'top',
                      padding: 6,
                      fontSize: 14,
                    }}
                    multiline
                    value={values.bio}
                    onChangeText={handleChange('bio')}
                    onBlur={handleBlur('bio')}
                    errorMessage={touched.bio && errors.bio ? errors.bio : ''}
                  />

                  <DropdownComponent
                    label={'Gender'}
                    data={items}
                    value={values.gender}
                    onChange={item => handleChange('gender')(item.value)}
                    onBlur={handleBlur('gender')}
                    errorMessage={
                      touched.gender && errors.gender ? errors.gender : ''
                    }
                    placeholder={'Select gender'}
                  />
                </Box>
                <Button
                  buttonStyle={{
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  containerStyle={{paddingVertical: 24}}
                  onPress={handleSubmit}>
                  {isSubmitting && (
                    <ActivityIndicator
                      size="small"
                      color="#fff"
                      style={{marginRight: 8}}
                    />
                  )}
                  <Text style={{fontSize: 14, color: '#fff'}}>
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Text>
                </Button>
              </>
            )}
          </Formik>
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
