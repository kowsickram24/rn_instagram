import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();
import Followers from '../../screens/app/reach/followers';
import Following from '../../screens/app/reach/following';
const ReachTab = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarIndicatorStyle: {backgroundColor: 'black'},
      }}>
      <TopTab.Screen name="Following" component={Following} />
      <TopTab.Screen name="Followers" component={Followers} />
    </TopTab.Navigator>
  );
};

export default ReachTab;
