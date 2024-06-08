import {useEffect, useState, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Explore from '../../screens/app/explore/Explore';
import Home from '../../screens/app/home/Home';
import Notification from '../../screens/app/notification/Notification';
import Profile from '../../screens/app/profile/Profile';
import {useSelector} from 'react-redux';
import {
  Heart_bf,
  Heaty_f,
  Heaty_uf,
  Home_f,
  Home_uf,
  Plus,
  Search_f,
  Search_uf,
} from '../../constants/assets';
import {Avatar} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import NewSheet from '../../components/bottomsheet/NewSheet';

const BottomTab = createBottomTabNavigator();

const BottomNavigator = ({navigation}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const user = useSelector(state => state.user);
  const refRBSheet = useRef();

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
          }}
          name="Explore"
          component={Explore}
        />
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <Plus />
              </TouchableOpacity>
            ),
          }}
          name="NewPost"
          component={() => <View />}
        />
        <BottomTab.Screen
          name="Notification"
          options={{
            tabBarIcon: ({focused}) => (focused ? <Heart_bf /> : <Heaty_uf />),
          }}
          component={Notification}
        />
        <BottomTab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <Avatar
                avatarStyle={{borderRadius: 18}}
                containerStyle={{width: 36, height: 36}}
                source={{uri: currentUser?.profilepic}}
              />
            ),
          }}
          name="Profile"
          component={Profile}
        />
      </BottomTab.Navigator>

      <NewSheet ref={refRBSheet} navigation={navigation} />
    </>
  );
};


export default BottomNavigator;
