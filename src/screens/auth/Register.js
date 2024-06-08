import firestore from '@react-native-firebase/firestore';
import {createBox, createText} from '@shopify/restyle';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity} from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import {Back, Insta_Typo_logo, White_cam} from '../../constants/assets';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {RegSchema} from '../../utils/validation';
import config from '../../config';
import ImageCropPicker from 'react-native-image-crop-picker';
import S3 from 'aws-sdk/clients/s3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});

const RegisterScreen = ({navigation, getData}) => {
  const [selectedImage, setSelectedImage] = useState();
  const dispatch = useDispatch()

  const {t} = useTranslation();
  const Box = createBox();
  const Text = createText();

  const uploadProfile = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width:300,
        height:300,
        mediaType: 'photo',
        showCropFrame:false,
        forceJpg: true,
        cropping: true,
        showCropGuidelines: false,
        cropperCircleOverlay:true,
        freeStyleCropEnabled: true,
        cropperToolbarTitle:'Profile',
        hideBottomControls:true,
      });
      setSelectedImage(image.path);
    } catch (error) {
      console.error('Error selecting image:', error);
      console.log('Error', 'Failed to select image');
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

  const UploadToAWS = async () => {
    try {
      const bucketName = 'instaaws';
      const key = `profile_${Date.now()}_.jpg`;
      const imageUrl = await uploadImageToS3(selectedImage, bucketName, key);
      console.log('Image uploaded successfully:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error:', error);
      return null;
    } 
  };

  const handleRegister = async (values, {setSubmitting, setErrors}) => {
    try {
      const usersCollectionRef = firestore().collection('instagram');
      const userQuerySnapshot = await usersCollectionRef
      .where('email', '==', values.email)
      .get();
      if (!userQuerySnapshot.empty) {
        setErrors({email: 'Email already exists'});
      } else {
        const profileImageUrl = await UploadToAWS();
        if (profileImageUrl) {
          await usersCollectionRef.add({
            username: values.username,
            email: values.email,
            password: values.password,
            profilepic: profileImageUrl,
          });
          const userData = {
            username: values.username,
            email: values.email,
            password: values.password,
            profilepic: profileImageUrl,
          }
          AsyncStorage.setItem('user', JSON.stringify(userData));
          dispatch(login(userData))
          await getData();
          navigation.replace('User');
        }
      }
    } catch (error) {
      console.error('Error registering user: ', error);
    }
    setSubmitting(false);
  };

  return (
    <Box
      backgroundColor={'mainwhite'}
      justifyContent="space-between"
      padding={'l'}
      flex={1}>
      <Box>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Back />
        </TouchableOpacity>
      </Box>
      <Box>
        <Box alignSelf="center" marginVertical={'l'}>
          <Insta_Typo_logo />
        </Box>
        <Box alignSelf="center" marginVertical={'l'}>
          <TouchableOpacity onPress={uploadProfile}>
            {selectedImage ? (
              <Image
                style={{
                  width: 90,
                  backgroundColor: '#3797EF',
                  height: 90,
                  borderRadius: 48,
                }}
                source={{uri: selectedImage}}
              />
            ) : (
              <Box
                justifyContent="center"
                backgroundColor={'primaryBlue'}
                borderRadius={'xxxl'}
                alignItems="center"
                width={90}
                height={90}>
                <White_cam />
              </Box>
            )}
          </TouchableOpacity>
        </Box>
        <Formik
          initialValues={{username: '', email: '', password: ''}}
          validationSchema={RegSchema}
          onSubmit={handleRegister}>
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
              <Inputbox
                placeholder={t('Auth.usernamePlaceholder')}
                value={values.username}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                errorMessage={
                  touched.username && errors.username ? errors.username : null
                }
              />
              <Inputbox
                placeholder={t('Auth.emailPlaceholder')}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                errorMessage={
                  touched.email && errors.email ? errors.email : null
                }
              />
              <Inputbox
                placeholder={t('Auth.passwordPlaceholder')}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                errorMessage={
                  touched.password && errors.password ? errors.password : null
                }
              />
              <Authbutton
                title={t('Auth.Signup')}
                onPress={handleSubmit}
                disabled={isSubmitting}
              />
            </>
          )}
        </Formik>
        <Box flexDirection="row" justifyContent="center" alignItems="center">
          <Text variant={'Linkcnt'}> {t('Auth.Alreadyhaveanaccount')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant={'Linktxt'}> {t('Auth.loginButton')}</Text>
          </TouchableOpacity>
        </Box>
      </Box>
      <Box>
        <Text textAlign="center" variant={'Footertxt'}>
          {t('Auth.footerText')}
        </Text>
      </Box>
    </Box>
  );
};


export default RegisterScreen;
