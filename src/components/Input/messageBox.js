import { Input } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Image_Fill, White_cam_Fill } from '../../constants/assets';
import { Box, Text } from '../../theme';

const MessageBox = ({onChangeText,OnMedia, value, CamPress, OnSend}) => {
  return (
    <Input
      leftIconContainerStyle={{
        padding: 6,
        borderRadius: 50,
        alignContent: 'center',
      }}
      leftIcon={
        <TouchableOpacity onPress={CamPress}>
          <White_cam_Fill />
        </TouchableOpacity>
      }
      inputContainerStyle={{
        borderBottomWidth: 0,
        backgroundColor: 'white',
        borderRadius: 100,
        elevation:2,
        marginVertical:10
      }}
      rightIcon={
        <>
          <Box flexDirection="row" gap={'s'}>
            <TouchableOpacity onPress={OnMedia}>
              <Image_Fill />
            </TouchableOpacity>
            <TouchableOpacity onPress={OnSend}>
              <Text color={'primaryBlue'}>Send</Text>
            </TouchableOpacity>
          </Box>
        </>
      }
      renderErrorMessage={false}
      rightIconContainerStyle={{margin: 8, padding: 10, borderRadius: 20}}
      containerStyle={{padding: 0, margin: 0}}
      value={value}
      onChangeText={onChangeText}
      placeholder="Message"
    />
  );
};

export default MessageBox;
