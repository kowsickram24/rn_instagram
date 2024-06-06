import {Tags, Grid} from '../../constants/assets';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyPosts from '../../screens/app/profile/Info/MyPosts';
import MyTags from '../../screens/app/profile/Info/MyTags';
const TopTab = createMaterialTopTabNavigator();

const TopNavigator = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicatorStyle:{
            backgroundColor:'#000',
        }
      }}>
      <TopTab.Screen
        options={{
          tabBarIcon: () => <Grid />,
        }}
        name="MyPosts"
        component={MyPosts}
      />
      <TopTab.Screen
        options={{
          tabBarIcon: () => <Tags />,
        }}
        name="MyTags"
        component={MyTags}
      />
    </TopTab.Navigator>
  );
};


export default TopNavigator;