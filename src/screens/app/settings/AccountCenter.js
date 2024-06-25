import {Image, TouchableOpacity} from 'react-native';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {Button, Header} from '@rneui/themed';
import {Fragment} from 'react';
import BackBtn from '../../../components/buttons/backButton';

const AccountCenter = ({currentUser, navigation}) => {
  return (
    <Fragment>
      <Header
        statusBarProps={{hidden: true}}
        backgroundColor="white"
        leftComponent={
          <BackBtn onPress={() => navigation.goBack() } />
        }
      />
      <Box gap={'s'} padding={'s'} backgroundColor={'mainwhite'} flex={1}>
        <Text textAlign="center" color={'mainblack'}>
          Account Info
        </Text>

        <Box
          borderRadius={'l'}
          borderColor={'lightgrey'}
          borderWidth={1}
          flex={1}
          padding={'l'}>
          <Image
            source={{uri: currentUser?.avatar}}
            style={{
              alignSelf: 'center',
              width: 150,
              height: 150,
              borderRadius: 75,
            }}
          />
          <Box gap={'s'}>
            <Text color={'mainblack'}> {currentUser?.username}</Text>
            <Text color={'mainblack'}> {currentUser?.fullname}</Text>
            <Text color={'mainblack'}> {currentUser?.bio}</Text>
          </Box>
        </Box>
        <Button
        containerStyle={{padding:6}}
        titleStyle={{
          fontSize: 14
        }}
          onPress={() => navigation.navigate('EditProfile', currentUser)}
          title={'Edit Profile'}
        />
      </Box>
    </Fragment>
  );
};

export default AccountCenter;
