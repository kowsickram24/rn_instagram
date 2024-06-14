import {ActivityIndicator} from 'react-native';
import {Box} from '../../theme';

export const Loader = () => {
  return (
    <Box
      flex={1}
      style={{backgroundColor: 'white'}}
      justifyContent="center"
      alignItems="center">
      <ActivityIndicator size="large" color="primary" />
    </Box>
  );
};
