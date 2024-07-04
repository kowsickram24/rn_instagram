import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Divider, Header } from '@rneui/themed';
import S3 from 'aws-sdk/clients/s3';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import BackBtn from '../../components/buttons/backButton';
import { Loader } from '../../components/loader/Loader';
import config from '../../config';
import { Defaultimage, Eye, Eye_Slash, Insta_Typo_logo } from '../../constants/assets';
import { login } from '../../store/slices/userSlice';
import { Box, Text } from '../../theme';
import { RegSchema } from '../../utils/validation';
const s3 = new S3({
  accessKeyId: config.ACCESSKEYID,
  secretAccessKey: config.SECRETACCESSKEY,
  region: config.REGION,
});
const RegisterScreen = ({navigation, getData}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const handleRegister = async (values, {setSubmitting, setErrors}) => {
    try {
      setSubmitting(true);
      const usersCollectionRef = firestore().collection('users');
      const userQuerySnapshot = await usersCollectionRef
        .where('email', '==', values.email)
        .get();
      console.log(userQuerySnapshot);
      if (!userQuerySnapshot.empty) {
        setErrors({email: 'Email already exists'});
        setSubmitting(false);
      } else {
        const {email, password, username, fullname} = values;
        const FirebaseAuth = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        const userId = FirebaseAuth.user.uid;
        console.log('userId: ', userId);

        const userData = {
          userId: userId,
          username: username,
          email: email,
          fullname: fullname,
          posts: [],
          chats: [],
          avatar: Defaultimage,
          bio: '',
          followers: [],
          following: [],
          savedPosts: [],
          likedPosts: [],
          createdAt: new Date().toLocaleString(),
        };
        await usersCollectionRef.doc(userId).set(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch(login(userData));
        await getData();
        navigation.replace('User');
      }
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Box backgroundColor={'mainwhite'} padding={'m'} flex={1}>
      {loading ? (
        <Loader text={'Registering user'} />
      ) : (
        <Box>
          <Header
            backgroundColor="white"
            statusBarProps={{hidden: true}}
            leftComponent={<BackBtn onPress={() => navigation.goBack()} />}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Box alignSelf="center" marginVertical={'l'}>
              <Insta_Typo_logo />
            </Box>
            <Formik
              initialValues={{
                username: '',
                fullname: '',
                email: '',
                password: '',
              }}
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
                    placeholder={t('Auth.emailPlaceholder')}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    errorMessage={
                      touched.email && errors.email ? errors.email : null
                    }
                  />
                  <Inputbox
                    placeholder={t('Auth.fullnameplaceholder')}
                    value={values.fullname}
                    onChangeText={handleChange('fullname')}
                    onBlur={handleBlur('fullname')}
                    errorMessage={
                      touched.fullname && errors.fullname
                        ? errors.fullname
                        : null
                    }
                  />
                  <Inputbox
                    placeholder={t('Auth.usernamePlaceholder')}
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    errorMessage={
                      touched.username && errors.username
                        ? errors.username
                        : null
                    }
                  />
                  <Inputbox
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Eye /> : <Eye_Slash />}
                      </TouchableOpacity>
                    }
                    placeholder={t('Auth.passwordPlaceholder')}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!showPassword}
                    errorMessage={
                      touched.password && errors.password
                        ? errors.password
                        : null
                    }
                  />

                  <Divider />
                  <Authbutton
                    title={t('Auth.Signup')}
                    onPress={handleSubmit}
                    loading={isSubmitting ? true : false}
                  />
                </>
              )}
            </Formik>
            <Box
              flexDirection="row"
              justifyContent="center"
              alignItems="center">
              <Text> {t('Auth.Alreadyhaveanaccount')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text color={'primaryBlue'}> {t('Auth.loginButton')}</Text>
              </TouchableOpacity>
            </Box>
          </ScrollView>
          <Box position="relative" top={16}>
            <Text fontSize={12} textAlign="center">
              {t('Auth.footerText')}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RegisterScreen;
