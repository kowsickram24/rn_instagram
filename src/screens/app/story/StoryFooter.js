import {Box} from '../../../theme';
import {Input} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Feather';
export const StoryFooter = ({}) => {
  return (
    <Box flexDirection='row'>
      <Input
        renderErrorMessage={false}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: 'white',
          borderRadius: 20,
        }}
        containerStyle={{
          padding: 10,
        }}
        placeholderTextColor={'white'}
        inputStyle={{padding: 10, fontSize: 14, color: 'white'}}
        placeholder="Message"
      />
      <Icon name="send" color="white" size={20} />
    </Box>
  );
};
