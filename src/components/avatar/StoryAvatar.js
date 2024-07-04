import { Avatar } from '@rneui/themed';
import { Box } from '../../theme';

const StoryAvatar = ({source}) => {
  return (
    <>
      <Box marginLeft={'s'}>
        <Avatar
          containerStyle={{borderWidth: 2, borderColor: 'darkviolet'}}
          source={{uri: source}}
          size="medium"
          rounded
        />
      </Box>
    </>
  );
};

export default StoryAvatar;
