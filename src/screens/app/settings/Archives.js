import {Header} from '@rneui/themed';
import {Box, Text, width} from '../../../theme';
import BackBtn from '../../../components/buttons/backButton';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';

const Archives = ({navigation}) => {
  const currentUser = useSelector(state => state?.user?.user);
  const stories = useSelector(state => state.stories.stories);

  // Filter stories for the current user
  const userStories = stories.filter(
    story => story.userId === currentUser?.userId,
  );

  console.log('userstories: ', userStories);

  return (
    <Box flex={1} color={'mainwhite'}>
      <Header
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box gap={'m'} alignItems="center" flexDirection="row">
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}>Archives</Text>
          </Box>
        }
      />
      <Box flex={1} backgroundColor={'mainwhite'}>
        <FlatList
          horizontal
          data={userStories}
          renderItem={({item}) => (
            <Box backgroundColor={'mainwhite'}>
              {item.stories.map((story, index) => (
                <Box key={index} marginVertical={'s'}>
                  <Box
                    borderRadius={'s'}
                    width={60}
                    height={20}
                    backgroundColor={'mainwhite'}
                    position="absolute"
                    zIndex={23}
                    top={5}
                    left={8}>
                    <Text fontSize={12} color={'mainblack'}>
                      {story?.time
                        ?.toDate()
                        .toLocaleDateString({month: 'long', day: 'numeric'})}
                    </Text>
                  </Box>
                  <FastImage
                    style={{height: 300, width: width / 3}}
                    source={{uri: story.image}}
                  />
                </Box>
              ))}
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};
export default Archives;
