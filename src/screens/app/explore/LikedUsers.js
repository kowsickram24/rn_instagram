import {ScrollView} from 'react-native';
import {Back} from '../../../constants/assets';
import {Box, Text} from '../../../theme';
import {Header} from '@rneui/themed';
import {FlatList, TouchableOpacity} from 'react-native';
const LikedUsers = ({navigation}) => {
  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Box gap={'m'} alignItems="center" flexDirection="row">
              <Back />
              <Text color={'mainblack'}>Likes </Text>
            </Box>
          </TouchableOpacity>
        }
      />
      
      <ScrollView>
        <FlatList ListEmptyComponent={<Text> No Likes Yet</Text>} />
      </ScrollView>
    </Box>
  );
};

export default LikedUsers;
