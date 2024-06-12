import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();
import Followers from '../../screens/app/reach/followers';
import Following from '../../screens/app/reach/following';
const ReachTab = ({userData}) => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12},
        tabBarIndicatorStyle: {backgroundColor: 'black'},
      }}>
      <TopTab.Screen name="Following">
        {(props) => <Following {...props} userData={userData} />}
      </TopTab.Screen>
      <TopTab.Screen name="Followers" >
        {(props) => <Followers {...props} userData={userData} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default ReachTab;
