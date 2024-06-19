import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Chats from '../../../screens/app/chat/Chats';
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
import ChatBox from '../../../screens/app/chat/ChatBox';
import LikedUsers from '../../../screens/app/explore/LikedUsers';

import AccountCenter from '../../../screens/app/settings/AccountCenter';
import SavedPosts from '../../../screens/app/saves/savedPosts';
import LikedPosts from '../../../screens/app/saves/LikedPosts';
const Stack = createNativeStackNavigator();

const UserStack = ({getData}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {props => <BottomNavigator {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={Notification} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ChatBox" component={ChatBox} />
      <Stack.Screen name="Settings">
        {props => <Settings {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile">
        {props => <EditProfile {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="NewPost">
        {props => <NewPost {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="PostDesc" component={PostDesc} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="PostInfo" component={PostInfo} />
      <Stack.Screen name="Editpost" component={EditPost} />

      <Stack.Screen name="Reach" component={AccountReach} />
      <Stack.Screen name="LikedUsers" component={LikedUsers} />

      <Stack.Screen name="MySaves" component={SavedPosts} />
      <Stack.Screen name="LikedPosts" component={LikedPosts} />
      <Stack.Screen name="AccountCenter" component={AccountCenter} />
    </Stack.Navigator>
  );
};
export default UserStack;

