import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import {Fb_logo, Insta_Typo_logo, Line} from '../../constants/assets';
import {Box, Text} from '../../theme';
import {LoginSchema} from '../../utils/validation';
import Toast from 'react-native-toast-message';

import {useDispatch} from 'react-redux';
import {login} from '../../store/slices/userSlice';
import {Loader} from '../../components/loader/Loader';

const LoginScreen = ({navigation, getData}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  // Function to handle sending password reset email
  const handleForgotPassword = async email => {
    if (!email) {
      Toast.show({
        type: 'info',
        text1: 'Enter Email',
        text1Style: {fontWeight: '400', fontSize: 16},
      });
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      alert('Password reset email sent successfully. Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert(
        'Failed to send password reset email. Please check the email address and try again.',
      );
    }
  };

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
          console.log(user, 'old user');
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      setLoading(true);
      const userQuerySnapshot = await firestore()
        .collection('instagram')
        .where('email', '==', values.email)
        .get();

      if (userQuerySnapshot.empty) {
        setErrors({ email: 'Incorrect email' });
        setSubmitting(false);
      }

      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.data();

      const { email, password } = values;
      await auth().signInWithEmailAndPassword(email, password);

      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text1Style: { fontSize: 16, fontWeight: '400' },
      });
      console.log('User authenticated:', email);

      await AsyncStorage.setItem('user', JSON.stringify(userData));

      dispatch(login(userData));

      await getData();

      navigation.replace('User');
    } catch (error) {
      console.error('Error logging in:', error);

      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrors({ password: 'Incorrect Credentials' });
      } else {
        setErrors({ email: 'Error logging in. Please try again later.' });
      }
    }
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <Box
      backgroundColor={'mainwhite'}
      flex={1}
      justifyContent="space-evenly"
      padding={'l'}>
      {loading ? (
        <Loader /> // Display the loader when Loading is true
      ) : (
        <>
          <Box alignSelf="center" marginVertical={'l'}>
            <Insta_Typo_logo />
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
                  <TouchableOpacity
                    onPress={() => handleForgotPassword(values.email)}>
                    <Text fontSize={14} color={'primaryBlue'}>
                      {t('Auth.forgetPassword')}
                    </Text>
                  </TouchableOpacity>
                </Box>
                <Authbutton
                  title={t('Auth.loginButton')}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                />
              </Box>
            )}
          </Formik>
          <TouchableOpacity>
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={'s'}>
              <Fb_logo />
              <Text color={'primaryBlue'}>{t('Auth.loginWithFacebook')}</Text>
            </Box>
          </TouchableOpacity>
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
              <Text color={'lightgrey'}>{t('Auth.DontHaveAccount')} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text color={'primaryBlue'} fontSize={14}>
                  {t('Auth.Signup')}
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
          <Box>
            <Text textAlign="center" fontSize={12}>
              {t('Auth.footerText')}
            </Text>
          </Box>
        </>
      )}
      <Toast visibilityTime={1200} position="top" bottomOffset={20} />
    </Box>
  );
};

export default LoginScreen;
