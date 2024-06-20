import {Input} from '@rneui/themed';
import {Box, Text} from '../../theme';
import {Camera, Search_f} from '../../constants/assets';
import {TouchableOpacity} from 'react-native';

const MessageBox = ({onChangeText, value, IconPress}) => {
  return (
    <Input
      leftIconContainerStyle={{
        margin: 6,
        padding: 10,
        backgroundColor: '#3797EF',
        alignSelf: 'center',
        borderRadius: 80,
        alignContent: 'center',
      }}
      leftIcon={
        <TouchableOpacity onPress={IconPress}>
          <Camera />
        </TouchableOpacity>
      }
      inputContainerStyle={{
        borderBottomWidth: 0,
        backgroundColor: '#FAFAFA',
        borderRadius: 100,
      }}
      containerStyle={{padding: 0, margin: 0}}
      value={value}
      onChangeText={onChangeText}
      placeholder="Message"
    />
  );
};

export default MessageBox;
