import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import {Fb_logo, Insta_Typo_logo, Line} from '../../constants/assets';
import {Box, Text} from '../../theme';
import {LoginSchema} from '../../utils/validation';
import {Toast} from 'toastify-react-native';
import ToastManager from 'toastify-react-native';
import {useDispatch} from 'react-redux';
import {login} from '../../store/slices/userSlice';
import {Loader} from '../../components/loader/Loader';

const LoginScreen = ({ navigation, getData }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isForget, setIsForget] = useState(false);

  const handleForgotPassword = async email => {
    if (!email) {
      Toast.info('Enter Your Email');
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      setIsForget(true);
    } catch (error) {
      Toast.error('Invalid Email');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = await firestore().collection('users').get();
        console.log('Users collection: ', userCollection.docs.map(doc => doc.data()));
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const user = await AsyncStorage.getItem('user');
  //       if (user) {
  //         console.log(user, 'old user');
  //       } else {
  //         console.log('No user data found');
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch user data:', error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    const { email, password } = values;
    try {

      setSubmitting(true);

      await auth().signInWithEmailAndPassword(email, password).then(() => console.log('Authenticated'));

      const userQuerySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();

      if (userQuerySnapshot.empty) {
        setErrors({ email: 'User data not found in Firestore' });
      } else {
        const userDoc = userQuerySnapshot.docs[0];
        const userData = userDoc.data();

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('User authenticated:', email);

        dispatch(login(userData));
        await getData();
        navigation.navigate('User');
      }
    } catch (error) {
      console.error('Error logging in:', error);

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrors({ password: 'Invalid Credentials' });
      } else {
        setErrors({ password: 'Invalid Credentials. Please try again ' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box backgroundColor={'mainwhite'} flex={1} padding={'l'}>
      {loading ? (
        <Loader text={'Logging In'} />
      ) : (
        <>
          <Box gap={'xl'}>
            <ToastManager position="top" />
            <Box alignSelf="center" marginVertical={'l'}>
              <Insta_Typo_logo />
            </Box>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
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
                  {isForget && (
                    <Box borderRadius={'m'} borderWidth={0.5} padding={'s'}>
                      <Text textAlign="center" color={'primaryBlue'}>
                        Check Your mail for reset password
                      </Text>
                    </Box>
                  )}
                  <Box paddingVertical={'m'}>
                    <TouchableOpacity
                      onPress={() => handleForgotPassword(values.email)}
                    >
                      <Text textAlign='right' fontSize={14} color={'primaryBlue'}>
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
          </Box>
          <Box gap={'xl'}>
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={'s'}
            >
              <Line />
              <Text>{t('Auth.OR')} </Text>
              <Line />
            </Box>
            <Box margin={'xl'} gap={'l'}>
              <Box style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text color={'lightgrey'}>{t('Auth.DontHaveAccount')} </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text color={'primaryBlue'} fontSize={14}>
                    {t('Auth.Signup')}
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>
          <Box flex={2} justifyContent="flex-end">
            <Text paddingTop={'xl'} textAlign="center" fontSize={12}>
              {t('Auth.footerText')}
            </Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default LoginScreen;
