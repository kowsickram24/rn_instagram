import { Avatar, Button, Header } from '@rneui/themed';
import React, { useRef, useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import StoryHighlight from '../../../components/avatar/StoryHighlight';
import ProfileCard from '../../../components/card/profileCard';
import { Dw_Arrow, Menu, Tick_blue } from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
import { Box, Text, height, width } from '../../../theme';
import { useSelector } from 'react-redux';
import { IgStories } from '../story/IGstories';
const Profile = ({navigation, User}) => {
  const stories = useSelector(state => state.stories.stories);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [storyModal, setStoryModal] = useState(false);
  const ProfileRef = useRef();
  const handleLongPress = avatar => {
    setSelectedImage(avatar);
    setModalVisible(true);
  };

  const handlePressOut = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const handleAccount = () => {
   navigation.navigate('AccountCenter')
   ProfileRef.current.close();
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Menu />
          </TouchableOpacity>
        }
        leftContainerStyle={{flex: 1}}
        leftComponent={
          <TouchableOpacity onPress={() => ProfileRef.current.open()}>
            <Box flexDirection="row" alignItems="center" gap={'s'}>
              <Text color={'mainblack'} numberOfLines={1} fontWeight={'400'} fontSize={14}>
                {User?.username}
              </Text>
              <Dw_Arrow />
            </Box>
          </TouchableOpacity>
        }
        backgroundColor="white"
        statusBarProps={{
          hidden: true,
        }}
      />

      {/* Profile Card*/}

      <ProfileCard
        show={true}
        onPostPress={() => navigation.navigate('MyPosts')  }
        onAvatarLongPress={() => handleLongPress(User?.avatar)}
        // onAvatarPressout={handlePressOut}
        onFollowersPress={() =>
          navigation.navigate('Reach', {screen: 'Followers', User: User})
        }
        followersCount={User?.followers.length}
        onFollowingPress={() =>
          navigation.navigate('Reach', {screen: 'Following', User: User})
        }
        followingCount={User?.following.length}
        Postcount={User?.posts.length}
        userAvatar={User?.avatar}
        onAvatarPress={() => setStoryModal(!storyModal)}
      />
      <Box padding={'m'}>
        {User?.username && (
          <Text fontSize={12} fontWeight={'500'} color={'mainblack'}>
            {User?.fullname}
          </Text>
        )}
        {User?.bio && (
          <Text ellipsizeMode='tail' numberOfLines={3} fontSize={12} color={'mainblack'}>
            {User?.bio}
          </Text>
        )}
      </Box>
      <Box padding={'s'}>
        <Button
          onPress={() => navigation.navigate('EditProfile', User)}
          title={'Edit Profile'}
          containerStyle={{
            borderRadius: 10,
            marginVertical: 6,
          }}
          titleStyle={{color: '#000', fontWeight: '400', fontSize: 14}}
          buttonStyle={{
            backgroundColor: 'lightgrey',
          }}
        />
      </Box>
      <StoryHighlight ImgSrc={'https://picsum.photos/568'} />
      {/* Profile View */}

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
                style={{width: 250, height: 250, borderRadius: 250}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <RBSheet
        draggable
        height={height / 4}
        ref={ProfileRef}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
          wrapper: {
            padding: 2,
          },
        }}>
        <Box flex={1}>
          <Box
            flex={1}
            padding={'m'}
            margin={'s'}
            borderRadius={'m'}
            justifyContent="center"
            backgroundColor={'lightgrey'}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Box flexDirection="row" alignItems="center" gap={'m'}>
                <Avatar rounded size={'medium'} source={{uri: User?.avatar}} />
                <Text fontSize={16} color={'mainblack'}>
                  {User?.username}
                </Text>
              </Box>
              <Tick_blue />
            </Box>
          </Box>
          <Box flex={1} padding={'s'} margin={'m'} justifyContent="flex-end">
            <TouchableWithoutFeedback
              onPress={handleAccount}>
              <Box padding={'xs'} borderRadius={'xl'} borderWidth={1}>
                <Text color={'mainblack'} textAlign="center">
                  Go to Accountcenter
                </Text>
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </Box>
      </RBSheet>
      {/* Profile Tab */}
      <IgStories storyData={stories} OpenStoryModal={storyModal} />
      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
