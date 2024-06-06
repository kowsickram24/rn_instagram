import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chats from '../../../screens/app/chat/Chats';
import BottomNavigator from '../../BottomTab/BottomTab';
import Settings from '../../../screens/app/settings/Settings';
import EditProfile from '../../../screens/app/profile/Edit/EditProfile';


const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomNavigator} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  
  )
}


export default UserStack;
