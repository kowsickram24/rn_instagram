import React, {useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {createBox, createText} from '@shopify/restyle';
import ImageCropPicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@rneui/themed';
const Box = createBox();
const Text = createText();
import {Dimensions} from 'react-native';
import {Input} from '@rneui/themed';
import {Image_Fill, Loc} from '../../../constants/assets';
const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const NewPost = ({navigation}) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      setImage(result.path);
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  };

  const handleCreatePost = async () => {
    if (image) {
      try {
        const post = {image, caption: 'New Post', createdAt: new Date()};
        const existingPosts =
          JSON.parse(await AsyncStorage.getItem('posts')) || [];
        const updatedPosts = [post, ...existingPosts];
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error saving post: ', error);
      }
    }
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{uri: image}} style={styles.image} />
        ) : (
         <Image_Fill />
        )}
      </TouchableOpacity>
      <Box padding={'s'} gap={'m'}>
        <Input style={{height: 80}} multiline placeholder="Description" />
        <TouchableOpacity>
          <Text color={'mainblack'}>Add location</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text color={'mainblack'}>Tag People</Text>
        </TouchableOpacity>
      </Box>
      <Box flex={1} justifyContent="flex-end">
        <Button title="Share" onPress={handleCreatePost} />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    width: Width,
    height: Height / 3,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default NewPost;
