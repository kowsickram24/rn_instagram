import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, useColorScheme } from 'react-native';
import firebase from './firebase.config';
import {  useTheme } from './src/context/Theme/Themectxt';
import { DarkTheme, LightTheme } from './src/theme';
// import S3Bucket from './src/services/aws/s3bucket';
// Language setup
import { I18nextProvider } from 'react-i18next';
import i18n from './src/language/i18n';
import { ThemeProvider } from '@shopify/restyle';


// Network
import { Insta_Typo_logo } from './src/constants/assets';
import { FONT } from './src/constants/constants';
import NetworkProvider from './src/context/Network/NetworkContext';

import Stacknavigator from './src/navigation/Stack/Stack';
import { theme } from './src/theme';
const ThemedComponent = () => {
  const {theme, toggleTheme} = useTheme();

  const styles = theme === 'dark' ? DarkTheme : LightTheme;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.text, {fontFamily: FONT.OpenSans.regular}]}>
        Hello
      </Text>
      <Insta_Typo_logo />
    </SafeAreaView>
  );
};

const App = () => {
  const scheme = useColorScheme();
  console.log(scheme);

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        const user = firebase.auth().currentUser;
        await analytics().logEvent('check_analytics_enabled', {
          status: 'success',
        });
        console.log('Firebase is connected successfully with Analytics');
      } catch (error) {
        console.error('Error connecting to Firebase:', error);
      }
    };
    checkFirebaseConnection();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <NetworkProvider>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <Stacknavigator />
          </NavigationContainer>
        </I18nextProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
};

export default App;
