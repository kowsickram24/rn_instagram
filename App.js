import analytics from '@react-native-firebase/analytics';
import React, {useEffect} from 'react';
import firebase from './firebase.config';
// import S3Bucket from './src/services/aws/s3bucket';
import notifee from '@notifee/react-native';
import {ThemeProvider} from '@shopify/restyle';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/language/i18n';

import {Provider} from 'react-redux';
import {store} from './src/store';

import {
  Keyboard,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';
// Network
import NetworkProvider from './src/context/Network/NetworkContext';

import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/navigation/Stack';
import {theme} from './src/theme';

const App = () => {
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
  const handleBackgroundEvent = async event => {
    console.log('Background event:', event);
  };

  notifee.onBackgroundEvent(handleBackgroundEvent);

  return (
    <Provider store={store}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ThemeProvider theme={theme}>
          <NetworkProvider>
            <I18nextProvider i18n={i18n}>
              <NavigationContainer>
                <StackNavigator />
              </NavigationContainer>
            </I18nextProvider>
          </NetworkProvider>
        </ThemeProvider>
      </TouchableWithoutFeedback>
    </Provider>
  );
};

export default App;
