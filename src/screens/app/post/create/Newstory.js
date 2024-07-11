import React, {useState, useEffect, useRef} from 'react';
import {View,  TouchableOpacity, Image, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {firestore, storage} from '../../../../../firebase.config';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Box, Text} from '../../../../theme';
import {Button, Header} from '@rneui/themed';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import BackBtn from '../../../../components/buttons/backButton';

import Icon from 'react-native-vector-icons/FontAwesome';

const NewStory = () => {
  const currentUser = useSelector(state => state.user.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [stories, setStories] = useState([]);
  const MediaRef = useRef();
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('stories')
      .where('userId', '==', currentUser.userId)
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot?.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
        });
        setStories(data);
      });

    return () => unsubscribe();
  }, [currentUser.userId]);

  const PickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
      });
      setSelectedImage(image.path);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };


  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        statusBarProps={{hidden: true}}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text numberOfLines={1} color={'mainblack'}>
              New Story
            </Text>
          </Box>
        }
        backgroundColor="white"
      />
      {/* Canvas */}
      <Box borderRadius={'s'} style={{backgroundColor: 'lightgrey'}} flex={8}>
        <FastImage
          resizeMode="contain"
          style={{width: '100%', height: '100%'}}
          source={{uri: selectedImage}}
        />
      </Box>
      <RBSheet
        draggable
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          },
        }}
        ref={MediaRef}>
        <Box
          flex={1}
          alignItems="center"
          justifyContent="space-evenly"
          flexDirection="row">
          <Box>
            <Text>Text</Text>
          </Box>
          <Box>
            <TouchableOpacity onPress={PickImage}>
              <Text>Image</Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </RBSheet>
      <TouchableOpacity onPress={() => MediaRef.current.open()}>
      <Text>

      <Icon name="edit" size={30} color="#000" />
      </Text>
      </TouchableOpacity>
      <Box flex={1} justifyContent="flex-end">
        <Button title={'Share'} />
      </Box>
    </Box>
  );
};

export default NewStory;
