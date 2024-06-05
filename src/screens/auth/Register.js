import {createBox, createText} from '@shopify/restyle';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import {Back, Fb_logo, Insta_Typo_logo, Line} from '../../constants/assets';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = ({navigation}) => {
  const {t} = useTranslation();
  const Box = createBox();
  const Text = createText();

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
        <Inputbox placeholder={t('Auth.usernamePlaceholder')} />
        <Inputbox placeholder={t('Auth.emailPlaceholder')} />
        <Inputbox placeholder={t('Auth.passwordPlaceholder')} />
        <Authbutton title={t('Auth.Signup')} />
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
