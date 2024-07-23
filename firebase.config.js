import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import storage from '@react-native-firebase/storage';
import Config from 'react-native-config';

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  projectId: Config.FIREBASE_PROJECT_ID,
  appID: Config.FIREBASE_APP_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { storage, firebase, firestore, auth, analytics, crashlytics };