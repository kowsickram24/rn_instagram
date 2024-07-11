import { Avatar, Button, Divider, Header } from '@rneui/themed';
import { Fragment } from 'react';
import BackBtn from '../../../components/buttons/backButton';
import { Box, Text } from '../../../theme';

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
        <Text textAlign="center" fontSize={14} color={'mainblack'}>
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
            <Text fontSize={14} style={{color:'grey'}}>Username</Text>
            <Text fontSize={14} color={'mainblack'}>{currentUser?.username}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14} style={{color:'grey'}}>Full Name</Text>
            <Text fontSize={14} color={'mainblack'}>{currentUser?.fullname}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14} style={{color:'grey'}}>Bio</Text>
            <Text  fontSize={14}color={'mainblack'}>{currentUser?.bio}</Text>
          </Box>
          <Box padding={'s'}>
            <Text fontSize={14} style={{color:'grey'}}>Gender</Text>
            <Text  fontSize={14}color={'mainblack'}>{currentUser?.gender}</Text>
          </Box>
          <Box padding={'s'} >
            <Text fontSize={14} style={{color:'grey'}}>Created On</Text>
            <Text fontSize={14} color={'mainblack'}>{currentUser?.createdAt}</Text>
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
