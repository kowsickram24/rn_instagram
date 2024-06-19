import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Back } from '../../../constants/assets';
import ReachTab from '../../../navigation/TopTab/ReachTab';
import { Box, Text } from '../../../theme';

const AccountReach = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [userData, setUserData] = useState();
  const fetchUser = async () => {
    try {
      const userQuery = await firestore()
        .collection('users')
        .where('email', '==', currentUser.email)
        .get();

      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        setUserData(userData);
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user details: ', error);
    }
  };
  useEffect(() => {
    fetchUser();
  },[])
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
