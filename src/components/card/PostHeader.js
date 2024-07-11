import { TouchableOpacity } from "react-native";
import { Box, Text } from "../../theme";
import { Avatar } from "@rneui/themed";
import { Three_dots } from "../../constants/assets";

const PostHeader = ({
    location,
    user,
    onOptionpress,
    ProfileUrl,
    onProfilePress,
  }) => {
    return (
      <Box padding={'s'} flexDirection="row" alignItems="center" gap={'s'}>
        <TouchableOpacity onPress={onProfilePress}>
          <Avatar
            avatarStyle={{borderRadius: 21}}
            containerStyle={{width: 42, height: 42}}
            source={{uri: ProfileUrl}}
          />
        </TouchableOpacity>
        <Box flex={1} flexDirection="row" justifyContent="space-between">
          <Box flexDirection="column">
            <TouchableOpacity onPress={onProfilePress}>
              <Text fontSize={14} fontWeight={'500'} color={'mainblack'}>
                {user}
              </Text>
            </TouchableOpacity>
            <Text color={'mainblack'} fontSize={12}>
              {location}
            </Text>
          </Box>
          <TouchableOpacity onPress={onOptionpress}>
            <Box flex={1} padding={'s'} justifyContent="center">
              <Three_dots />
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    );
  };

  export default PostHeader;