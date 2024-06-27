import {Avatar, Button, Divider, Header} from '@rneui/themed';
import {Fragment} from 'react';
import {Image} from 'react-native';
import BackBtn from '../../../components/buttons/backButton';
import {Box, Text} from '../../../theme';

const AccountCenter = ({currentUser, navigation}) => {
  return (
    <Fragment>
      <Header
        statusBarProps={{hidden: true}}
        backgroundColor="white"
        leftComponent={<BackBtn onPress={() => navigation.goBack()} />}
      />

      <Box
        backgroundColor={'mainwhite'}
        borderRadius={'l'}
        borderColor={'lightgrey'}
        borderWidth={1}
        flex={1}
        gap={'m'}
        padding={'l'}>
        <Text textAlign="center" color={'mainblack'}>
          Account Info
        </Text>
        <Avatar
          size={'large'}
          containerStyle={{
            alignSelf: 'center',
          }}
          source={{uri: currentUser?.avatar}}
          rounded
        />
        <Divider />
        <Box gap={'l'}>
          <Box padding={'s'}>
            <Text fontSize={14}>Username</Text>
            <Text color={'mainblack'}>{currentUser?.username}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14}>Full Name</Text>
            <Text color={'mainblack'}>{currentUser?.fullname}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14}>Bio</Text>
            <Text color={'mainblack'}>{currentUser?.bio}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14}>Gender</Text>
            <Text color={'mainblack'}>{currentUser?.gender}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14}>Created On</Text>
            <Text color={'mainblack'}>{currentUser?.createdAt}</Text>
          </Box>
        </Box>
      </Box>

      <Button
        containerStyle={{padding: 6}}
        titleStyle={{
          fontSize: 14,
        }}
        onPress={() => navigation.navigate('EditProfile', currentUser)}
        title={'Edit Profile'}
      />
    </Fragment>
  );
};

export default AccountCenter;
