import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chats from '../../../screens/app/chat/Chats';
import EditProfile from '../../../screens/app/profile/Edit/EditProfile';
import Settings from '../../../screens/app/settings/Settings';
import BottomNavigator from '../../BottomTab/BottomTab';
import NewPost from '../../../screens/app/post/Newpost';

const Stack = createNativeStackNavigator();

const UserStack = ({ getData }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomNavigator} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Settings">
        {props => <Settings {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="NewPost" component={NewPost} />
    </Stack.Navigator>
  );
};

export default UserStack;
