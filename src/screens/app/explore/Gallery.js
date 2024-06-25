import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet } from 'react-native';
import { Box } from '../../../theme';
import { PostData } from '../../../utils/randomData';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const Gallery = () => {
  const renderPosts = ({ item, index }) => {
    const isLarge = index % 6 === 0; 
    const isFirstInRow = (index % 3 === 0) && !isLarge;

    const imageStyle = isLarge
      ? { width: width / 1.5, height: width / 1.5 }
      : { width: width / 3, height: width / 3 };

    return (
      <Box style={isFirstInRow ? styles.firstInRow : null}>
        <FastImage
          source={{ uri: item.PostUrl }}
          alt="Post-Image"
          style={[imageStyle, styles.image]}
        />
      </Box>
    );
  };

  return (
    <Box flex={1}>
      <FlatList
      showsVerticalScrollIndicator={false}
        data={PostData}
        renderItem={renderPosts}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  firstInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    justifyContent: 'space-between',
  },
  image: {
    resizeMode: 'cover',
    margin: 1, 
  },
});

export default Gallery;
