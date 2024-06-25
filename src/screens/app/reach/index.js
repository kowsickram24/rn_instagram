import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Back} from '../../../constants/assets';
import ReachTab from '../../../navigation/TopTab/ReachTab';
import {Box, Text} from '../../../theme';

const AccountReach = ({navigation, route}) => {
  console.log('route: ', route.params.User);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(route.params.User.userId)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserData(userData);
          console.log('user reach: ', userData);
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user details: ', error);
      }
    };

    fetchUser();
  }, [route.params.User]);

  return (
    <Box backgroundColor={'mainwhite'} flex={1}>
      <Box flexDirection="row" padding={'m'} gap={'m'} alignItems="center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'}>{userData?.username}</Text>
      </Box>
      <ReachTab userData={userData} />
    </Box>
  );
};

export default AccountReach;
