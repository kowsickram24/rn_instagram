import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Chats from '../../../screens/app/chat/Chats';
import EditProfile from '../../../screens/app/profile/Edit/EditProfile';
import Settings from '../../../screens/app/settings/Settings';
import BottomNavigator from '../../BottomTab/BottomTab';
import NewPost from '../../../screens/app/post/create/Newpost';
import Addlocation from '../../../screens/app/post/create/Addlocation';
import TagPeople from '../../../screens/app/post/create/TagPeople';
import PostDesc from '../../../screens/app/profile/View/PostDesc';
const Stack = createNativeStackNavigator();

const UserStack = ({getData}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main">
        {props => <BottomNavigator {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Settings">
        {props => <Settings {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="NewPost" >
        {props => <NewPost {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name='PostDesc' component={PostDesc} />
      <Stack.Screen name="Addlocation" component={Addlocation} />
      <Stack.Screen name="Tagpeople" component={TagPeople} />
    </Stack.Navigator>
  );
};

export default UserStack;
