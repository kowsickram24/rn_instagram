import {TouchableOpacity} from 'react-native';
import {Back} from '../../constants/assets';
import {Box, Text} from '../../theme';

const BackBtn = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box padding={'s'} borderRadius={'s'} >
        <Back />
      </Box>
    </TouchableOpacity>
  );
};

export default BackBtn;
