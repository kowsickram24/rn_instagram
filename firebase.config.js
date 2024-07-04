import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDyOiP-xzHdgb9-CfjsnKItAzpDgE29v90',
  projectId: 'instagramrn-8a8a4',
  appID: '1:448812778466:android:617293fcd8dbfa52b2afbb',
  storageBucket: 'instagramrn-8a8a4.appspot.com',
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, firestore, auth, analytics, crashlytics };