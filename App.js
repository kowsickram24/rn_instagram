import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, useColorScheme} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import firebase from './firebase.config';
import {ThemeProvider, useTheme} from './src/context/Theme/Themectxt';
import {DarkTheme, LightTheme} from './src/theme';
import {Button} from '@rneui/themed';

// import S3Bucket from './src/services/aws/s3bucket';

// Language setup
import {I18nextProvider} from 'react-i18next';
import i18n from './src/language/i18n';
console.log(i18n.t('Bienvenue'))

// Network
import NetworkProvider from './src/context/Network/NetworkContext';
import { FONT } from './src/constants/constants';

const ThemedComponent = () => {
  const {theme, toggleTheme} = useTheme();

  const styles = theme === 'dark' ? DarkTheme : LightTheme;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.text,{fontFamily: FONT.OpenSans.regular}]}>Hello</Text>
      <Button title={'Change Theme'} onPress={toggleTheme}></Button>
    </SafeAreaView>
  );
};

const App = () => {
  const scheme = useColorScheme();
  console.log(scheme)

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
    <ThemeProvider>
      <NetworkProvider>
        <I18nextProvider i18n={i18n}>
          <ThemedComponent />
        </I18nextProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
};

export default App;
