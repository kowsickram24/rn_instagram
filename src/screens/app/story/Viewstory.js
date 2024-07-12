import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {firestore} from '../../../../firebase.config';
import {useSelector} from 'react-redux';
import {Box, Text, height, width} from '../../../theme';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {ImageBackground} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {Avatar, Input} from '@rneui/themed';

const ViewStory = () => {
  const [stories, setStories] = useState([]);
  console.log('stories: ', stories);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const currentUser = useSelector(state => state.user.user);
  const translateY = new Animated.Value(0);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const storiesSnapshot = await firestore()
          .collection('stories')
          .orderBy('time', 'desc')
          .get();

        const fetchedStories = [];
        storiesSnapshot.forEach(doc => {
          fetchedStories.push({id: doc.id, ...doc.data()});
        });

        setStories(fetchedStories);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const navigateToNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Handle end of stories (loop back to beginning or exit)
      // For example, close the modal or implement looping
      setIsModalVisible(false);
    }
  };

  const navigateToPreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      // Handle beginning of stories (loop back to end or exit)
      // For example, close the modal or implement looping
      setIsModalVisible(false);
    }
  };

  const handleGestureEvent = Animated.event(
    [{nativeEvent: {translationY: translateY}}],
    {useNativeDriver: true},
  );

  const handleStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const {translationY} = event.nativeEvent;
      Animated.timing(translateY, {
        toValue: translationY > 100 ? 500 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (translationY > 100) {
          navigateToPreviousStory();
        } else if (translationY < -100) {
          navigateToNextStory();
        }
        translateY.setValue(0);
      });
    }
  };

  if (stories.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No stories available</Text>
      </View>
    );
  }

  const currentStory = stories[currentStoryIndex];

  return (
    <SafeAreaView flex={1} backgroundColor={'mainwhite'}>
      {/* Open Modal Button */}
      <TouchableOpacity onPress={openModal}>
        <Text>Open Stories</Text>
      </TouchableOpacity>

      <Modal
        statusBarTranslucent={false}
        shouldRasterizeIOS
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            data={stories}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ImageBackground
                source={{uri: item.image}}
                resizeMode="cover"
                style={{width: width, height: height}}>
                <BlurView>

                <Box gap={'s'} alignItems='center' padding={'s'} flexDirection='row'>
                  <Avatar
                    rounded
                    size={'medium'}
                    source={{
                      uri: 'https://randomuser.me/api/portraits/men/56.jpg',
                    }}
                  />
                  <Text style={{color: 'white', fontSize: 12, fontWeight:'bold'}}>
                    {item.userId}
                  </Text>
                </Box>
                <BlurView
                  style={{
                    width: '100%',
                    padding: 8,
                  }}>
                </BlurView>
                  <Text style={{color: 'white', fontSize: 18}}>
                    {item.caption}
                  </Text>
                </BlurView>

                <BlurView
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    padding: 8,
                    width: '100%',
                  }}>
                  <Input
                    inputContainerStyle={{
                      borderWidth: 1,
                      borderColor: 'white',
                      borderRadius: 16,
                    }}
                    placeholderTextColor={'white'}
                    inputStyle={{padding: 10, fontSize: 14, color: 'white'}}
                    placeholder="Send Message"
                  />
                </BlurView>
              </ImageBackground>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metadataContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 20,
    left: 20,
    borderRadius: 10,
  },
  captionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ViewStory;
