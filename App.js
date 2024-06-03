import analytics from '@react-native-firebase/analytics';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import firebase from './firebase.config';
import {ASSET} from './src/constants/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import S3Bucket from './src/services/aws/s3bucket';
const App = () => {
  const {type, isConnected} = useNetInfo();
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
    <SafeAreaView style={styles.container}>
      <S3Bucket />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
