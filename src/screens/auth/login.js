import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Provider, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import { Insta_Typo_logo, Line } from '../../constants/assets';
import { login } from '../../store/slices/userSlice';
import { Box, Text } from '../../theme';
import { LoginSchema } from '../../utils/validation';
import { auth, firestore } from '../../../firebase.config';

const LoginScreen = ({ navigation, getData }) => {

 const dispatch = useDispatch();
  const { t } = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleForgotPassword = async email => {
    if (!email) {
      setSnackbarMessage('Please enter your email address');
      setSnackbarVisible(true);
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email);
      setSnackbarMessage('Email sent for reset password');
      setSnackbarVisible(true);
    } catch (error) {
      console.log(error);
      setSnackbarMessage('Error sending reset email');
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCollection = await firestore().collection('users').get();
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

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    const { email, password } = values;
    try {
      setSubmitting(true);

      // Authenticate user
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => console.log('Authenticated'));

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
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setErrors({ password: 'Invalid Credentials' });
      } else {
        setErrors({ password: 'Invalid Credentials. Please try again ' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Provider>
      <Box backgroundColor={'mainwhite'} flex={1} padding={'l'}>
        <>
          <Box gap={'xl'}>

            <Box alignSelf="center" marginVertical={'l'}>
              <Insta_Typo_logo />
            </Box>
            <Formik
              initialValues={{ email: '', password: '' }}
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
                  <ScrollView showsVerticalScrollIndicator={false}>
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
                  </ScrollView>

                  <Box paddingVertical={'s'}>
                    <TouchableOpacity
                      onPress={() => handleForgotPassword(values.email)}>
                      <Text textAlign="right" fontSize={14} color={'primaryBlue'}>
                        {t('Auth.forgetPassword')}
                      </Text>
                    </TouchableOpacity>
                  </Box>
                  <Authbutton
                    loading={isSubmitting ? true : false}
                    title={t('Auth.loginButton')}
                    onPress={handleSubmit}
                  />
                </Box>
              )}
            </Formik>
          </Box>
          <Box gap={'m'}>
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap={'s'}>
              <Line />
              <Text>{t('Auth.OR')} </Text>
              <Line />
            </Box>
            <Box margin={'l'} gap={'l'}>
              <Box style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text fontSize={14} color={'darkgrey'}>
                  {t('Auth.DontHaveAccount')}{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text color={'primaryBlue'} fontSize={14}>
                    {t('Auth.Signup')}
                  </Text>
                </TouchableOpacity>
              </Box>
            </Box>
          </Box>

          <Text paddingTop={'xl'} textAlign="center" fontSize={12}>
            {t('Auth.footerText')}
          </Text>
        </>
      </Box>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackbarMessage}
      </Snackbar>
    </Provider>
  );
};

export default LoginScreen;
