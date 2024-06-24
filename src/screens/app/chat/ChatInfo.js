import {Avatar, Card, Divider, Header} from '@rneui/themed';
import {Box, Text} from '../../../theme';
import BackBtn from '../../../components/buttons/backButton';
import {Image_Fill, MagicPen, User} from '../../../constants/assets';
import {TouchableOpacity} from 'react-native';
import {height, width} from '../../../theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useRef} from 'react';
const ChatInfo = ({navigation, route}) => {
  const secondUser = route?.params?.secondUser;
  const ThemeRef = useRef();
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
      <Card
      
        wrapperStyle={{padding: 10}}
        containerStyle={{
          padding: 0,
          margin: 0,
          borderWidth: 0,
          paddingVertical: 10,
        }}>
        <TouchableOpacity onPress={() => ThemeRef.current.open()}>
          <Box flexDirection="row" gap={'m'} alignItems="center">
            <MagicPen />
            <Text textAlign="left" color={'mainblack'}>
              Theme
            </Text>
          </Box>
        </TouchableOpacity>
      </Card>
      <RBSheet
      height={height/2}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        closeOnPressBack
        draggable
        ref={ThemeRef}>
        <Box>
          <Text textAlign="center" fontSize={14} color={'mainblack'}>
            Theme
          </Text>
          <Box padding={'m'} gap={'s'}>
          <Text fontSize={14}  color={'mainblack'}>Green</Text>
          <Text fontSize={14}  color={'mainblack'}>Blue</Text>
          <Text fontSize={14}  color={'mainblack'}>Sky Blue</Text>
          <Text fontSize={14}  color={'mainblack'}>Black</Text>
          <Text fontSize={14}  color={'mainblack'}>Grey</Text>
          </Box>
        </Box>
      </RBSheet>
    </Box>
  );
};

export default ChatInfo;
