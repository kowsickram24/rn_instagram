import { firestore } from '../../../firebase.config';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Followers from '../../screens/app/reach/followers';
import Following from '../../screens/app/reach/following';
import { Box } from '../../theme';

const TopTab = createMaterialTopTabNavigator();

const ReachTab = ({userData, screen}) => {
  const [followersData, setFollowersData] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async userIds => {
      try {
        const userDetails = await Promise.all(
          userIds.map(async user => {
            const userDoc = await firestore()
              .collection('users')
              .doc(user.userId)
              .get();
            return {userId: user.userId, ...userDoc.data()};
          }),
        );
        return userDetails;
      } catch (error) {
        console.error('Error fetching user details: ', error);
        return [];
      }
    };

    const fetchAllData = async () => {
      const fetchedFollowers = await fetchUserDetails(userData.followers);
      const fetchedFollowing = await fetchUserDetails(userData.following);
      setFollowersData(fetchedFollowers);
      setFollowingData(fetchedFollowing);
      setLoading(false);
    };

    fetchAllData();
  }, [userData?.followers, userData?.following]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#0000ff" />
      </Box>
    );
  }

  return (
    <TopTab.Navigator
      initialRouteName={screen}
      screenOptions={{
        tabBarAndroidRipple: {borderless: false},
        tabBarLabelStyle: {fontSize: 14,fontWeight:'500', textTransform: 'capitalize'},
        tabBarBounces: false,
        tabBarIndicatorStyle: {backgroundColor: 'black'},
      }}>
      <TopTab.Screen
        options={{
          tabBarLabel: `Following ${followingData?.length}`,
        }}
        name="Following">
        {props => (
          <Following
            {...props}
            currentUser={userData}
            userData={followingData}
          />
        )}
      </TopTab.Screen>
      <TopTab.Screen
        options={{
          tabBarLabel: `Followers ${followersData?.length}`,

        }}
        name="Followers">
        {props => (
          <Followers
            {...props}
            currentUser={userData}
            userData={followersData}
          />
        )}
      </TopTab.Screen>
    </TopTab.Navigator>
  );
};

export default ReachTab;
