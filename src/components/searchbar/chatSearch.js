import {Magnify} from '../../constants/assets';
import {Box, Text} from '../../theme';
import {Input} from '@rneui/themed';
const ChatSearch = ({value, onChangeText}) => {
  return (
    <Box>
      <Input
        clearButtonMode="while-editing"
        onChangeText={onChangeText}
        inputStyle={{fontSize: 14}}
        leftIconContainerStyle={{
          padding: 6,
          margin: 6,
        }}
        inputContainerStyle={{
          marginVertical: 10,
          borderBottomWidth: 0,
          backgroundColor: '#FAFAFA',
          borderRadius: 10,
        }}
        value={value}
        leftIcon={<Magnify />}
        placeholder="Search "
      />
    </Box>
  );
};

export default ChatSearch;
