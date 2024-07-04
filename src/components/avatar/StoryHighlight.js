import { Avatar } from '@rneui/themed';
import { TouchableWithoutFeedback } from 'react-native';
import { Box } from '../../theme';

const StoryHighlight = ({ImgSrc}) => {
  return (
    <Box padding={'s'}>
      <TouchableWithoutFeedback>
        <Avatar
          containerStyle={{
            borderWidth: 2,
            borderColor: 'grey',

            borderRadius: 50,
          }}
          rounded
          source={{
            uri: ImgSrc,
          }}
          size={'medium'}
        />
      </TouchableWithoutFeedback>
    </Box>
  );
};
export default StoryHighlight;
