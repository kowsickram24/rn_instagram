import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import EditProfile from '../../../screens/app/profile/Edit/EditProfile';
import Settings from '../../../screens/app/settings/Settings';
import BottomNavigator from '../../BottomTab/BottomTab';
import NewPost from '../../../screens/app/post/create/Newpost';
import PostDesc from '../../../screens/app/profile/View/PostDesc';
import Notification from '../../../screens/app/notification/Notification';
import AccountReach from '../../../screens/app/reach';
import ProfileView from '../../../screens/app/explore/ProfileView';
import PostInfo from '../../../screens/app/explore/public/PostInfo';
import EditPost from '../../../screens/app/profile/Edit/editPost';
import LikedUsers from '../../../screens/app/explore/LikedUsers';

import Chats from '../../../screens/app/chat/Chats';
import ChatBox from '../../../screens/app/chat/ChatBox';
import ChatInfo from '../../../screens/app/chat/ChatInfo';

import AccountCenter from '../../../screens/app/settings/AccountCenter';
import SavedPosts from '../../../screens/app/saves/savedPosts';
import LikedPosts from '../../../screens/app/saves/LikedPosts';
import PostPage from '../../../screens/app/saves/postPage';
const Stack = createNativeStackNavigator();

const UserStack = ({getData}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {props => <BottomNavigator {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={Notification} />
      {/* Chats */}
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ChatBox" component={ChatBox} />
      <Stack.Screen name="ChatInfo" component={ChatInfo} />

      <Stack.Screen name="EditProfile">
        {props => <EditProfile {...props} getData={getData} />}
      </Stack.Screen>
      {/* Posts */}
      <Stack.Screen name="NewPost">
        {props => <NewPost {...props} getData={getData} />}
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
      <Stack.Screen name="AccountCenter" component={AccountCenter} />
    </Stack.Navigator>
  );
};
export default UserStack;
