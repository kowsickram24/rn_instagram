import {Image, TouchableOpacity} from 'react-native';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';

const AccountCenter = ({navigation}) => {
  const CurrentUser = useSelector(state => state.user.user);

  return (
    <Box gap={'s'} padding={'s'} backgroundColor={'mainwhite'} flex={1}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Back />
      </TouchableOpacity>
      <Text textAlign="center" color={'mainblack'}>
        Account Info
      </Text>

      <Box borderRadius={'l'} borderColor={'fadedblack'} borderWidth={1} flex={1} padding={'l'}>
        <Image
          source={{uri: CurrentUser.avatar}}
          style={{
            alignSelf: 'center',
            width: 150,
            height: 150,
            borderRadius: 75,
          }}
        />
        <Box>
          <Text color={'mainblack'}> {CurrentUser?.username}</Text>
          <Text color={'mainblack'}> {CurrentUser?.bio}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountCenter;
