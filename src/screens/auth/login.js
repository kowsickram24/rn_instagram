import { createBox, createText } from '@shopify/restyle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Inputbox from '../../components/Input/Inputbox';
import Authbutton from '../../components/buttons/authbutton';
import { Back, Fb_logo, Insta_Typo_logo, Line } from '../../constants/assets';

const LoginScreen = ({navigation}) => {
  const Box = createBox();
  const Text = createText();
  const {t} = useTranslation();

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
      <Box>
        <Box style={{alignSelf: 'center', marginVertical: 40}}>
          <Insta_Typo_logo />
        </Box>
        <Inputbox placeholder={t('Auth.emailPlaceholder')} />
        <Inputbox placeholder={t('Auth.passwordPlaceholder')} />
        <Box style={{alignSelf: 'flex-end'}}>
          <TouchableOpacity>
            <Text variant={'Pass'}>{t('Auth.forgetPassword')}</Text>
          </TouchableOpacity>
        </Box>
        <Authbutton title={t('Auth.loginButton')} />
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
