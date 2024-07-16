import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Box, Text} from '../../../theme';
import {StoryFooter} from './StoryFooter';
import {Avatar} from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';

const storyViewDuration = 15 * 1000;

export const IgStories = ({route}) => {
  const currentUser = useSelector(state => state.user.user);
  const usersStories = route?.params?.stories || [];
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const ActionRef = useRef();

  const progress = useSharedValue(0);
  const currentUserStories = usersStories[userIndex]?.stories || [];
  const currentStory = currentUserStories[storyIndex];

  useEffect(() => {
    if (currentStory) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 5000,
        easing: Easing.linear,
      });
    }
  }, [storyIndex]);

  const goToPrevStory = () => {
    setStoryIndex(index => {
      if (index === 0) {
        if (userIndex === 0) {
          setUserIndex(usersStories.length - 1);
        } else {
          setUserIndex(userIndex - 1);
        }
        return usersStories[userIndex].stories.length - 1;
      }
      return index - 1;
    });
  };

  const goToNextStory = () => {
    setStoryIndex(index => {
      if (index === currentUserStories.length - 1) {
        if (userIndex === usersStories.length - 1) {
          setUserIndex(0);
        } else {
          setUserIndex(userIndex + 1);
        }
        return 0;
      }
      return index + 1;
    });
  };

  useAnimatedReaction(
    () => progress.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue === 1) {
        runOnJS(goToNextStory)();
      }
    },
  );

  const handleOption = () => {
    ActionRef.current.open();
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <ActivityIndicator size="large" color="#fafafa" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Box flex={1}>
          <>
            <FastImage
              source={{uri: currentStory?.image}}
              style={{width: '100%', height: '100%'}}
            />

            <Pressable
              style={{position: 'absolute', width: '30%', height: '100%'}}
              onPress={goToPrevStory}
            />

            <Pressable
              style={{
                position: 'absolute',
                width: '30%',
                height: '100%',
                right: 0,
              }}
              onPress={goToNextStory}
            />

            <Box
              style={{
                position: 'absolute',
                top: 0,
                width: '100%',
                padding: 20,
                paddingTop: 10,
              }}>
              <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <Box style={{gap: 5, flexDirection: 'row', marginBottom: 20}}>
                {currentUserStories.map((_, index) => (
                  <Box
                    key={index}
                    style={{
                      flex: 1,
                      height: 3,
                      backgroundColor: 'gray',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <Animated.View
                      style={[
                        {backgroundColor: 'white', height: '100%'},
                        index === storyIndex && indicatorAnimatedStyle,
                        index > storyIndex && {width: 0},
                        index < storyIndex && {width: '100%'},
                      ]}
                    />
                  </Box>
                ))}
              </Box>
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Box flexDirection="row" gap={'s'} alignItems="center">
                  <Avatar
                    rounded
                    size={'small'}
                    source={{
                      uri: usersStories[userIndex]?.user?.avatar,
                    }}
                  />
                  <Text color={'mainwhite'} fontWeight={'600'}>
                    {usersStories[userIndex]?.user?.username}
                  </Text>
                  <Text
                    style={{color: 'gray'}}
                    fontSize={12}
                    fontWeight={'600'}>
                    {currentStory?.time?.toDate().toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </Text>
                </Box>
                <Pressable onPress={handleOption}>
                  <Icon name="dots-vertical" color="white" size={20} />
                </Pressable>
              </Box>
              <Text
                verticalAlign="middle"
                textAlign="center"
                padding={'s'}
                color={'mainwhite'}
                fontWeight={'600'}>
                {currentStory?.caption}
              </Text>
            </Box>
          </>
        </Box>
        <StoryFooter userId={usersStories[userIndex]?.user?.userId} />
        <RBSheet
          ref={ActionRef}
          height={300}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressBack={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
          }}></RBSheet>
      </SafeAreaView>
      {/* </Modal> */}
    </SafeAreaView>
  );
};
