import {createBox, createText} from '@shopify/restyle';
import React, {useState, useEffect} from 'react';
import ReachTab from '../../../navigation/TopTab/ReachTab';
import {Back} from '../../../constants/assets';
import {TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
const Box = createBox();
const Text = createText();

const AccountReach = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [userData, setUserData] = useState();
  const fetchUser = async () => {
    try {
      const userQuery = await firestore()
        .collection('instagram')
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
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Back />
        </TouchableOpacity>
        <Text color={'mainblack'}>{userData?.username}</Text>
      </Box>
      <ReachTab userData={userData} />
    </Box>
  );
};

export default AccountReach;
