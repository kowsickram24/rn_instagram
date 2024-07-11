import {Card} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Box} from '../../../theme';
import {PostData} from '../../../utils/randomData';

const {width, height} = Dimensions.get('window');

const Gallery = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleLongPress = item => {
    setSelectedImage(item.PostUrl);
    setModalVisible(true);
  };

  const handlePressOut = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderPosts = ({item}) => {
    return (
      <Box style={{flex: 1}}>
        <TouchableWithoutFeedback
          onLongPress={() => handleLongPress(item)}
          onPressOut={handlePressOut}>
          <Box>
            <FastImage
              onProgress={() => null}
              source={{uri: item.PostUrl}}
              alt="Post-Image"
              style={{width: width / 3, height: width / 3}}
            />
          </Box>
        </TouchableWithoutFeedback>
      </Box>
    );
  };

  return (
    <Box flex={1}>
      <FlatList
        pagingEnabled
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        data={PostData}
        renderItem={renderPosts}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPressOut={handlePressOut}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.9)',
            }}>
            {selectedImage && (
              <FastImage
                source={{uri: selectedImage}}
                style={{width: width, height: height / 2}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Box>
  );
};

export default Gallery;
