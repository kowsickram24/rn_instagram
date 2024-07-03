import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  View,
  Vibration,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Box} from '../../../theme';
import {PostData} from '../../../utils/randomData';
import {Card} from '@rneui/themed';

const {width, height} = Dimensions.get('window');

const Gallery = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleLongPress = item => {
    setSelectedImage(item.PostUrl);
    setModalVisible(true);
    Vibration.vibrate()
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
          <FastImage
            source={{uri: item.PostUrl}}
            alt="Post-Image"
            style={{width: width / 3, height: width / 3}}
          />
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
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            {selectedImage && (
              <Card containerStyle={{margin:0, padding:0}}>
                <Card.Title h4 >
                  Explore Images
                </Card.Title>
                <FastImage
                  source={{uri: selectedImage}}
                  style={{width: width, height: height / 2}}
                  resizeMode="contain"
                />
              </Card>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Box>
  );
};

export default Gallery;
