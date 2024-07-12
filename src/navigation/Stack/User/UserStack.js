import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { firestore } from '../../../../firebase.config';
import ChatBox from '../../../screens/app/chat/ChatBox';
import ChatInfo from '../../../screens/app/chat/ChatInfo';
import Chats from '../../../screens/app/chat/Chats';
import LikedUsers from '../../../screens/app/explore/LikedUsers';
import ProfileView from '../../../screens/app/explore/ProfileView';
import PostInfo from '../../../screens/app/explore/public/PostInfo';
import NewPost from '../../../screens/app/post/create/Newpost';
import EditProfile from '../../../screens/app/profile/Edit/EditProfile';
import EditPost from '../../../screens/app/profile/Edit/editPost';
import PostDesc from '../../../screens/app/profile/View/PostDesc';
import AccountReach from '../../../screens/app/reach';
import LikedPosts from '../../../screens/app/saves/LikedPosts';
import PostPage from '../../../screens/app/saves/postPage';
import SavedPosts from '../../../screens/app/saves/savedPosts';
import AccountCenter from '../../../screens/app/settings/AccountCenter';
import Settings from '../../../screens/app/settings/Settings';
import BottomNavigator from '../../BottomTab/BottomTab';
import ReelsFeed from '../../../screens/app/explore/reels/ReelsFeed';
import NewStory from '../../../screens/app/story/Newstory';
const Stack = createNativeStackNavigator();

const UserStack = ({getData}) => {
  const user = useSelector(state => state?.user?.user);
  const [currentUser, setCurrentUser] = useState();
  console.log('currentUser: ', currentUser);

  useEffect(() => {
    let unsubscribe;
    const fetchUser = async () => {
      if (user?.email) {
        try {
          const querySnapshot = await firestore()
            .collection('users')
            .where('email', '==', user.email)
            .get();

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setCurrentUser(userDoc.data());

            // Subscribe to real-time updates
            unsubscribe = firestore()
              .collection('users')
              .doc(userDoc.id)
              .onSnapshot(docSnapshot => {
                if (docSnapshot.exists) {
                  setCurrentUser(docSnapshot.data());
                } else {
                  console.log('User document does not exist');
                }
              });
          } else {
            console.log('No matching documents.');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUser();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.email]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {props => <BottomNavigator User={currentUser} {...props} getData={getData} />}
      </Stack.Screen>
      {/* Chats */}
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ChatBox" component={ChatBox} />
      <Stack.Screen name="ChatInfo" component={ChatInfo} />
      <Stack.Screen name="ReelsFeed" component={ReelsFeed} />
      <Stack.Screen name="NewStory" component={NewStory} />

      <Stack.Screen name="EditProfile">
        {props => <EditProfile {...props} />}
      </Stack.Screen>
      {/* Posts */}
      <Stack.Screen name="NewPost">
        {props => <NewPost {...props} />}
      </Stack.Screen>
      <Stack.Screen name="PostDesc" component={PostDesc} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="PostInfo" component={PostInfo} />
      <Stack.Screen name="Editpost" component={EditPost} />
      <Stack.Screen name="Reach" component={AccountReach} />
      <Stack.Screen name="LikedUsers" component={LikedUsers} />
      {/* Settings */}
      <Stack.Screen name="Settings">
        {props => <Settings {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="MySaves" component={SavedPosts} />
      <Stack.Screen name="LikedPosts" component={LikedPosts} />
      <Stack.Screen name="PostPage" component={PostPage} />
      <Stack.Screen name="AccountCenter">
        {props => <AccountCenter {...props} currentUser={currentUser} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
export default UserStack;
