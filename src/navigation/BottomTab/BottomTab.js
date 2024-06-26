import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Avatar} from '@rneui/themed';
import {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import NewSheet from '../../components/bottomsheet/NewSheet';
import {
  Heart_bf,
  Heaty_uf,
  Home_f,
  Home_uf,
  Plus,
  Search_f,
  Search_uf,
} from '../../constants/assets';
import Explore from '../../screens/app/explore/Explore';
import Home from '../../screens/app/home/Home';
import Notification from '../../screens/app/notification/Notification';
import Profile from '../../screens/app/profile/Profile';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {Box} from '../../theme';
const BottomTab = createBottomTabNavigator();

const BottomNavigator = ({User, navigation}) => {
  const refRBSheet = useRef();
  const currentUser = User;

  return (
    <>
      <BottomTab.Navigator
        screenOptions={{headerShown: false, tabBarShowLabel: false}}>
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) => (focused ? <Home_f /> : <Home_uf />),
          }}
          name="Home"
          component={Home}
        />
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) => (focused ? <Search_f /> : <Search_uf />),
            tabBarHideOnKeyboard: true,
          }}
          name="Explore"
          component={Explore}
        />
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <Box padding={'m'} borderRadius={'xl'}>
                  <Plus />
                </Box>
              </TouchableOpacity>
            ),
          }}
          name="NewPost">
          {() => <View />}
        </BottomTab.Screen>
        <BottomTab.Screen
          name="Notification"
          options={{
            tabBarIcon: ({focused}) => (focused ? <Heart_bf /> : <Heaty_uf />),
          }}
          component={Notification}
        />
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) =>
              focused ? (
                <Avatar
                  rounded
                  containerStyle={{width: 36, height: 36, borderWidth:2}}
                  source={{uri: currentUser?.avatar}}
                />
              ) : (
                <Avatar
                  rounded
                  containerStyle={{width: 36, height: 36}}
                  source={{uri: currentUser?.avatar}}
                />
              ),
          }}
          name="Profile">
          {props => <Profile {...props} User={currentUser} />}
        </BottomTab.Screen>
      </BottomTab.Navigator>

      <NewSheet ref={refRBSheet} navigation={navigation} />
    </>
  );
};

export default BottomNavigator;
