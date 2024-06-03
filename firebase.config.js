import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/analytics';
import '@react-native-firebase/crashlytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDyOiP-xzHdgb9-CfjsnKItAzpDgE29v90',
  projectId: 'instagramrn-8a8a4',
  appID: '1:448812778466:android:617293fcd8dbfa52b2afbb',
  storageBucket: 'instagramrn-8a8a4.appspot.com',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
