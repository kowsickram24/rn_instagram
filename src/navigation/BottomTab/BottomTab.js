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

const BottomTab = createBottomTabNavigator();

const BottomNavigator = ({navigation, getData}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const refRBSheet = useRef();

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
  useEffect(() => {
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
            tabBarIcon: ({focused}) => (
              <Avatar
                avatarStyle={{borderRadius: 18}}
                containerStyle={{width: 36, height: 36}}
                source={{uri: currentUser?.profilepic}}
              />
            ),
          }}
          name="Profile">
          {props => <Profile {...props} currentUser={currentUser} />}
        </BottomTab.Screen>
      </BottomTab.Navigator>

      <NewSheet ref={refRBSheet} navigation={navigation} />
    </>
  );
};

export default BottomNavigator;
