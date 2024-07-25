import notifee from '@notifee/react-native';
import { ThemeProvider } from '@shopify/restyle';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { analytics, auth } from './firebase.config';
import i18n from './src/language/i18n';

import { store } from './src/store';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

// Network
import NetworkProvider from './src/context/Network/NetworkContext';

import { NavigationContainer } from '@react-navigation/native';
import { ProgressProvider } from './src/context/Upload/progressCtxt';
import { theme } from './src/theme';

import linking from './linking';
import StackNavigator from './src/navigation/Stack';
import { Notifeeconfig } from './src/services/notifiee/Notifeeconfig';

const App = () => {
  const checkFirebaseConnection = async () => {
    try {
      const user = auth().currentUser;
      await analytics().logEvent('check_analytics_enabled', {
        status: 'success',
      });
      console.log('Firebase is connected successfully with Analytics', user);
    } catch (error) {
      console.error('Error connecting to Firebase:', error);
    }
  };
  useEffect(() => {
    SplashScreen.hide();
    checkFirebaseConnection();
    Notifeeconfig();
  }, []);
  const handleBackgroundEvent = async event => {
    console.log('Background event:', event);
  };

  notifee.onBackgroundEvent(handleBackgroundEvent);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{flex: 1}}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <NetworkProvider>
                <I18nextProvider i18n={i18n}>
                  <ProgressProvider>
                    <NavigationContainer linking={linking}>
                      <StackNavigator />
                    </NavigationContainer>
                  </ProgressProvider>
                </I18nextProvider>
              </NetworkProvider>
            </ThemeProvider>
          </Provider>
        </SafeAreaView>
      </QueryClientProvider>
    </TouchableWithoutFeedback>
  );
};

export default App;
