import { firestore } from '../../../../firebase.config';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Back} from '../../../constants/assets';
import ReachTab from '../../../navigation/TopTab/ReachTab';
import {Box, Text} from '../../../theme';
import {Header} from '@rneui/themed';
import BackBtn from '../../../components/buttons/backButton';

const AccountReach = ({navigation, route}) => {
  console.log('route: ', route.params.screen);
  const screen = route?.params?.screen;
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
      <Header
        statusBarProps={{hidden: true}}
        leftContainerStyle={{flex:3}}
        leftComponent={
          <Box flexDirection="row" gap={'s'} alignItems="center">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text fontSize={14} numberOfLines={1} color={'mainblack'}>{userData?.username}</Text>
          </Box>
        }
        backgroundColor="white"
      />
      <ReachTab screen={screen} userData={userData} />
    </Box>
  );
};

export default AccountReach;
