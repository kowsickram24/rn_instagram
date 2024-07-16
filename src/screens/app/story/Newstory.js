import { BlurView } from '@react-native-community/blur';
import { Header, Input } from '@rneui/themed';
import { Buffer } from 'buffer';
import React, { useState } from 'react';
import {
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import { firestore } from '../../../../firebase.config';
import BackBtn from '../../../components/buttons/backButton';
import { config } from '../../../config';
import { S3Bucket } from '../../../services/aws/s3bucket';
import { Box, Text } from '../../../theme';

const Cloudfront = config.CLDFRNTDOM;
const NewStory = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [storytext, setStorytext] = useState('');

  const uploadMediaToAWS = async (mediaPath, mediaType) => {
    try {
      const bucketName = 'instaaws';
      const fileExtension = 'jpg';
      const key = `story_${Date.now()}.${fileExtension}`;
      const mediaUrl = await uploadFileToS3(mediaPath, bucketName, key);
      return mediaUrl;
    } catch (error) {
      console.error(`Error uploading ${mediaType}:`, error);
      return null;
    }
  };

  const uploadFileToS3 = async (fileUri, bucketName, key) => {
    const fileData = await RNFS.readFile(fileUri, 'base64');
    const buffer = Buffer.from(fileData, 'base64');

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      S3Bucket.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cloudFrontUrl = `${Cloudfront}/${key}`;
          resolve(cloudFrontUrl);
        }
      });
    });
  };

  const handleAddStory = async () => {
    try {
      if (!selectedImage) {
        Alert.alert('Error', 'Please select an image for your story.');
        return;
      }
  
      const imageUrl = await uploadMediaToAWS(selectedImage, 'image');
  
      const userStoryDocRef = firestore().collection('stories').doc(currentUser.userId);
      const userStoryDoc = await userStoryDocRef.get();
  
      const newStory = {
        image: imageUrl,
        caption: storytext || '',
        seen: [],
        time: firestore.Timestamp.now(),
      };
  
      if (userStoryDoc.exists) {
        await userStoryDocRef.update({
          stories: firestore.FieldValue.arrayUnion(newStory),
        });
      } else {
        const storyData = {
          userId: currentUser.userId,
          stories: [newStory],
        };
        await userStoryDocRef.set(storyData);
      }
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding story:', error);
      Alert.alert('Error', 'Failed to add story.');
    }
  };
  

  const PickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
      });
      setSelectedImage(image.path);
    } catch (error) {
      console.error('Error picking image: ', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  return (
    <Box flex={1} backgroundColor={'red'}>
      <Header
        statusBarProps={{hidden: true}}
        leftContainerStyle={{flex: 3}}
        leftComponent={
          <Box flexDirection="row" alignItems="center" gap={'s'}>
            <BackBtn onPress={() => navigation.goBack()} />
            <Text numberOfLines={1} fontSize={14} color={'mainblack'}>
              New Story
            </Text>
          </Box>
        }
        backgroundColor="white"
      />
      {/* Canvas */}
      <Box style={{backgroundColor: 'lightgrey'}} flex={1}>
        <ImageBackground
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
          source={{uri: selectedImage}}>
          <Box
            style={{
              backgroundColor:'#000',
              width: '100%',
              padding: 8,
            }}>
            <Input
              renderErrorMessage={false}
              inputContainerStyle={{borderBottomWidth: 0}}
              value={storytext}
              onChangeText={setStorytext}
              inputStyle={{fontSize: 14, color: 'white'}}
              placeholder="Enter Caption"></Input>
          </Box>
        </ImageBackground>
      </Box>

      {/* Button */}
      <Box style={{backgroundColor:'#000', position: 'absolute', bottom: 0, width: '100%'}}>
        <Box
          padding={'m'}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around">
          <TouchableOpacity onPress={PickImage}>
            <Box alignItems="center" gap={'s'} flexDirection="row">
              <Icon name="image" size={20} color="#fff" />
              <Text color={'mainwhite'}>Image</Text>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAddStory}>
            <Box alignItems="center" gap={'s'} flexDirection="row">
              <Icon name="share" size={20} color="#fff" />
              <Text color={'mainwhite'}>Share</Text>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
    </Box>
  );
};
export default NewStory;
