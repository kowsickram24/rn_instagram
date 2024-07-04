import { Input } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { Image_Fill, White_cam_Fill } from '../../constants/assets';
import { Box, Text } from '../../theme';

const MessageBox = ({
  onChangeText,
  OnMedia,
  value,
  CamPress,
  OnSend,
  BackCont,
}) => {
  return (
    <Input
      multiline
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
        borderBottomWidth: 0.7,
        backgroundColor: 'white',
        borderRadius: 100,
        borderWidth: 0.7,
        marginVertical: 10,
      }}
      inputStyle={{
        fontSize:14
      }}
      rightIcon={
        <>
          <Box flexDirection="row" gap={'s'}>
            {!value ? (
              <Box>
                <TouchableOpacity onPress={OnMedia}>
                  <Image_Fill />
                </TouchableOpacity>
              </Box>
            ) : null}
            <Box>
              <TouchableOpacity onPress={OnSend}>
                <Text
                  textAlignVertical="center"
                  verticalAlign="middle"
                  color={'primaryBlue'}>
                  Send
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </>
      }
      renderErrorMessage={false}
      rightIconContainerStyle={{margin: 8, padding: 10, borderRadius: 20}}
      containerStyle={{backgroundColor: BackCont}}
      value={value}
      onChangeText={onChangeText}
      placeholder="Message"
    />
  );
};

export default MessageBox;
