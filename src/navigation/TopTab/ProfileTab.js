import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Grid, Tags} from '../../constants/assets';
import PostsView from '../../screens/app/explore/public/PostsView';
import TagsView from '../../screens/app/explore/public/TagsView';

const TopTab = createMaterialTopTabNavigator();

const ProfileTab = ({user}) => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          margin:2
        },
      }}>
      <TopTab.Screen
        options={{
          tabBarIcon: () => <Grid />,
        }}
        name="PublicPost">
        {props => <PostsView {...props} user={user} />}
      </TopTab.Screen>
      <TopTab.Screen
        options={{
          tabBarIcon: () => <Tags />,
        }}
        name="PublicTags">
        {props => <TagsView {...props} user={user} />}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default ProfileTab;
