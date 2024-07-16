import {Header} from '@rneui/themed';
import {Box, height, Text, width} from '../../../../theme';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import Video from 'react-native-video';
import {ScrollView} from 'react-native';
import BackBtn from '../../../../components/buttons/backButton';
const data = [
  'https://dlf2yn1748h7h.cloudfront.net/video1.mp4',
  'https://dlf2yn1748h7h.cloudfront.net/video2.mp4',
  'https://dlf2yn1748h7h.cloudfront.net/video3.mp4',
];

const ReelsFeed = () => {
  const [viewHeight, setHeight] = useState(null);
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);


  useFocusEffect(
    useCallback(() => {
      const videoRef = videoRefs.current[currentIndex];
      if (videoRef) {
        videoRef.seek(0);
        videoRef.resume();
      }
    }, [currentIndex]),
  );
  const handleScroll = event => {
    console.log('Scrolling event triggered');
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const itemHeight = height;
    const newIndex = Math.floor(contentOffsetY / itemHeight);
    setCurrentIndex(newIndex);
    console.log(newIndex, 'Scrolling');
  };

  return (
    <ScrollView
    onScroll={handleScroll}
    showsVerticalScrollIndicator={false}
    pagingEnabled 
    >
      <Header
        statusBarProps={{hidden: true}}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text color={'mainblack'}> Reels</Text>
          </Box>
        }
        backgroundColor="white"
      />
      {data?.map((item, index) => (
        <Box key={index} flex={1} backgroundColor="mainwhite" >
          <Video
          paused
          repeat
          ref={ref => (videoRefs.current[index] = ref)}
          playWhenInactive
          resizeMode='cover'
          style={{
            width: width,
            height: height,
          }}
          source={{uri: item}} />
        </Box>
      ))}
    </ScrollView>
  );
};

export default ReelsFeed;
