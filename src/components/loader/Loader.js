import {ActivityIndicator} from 'react-native';
import {Box, Text} from '../../theme';

export const Loader = ({text}) => {
  return (
    <Box
      flex={1}
      style={{backgroundColor: 'white'}}
      justifyContent="center"
      alignItems="center">
      <ActivityIndicator size="large" color="primary" />
      <Text textAlign='center'  color={'mainblack'}>{text}</Text>
    </Box>
  );
};
