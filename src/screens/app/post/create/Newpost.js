import notifee, { AndroidImportance } from '@notifee/react-native';
import { Button, Header, Input } from '@rneui/themed';
import { Buffer } from 'buffer';
import React, { useContext, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Config from 'react-native-config';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import { firestore } from '../../../../../firebase.config';
import BackBtn from '../../../../components/buttons/backButton';
import { Gal_Image, Gal_Video, Gallery_Icon } from '../../../../constants/assets';
import { ProgressContext } from '../../../../context/Upload/progressCtxt';
import { S3Bucket } from '../../../../services/aws/s3bucket';
import { Box, Text } from '../../../../theme';
const cloudFrontDomain = Config.AWS_CLOUDFRONT_DOMAIN;

import { FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';

const NewPost = ({ navigation }) => {
  const currentuser = useSelector(state => state.user.user);
  const [selectedImages, setSelectedImages] = useState([]);
  const { setProgress } = useContext(ProgressContext);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const results = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        width: 1080,
        height: 1080,
        multiple: true,
        cropping: true,
        showsSelectedCount: true,
      });

      const imagePaths = results.map(result => result.path);
      console.log('imagePaths: ', imagePaths);
      setSelectedImages(imagePaths);
      setSelectedVideo('');
    } catch (error) {
      console.error('Error picking images: ', error);
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'video',
        showsSelectedCount: true,
        loadingLabelText: 'loading',
      });
      setSelectedVideo(result.path);
      setSelectedImages([]);
    } catch (error) {
      console.error('Error picking video: ', error);
    }
  };

  const uploadMediaToAWS = async (mediaPath, mediaType) => {
    try {
      const bucketName = 'instaaws';
      const fileExtension = mediaType === 'image' ? 'jpg' : 'mp4';
      const key = `post_${Date.now()}.${fileExtension}`;
      console.log('mediaPath: ', mediaPath);
      const mediaUrl = await uploadFileToS3(
        mediaPath,
        bucketName,
        key,
        mediaType,
      );
      console.log(
        `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)
        } uploaded successfully:`,
        mediaUrl,
      );
      return mediaUrl;
    } catch (error) {
      console.error(`Error uploading ${mediaType}:`, error);
      return null;
    }
  };

  const uploadFileToS3 = async (fileUri, bucketName, key, mediaType) => {
    const fileData = await RNFS.readFile(fileUri, 'base64');
    const buffer = Buffer.from(fileData, 'base64');

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: mediaType === 'image' ? 'image/jpeg' : 'video/mp4',
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      S3Bucket.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const cloudFrontUrl = `${cloudFrontDomain}/${key}`;
          resolve(cloudFrontUrl);
        }
      });
    });
  };

  const handleCreatePost = async () => {
    if (selectedImages.length > 0 || selectedVideo) {
      try {
        navigation.navigate('Home');
        setLoading(true);
        const totalFiles = selectedImages.length + (selectedVideo ? 1 : 0);
        let uploadedFiles = 0;
        let totalProgress = 0;

        const updateProgress = progress => {
          totalProgress += progress;
          const overallProgress = totalProgress / totalFiles;
          setProgress(overallProgress);
        };

        const imageUrls = await Promise.all(
          selectedImages.map(image =>
            uploadMediaToAWS(image, 'image', updateProgress).then(url => {
              uploadedFiles++;
              updateProgress(100);
              return url;
            }),
          ),
        );

        const videoUrl = selectedVideo
          ? await uploadMediaToAWS(selectedVideo, 'video', updateProgress).then(
            url => {
              uploadedFiles++;
              updateProgress(100);
              return url;
            },
          )
          : null;

        const mediaUrls = [...imageUrls, ...(videoUrl ? [videoUrl] : [])];

        const newPostRef = firestore().collection('posts').doc();
        const newPostId = newPostRef.id;
        const newPost = {
          postId: newPostId,
          userId: currentuser.userId,
          mediaUrls,
          caption,
          location,
          likes: [],
          comments: [],
          time: new Date().toLocaleString(),
        };

        console.log('newPost: ', newPost);

        await newPostRef.set(newPost);

        const userDocRef = firestore()
          .collection('users')
          .doc(currentuser.userId);

        await userDocRef
          .update({
            posts: firestore.FieldValue.arrayUnion(newPostId),
          })
          .then(() => {
            notifee.displayNotification({
              title: 'Post Created Successfully',
              body: 'Your new post has been uploaded!',
              android: {
                channelId: 'default',
                importance: AndroidImportance.HIGH,
                largeIcon: `${currentuser?.avatar}`,
                pressAction: {
                  id: 'default',
                  launchActivity: 'default',
                },
              },
            });
          });
      } catch (error) {
        console.error('Error creating post:', error);
      } finally {
        setLoading(false);
        setProgress(0);
      }
    }
  };

  return (
    <Box style={{ flex: 1, backgroundColor: 'white' }}>
      <>
        <Header
          backgroundColor="white"
          statusBarProps={{
            hidden: true,
          }}
          leftContainerStyle={{ flex: 3 }}
          leftComponent={
            <Box gap={'m'} alignItems="center" flexDirection="row">
              <BackBtn onPress={() => navigation.goBack()} />
              <Text fontSize={14} color={'mainblack'}>
                New Post
              </Text>
            </Box>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <Box style={styles.mediaPicker}>
            {selectedImages.length > 0 ? (
              <>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  scrollEnabled
                  pagingEnabled
                  style={{ borderRadius: 8 }}
                  data={selectedImages}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableWithoutFeedback>
                      <Box>
                        <Image
                          source={{ uri: item }}
                          style={{ width: 350, height: 350, borderRadius: 8 }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      </Box>
                    </TouchableWithoutFeedback>
                  )}
                />
              </>
            ) : selectedVideo ? (
              <Video
                muted
                source={{ uri: selectedVideo }}
                resizeMode="cover"
                style={styles.media}
              />
            ) : (
              <Gallery_Icon />
            )}
          </Box>

          <Box
            gap={'s'}
            padding={'s'}
            justifyContent="space-evenly"
            flexDirection="row">
            <Button
              buttonStyle={{
                elevation: 1,
                borderRadius: 10,
                backgroundColor: 'powderblue',
              }}
              icon={<Gal_Image />}
              onPress={pickImage}
            />

            <Button
              buttonStyle={{
                elevation: 1,
                borderRadius: 10,
                backgroundColor: 'pink',
              }}
              icon={<Gal_Video />}
              onPress={pickVideo}
            />
          </Box>
          <Box padding={'s'}>
            <Input
              inputStyle={{
                padding: 12,
                height: 100,
                verticalAlign: 'top',
                fontSize: 14,
              }}
              value={caption}
              onChangeText={setCaption}
              inputContainerStyle={{
                borderColor: 'grey',
                borderRadius: 10,
                borderWidth: 0.5,
                borderBottomWidth: 0.5,
              }}
              multiline
              placeholder="Caption"
            />
            <Input
              inputStyle={{
                padding: 12,
                fontSize: 14,
              }}
              value={location}
              onChangeText={setLocation}
              inputContainerStyle={{
                borderColor: 'grey',
                borderRadius: 10,
                borderWidth: 0.5,
                borderBottomWidth: 0.5,
              }}
              placeholder="Location"
            />
          </Box>
        </ScrollView>
        <Button
          titleStyle={{ fontSize: 14 }}
          loading={loading}
          containerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          buttonStyle={{
            borderRadius: 5,
          }}
          title="Share"
          onPress={handleCreatePost}
        />
      </>
    </Box>
  );
};

const styles = StyleSheet.create({
  mediaPicker: {
    borderRadius: 6,
    margin: 6,
    width: 350,
    height: 350,
    backgroundColor: '#fff',
    shadowColor: '#000',
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  media: {
    borderRadius: 6,
    width: '100%',
    height: '100%',
  },
});

export default NewPost;
