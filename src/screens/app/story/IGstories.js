import {Avatar, Divider} from '@rneui/themed';
import React, {useEffect, useRef, useState} from 'react';
import {firestore} from '../../../../firebase.config';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {Box, height, Text, width} from '../../../theme';
import {StoryFooter} from './StoryFooter';
import {Platform} from 'react-native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import ShareStory from '../../../components/bottomsheet/shareStory';
import {useDeleteStoryMutation} from '../../../store/slices/storiesApi';

const storyViewDuration = 15 * 1000;

export const IgStories = ({route}) => {
  const dispatch = useDispatch();
  const [deleteStory] = useDeleteStoryMutation();
  const currentUser = useSelector(state => state.user.user);
  const usersStories = route?.params?.stories || [];
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modalvisible, setModalvisible] = useState(false);
  const ActionRef = useRef();
  const ShareRef = useRef();

  const progress = useSharedValue(0);
  const currentUserStories = usersStories[userIndex]?.stories || [];
  const currentStory = currentUserStories[storyIndex];

  useEffect(() => {
    if (currentStory && !paused) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 5000,
        easing: Easing.linear,
      });
    }
  }, [storyIndex, paused]);

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

  console.log(usersStories[userIndex]?.user?.userId);
  const DeleteStory = async () => {
    setLoading(true);
    try {
      await deleteStory({
        userId: usersStories[userIndex]?.user?.userId,
        story: currentStory,
      }),
        setStoryIndex(0);
      setModalvisible(false);
    } catch (error) {
      console.error('Error deleting story: ', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLeftactions = () => {
    return (
      <TouchableOpacity onPress={() => setModalvisible(!modalvisible)}>
        <Box
          width={100}
          flex={1}
          justifyContent="center"
          backgroundColor={'mainblack'}>
          <Text textAlignVertical="center" fontSize={14} color={'red'}>
            {' '}
            Delete
          </Text>
        </Box>
      </TouchableOpacity>
    );
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity onPress={() => ShareRef?.current.open()}>
        <Box
          width={100}
          flex={1}
          justifyContent="center"
          backgroundColor={'mainblack'}>
          <Text textAlignVertical="center" fontSize={14} color={'primaryBlue'}>
            {' '}
            Share
          </Text>
        </Box>
      </TouchableOpacity>
    );
  };

  const PauseStory = () => {
    setPaused(prev => !prev);
    if (!paused) {
      progress.value = withTiming(progress.value, {duration: 0});
    } else {
      progress.value = withTiming(1, {
        duration: (1 - progress.value) * 5000,
        easing: Easing.linear,
      }); // Resume the progress
    }
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
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Box flex={1}>
          <>
            <FastImage
              resizeMethod="scale"
              source={{uri: currentStory?.image}}
              style={{width: '100%', height: '100%'}}
            />

            <Pressable
              style={{position: 'absolute', width: '30%', height: '100%'}}
              onPress={goToPrevStory}
            />
            <Pressable
              style={{
                alignItems: 'center',
                position: 'absolute',
                width: '45%',
                height: '100%',
                left: 100,
              }}
              onPress={PauseStory}
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
                colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0)']}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
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
                {currentUser?.userId ===
                usersStories[userIndex]?.user?.userId ? (
                  <Pressable onPress={() => setModalvisible(!modalvisible)}>
                    <Material name="dots-vertical" color="white" size={20} />
                  </Pressable>
                ) : null}
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
        {currentUser?.userId === usersStories[userIndex]?.user?.userId ? (
          <Swipeable
            containerStyle={{backgroundColor: 'black'}}
            dragOffsetFromLeftEdge={10}
            renderRightActions={() => {}}
            renderLeftActions={renderLeftactions}>
            <Box
              alignItems="flex-start"
              padding={'s'}
              backgroundColor={'mainblack'}>
              <AntDesign size={16} name="doubleright" color={'#fff'} />
            </Box>
          </Swipeable>
        ) : null}
        <Swipeable
          containerStyle={{backgroundColor: 'black'}}
          dragOffsetFromLeftEdge={10}
          renderRightActions={renderRightActions}
          renderLeftActions={() => {}}>
          <Box
            alignItems="flex-end"
            padding={'s'}
            backgroundColor={'mainblack'}>
            <AntDesign size={16} name="doubleleft" color={'#fff'} />
          </Box>
        </Swipeable>
        <StoryFooter userId={usersStories[userIndex]?.user?.userId} />
        <Modal
          onRequestClose={() => setModalvisible(false)}
          animationType="fade"
          transparent
          visible={modalvisible}>
          <Box
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding={'s'}>
            <Box
              padding={'l'}
              borderRadius={'m'}
              gap={'s'}
              backgroundColor={'mainwhite'}>
              <Text fontSize={14} color={'mainblack'} marginBottom="m">
                Delete from story?
              </Text>
              <Divider />
              <TouchableOpacity onPress={DeleteStory}>
                <Text textAlign="center" fontSize={14} color={'red'}>
                  Delete
                </Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={() => setModalvisible(!modalvisible)}>
                <Text textAlign="center" fontSize={14} color={'mainblack'}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </Box>
          </Box>
        </Modal>
        <RBSheet
          ref={ActionRef}
          height={height / 4}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressBack={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Box padding={'s'}>
            <Text textAlign="center" color={'red'}>
              {' '}
              Delete
            </Text>
          </Box>
        </RBSheet>
        <ShareStory storyId={''} ref={ShareRef} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
