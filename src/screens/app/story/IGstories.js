import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
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
import {firestore} from '../../../../firebase.config';
import {Box, Text} from '../../../theme';
import {StoryFooter} from './StoryFooter';
import {Avatar} from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const storyViewDuration = 15 * 1000;

export const IgStories = ({storyData, OpenStoryModal, onDismiss}) => {
  const usersStories = storyData || [];
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const progress = useSharedValue(0);
  const story = usersStories[storyIndex];

  useEffect(() => {
    if (story) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: storyViewDuration,
        easing: Easing.linear,
      });
    }
  }, [storyIndex]);

  const goToPrevStory = () => {
    setStoryIndex(index => {
      if (index === 0) {
        return usersStories.length - 1;
      }
      return index - 1;
    });
  };

  const goToNextStory = () => {
    setStoryIndex(index => {
      if (index === usersStories.length - 1) {
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

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <Modal
    onRequestClose={() => onDismiss()}
      onDismiss={onDismiss}
      animationType="slide"
      transparent
      visible={OpenStoryModal}
      statusBarTranslucent>
      <SafeAreaView style={{flex: 1, backgroundColor: 'black'}}>
        <Box flex={1}>
          {story && (
            <>
              <FastImage
                source={{uri: story.image}}
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
                  {usersStories.map((_, index) => (
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
                        uri: story?.user?.avatar,
                      }}
                    />
                    <Text color={'mainwhite'} fontWeight={'600'}>
                      {story?.user?.username}
                    </Text>
                    <Text style={{color: 'gray'}} fontSize={12} fontWeight={'600'}>
                      {story?.time?.toDate().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </Text>
                  </Box>
                  <Pressable onPress={() => console.log('Three dots')}>
                    <Icon name="dots-vertical" color="white" size={20} />
                  </Pressable>
                </Box>
                <Text
                  verticalAlign="middle"
                  textAlign="center"
                  padding={'s'}
                  color={'mainwhite'}
                  fontWeight={'600'}>
                  {story?.caption}
                </Text>
              </Box>
            </>
          )}
        </Box>
        <Box flex={0.1}>
          <StoryFooter />
        </Box>
      </SafeAreaView>
    </Modal>
  );
};
