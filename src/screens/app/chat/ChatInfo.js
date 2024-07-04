import { Avatar, Card, Divider, Header } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import BackBtn from '../../../components/buttons/backButton';
import { User } from '../../../constants/assets';
import { Box, Text } from '../../../theme';

const ChatInfo = ({navigation, route}) => {
  const secondUser = route?.params?.secondUser;  
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        statusBarProps={{hidden: true}}
        leftComponent={<BackBtn onPress={() => navigation.goBack()} />}
        backgroundColor="white"
      />

      {/* ProfileCard */}
      <Card
        wrapperStyle={{padding: 10}}
        containerStyle={{padding: 0, margin: 0, elevation: 0, borderWidth: 0}}>
        <Box alignSelf="center">
          <Avatar source={{uri: secondUser?.avatar}} rounded size={100} />
        </Box>
        <Text padding={'s'} color={'mainblack'} textAlign="center">
          {secondUser?.username}
        </Text>
        <Text padding={'s'} color={'mainblack'} textAlign="center">
          {secondUser?.fullname}
        </Text>
      </Card>
      <Divider />
      {/* Options */}
      <Card
        wrapperStyle={{padding: 10}}
        containerStyle={{
          padding: 0,
          margin: 0,
          borderWidth: 0,
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProfileView', {userId: secondUser?.userId});
          }}>
          <Box flexDirection="row" gap={'m'} alignItems="center">
            <User />
            <Text textAlign="left" color={'mainblack'}>
              Profile
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
    </Box>
  );
};

export default ChatInfo;
