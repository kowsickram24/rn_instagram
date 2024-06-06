import { useEffect, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Explore from '../../screens/app/explore/Explore';
import Home from '../../screens/app/home/Home';
import Notification from '../../screens/app/notification/Notification';
import Profile from '../../screens/app/profile/Profile';
import { useSelector } from 'react-redux';
import {
  Heaty_f,
  Heaty_uf,
  Home_f,
  Home_uf,
  Plus,
  Search_f,
  Search_uf,
} from '../../constants/assets';
import NewPost from '../../screens/app/post/Newpost';
import { Avatar } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BottomTab = createBottomTabNavigator();

const BottomNavigator = () => {
  const [currentUser, setCurrentUser] = useState(null)
const user = useSelector(state => state.user)
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setCurrentUser(JSON.parse(user));
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };
  
  fetchUserData();
}, []);
  return (
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

        }}
        name="Explore"
        component={Explore}
      />
      <BottomTab.Screen
        options={{
          tabBarIcon: ({focused}) => <Plus />,
        }}
        name="NewPost"
        component={NewPost}
      />
      <BottomTab.Screen
        name="Notification"
        options={{
          tabBarIcon: ({focused}) => (focused ? <Heaty_f /> : <Heaty_uf />),
        }}
        component={Notification}
      />
      <BottomTab.Screen
        options={{
          tabBarIcon: ({focused}) => <Avatar
          avatarStyle={{borderRadius: 18}}
          containerStyle={{width: 36, height: 36}}
          source={{uri: currentUser?.profilepic}} />,
        }}
        name="Profile"
        component={Profile}
      />
    </BottomTab.Navigator>
  );
};

export default BottomNavigator;
