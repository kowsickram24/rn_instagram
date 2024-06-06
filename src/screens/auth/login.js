import firestore from '@react-native-firebase/firestore';
import { createBox, createText } from '@shopify/restyle';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import { Back, Fb_logo, Insta_Typo_logo, Line } from '../../constants/assets';
import { LoginSchema } from '../../utils/validation';
const Box = createBox();
const Text = createText();

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/userSlice';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = await firestore().collection('instagram').get();
        console.log(
          'Users collection: ',
          userCollection.docs.map(doc => doc.data()),
        );
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          console.log(user,'old user')
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogin = async (values, {setSubmitting, setErrors}) => {
    try {
      const userQuerySnapshot = await firestore()
        .collection('instagram')
        .where('email', '==', values.email)
        .get();

      if (userQuerySnapshot.empty) {
        setErrors({email: 'Incorrect email '});
      } else {
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();
        console.log(userData, 'firebase');

        if (userData.password === values.password) {
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          dispatch(login(userData));
          navigation.navigate('Main');
        } else {
          setErrors({password: t('Incorrect Credentials')});
        }
      }
    } catch (error) {
      console.error('Error logging in: ', error);
    }
    setSubmitting(false);
  };

  return (
    <Box
      backgroundColor={'mainwhite'}
      flex={1}
      justifyContent="space-between"
      padding={'l'}>
      <Box>
        <TouchableOpacity>
          <Back />
        </TouchableOpacity>
      </Box>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Box>
            <Box style={{alignSelf: 'center', marginVertical: 40}}>
              <Insta_Typo_logo />
            </Box>
            <Inputbox
              placeholder={t('Auth.emailPlaceholder')}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              errorMessage={touched.email && errors.email}
            />
            <Inputbox
              secureTextEntry
              placeholder={t('Auth.passwordPlaceholder')}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              errorMessage={touched.password && errors.password}
            />

            <Box style={{alignSelf: 'flex-end'}}>
              <TouchableOpacity>
                <Text variant={'Pass'}>{t('Auth.forgetPassword')}</Text>
              </TouchableOpacity>
            </Box>
            <Authbutton
              title={t('Auth.loginButton')}
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
            <TouchableOpacity>
              <Box
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap={'s'}>
                <Fb_logo />
                <Text variant={'FBcnt'}>{t('Auth.loginWithFacebook')}</Text>
              </Box>
            </TouchableOpacity>
          </Box>
        )}
      </Formik>
      <Box gap={'l'}>
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap={'s'}>
          <Line />
          <Text>{t('Auth.OR')} </Text>
          <Line />
        </Box>
        <Box style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Text variant={'Linkcnt'}>{t('Auth.DontHaveAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text variant={'Linktxt'}>{t('Auth.Signup')}</Text>
          </TouchableOpacity>
        </Box>
      </Box>
      <Text textAlign="center" variant={'Footertxt'}>
        {t('Auth.footerText')}
      </Text>
    </Box>
  );
};

export default LoginScreen;
