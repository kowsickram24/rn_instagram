import {Avatar, Button, Header} from '@rneui/themed';
import React, {useRef, useState} from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProfileCard from '../../../components/card/profileCard';
import {Dw_Arrow, Menu} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
import {Box, Text, height, width} from '../../../theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import StoryHighlight from '../../../components/avatar/StoryHighlight';
const Profile = ({navigation, User}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const ProfileRef = useRef();
  const handleLongPress = avatar => {
    setSelectedImage(avatar);
    setModalVisible(true);
  };

  const handlePressOut = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <Box flex={1} backgroundColor={'mainwhite'}>
      <Header
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Menu />
          </TouchableOpacity>
        }
        leftComponent={
          <TouchableOpacity onPress={() => ProfileRef.current.open()}>
            <Box flexDirection="row" alignItems="center" gap={'s'}>
              <Text color={'mainblack'} fontWeight={'400'} fontSize={16}>
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
      />
      <Box padding={'m'}>
        {User?.username && (
          <Text fontSize={12} fontWeight={'500'} color={'mainblack'}>
            {User?.fullname}
          </Text>
        )}
        {User?.bio && (
          <Text fontSize={12} color={'mainblack'}>
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
          titleStyle={{color: '#000', fontWeight: '100', fontSize: 14}}
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
              backgroundColor: 'rgba(0,0,0,0.8)',
            }}>
            {selectedImage && (
              <FastImage
                source={{uri: selectedImage}}
                style={{width: width, height: width, borderRadius: width}}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <RBSheet
        draggable
        height={height / 2}
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
            flex={2}
            padding={'s'}
            margin={'s'}
            borderRadius={'m'}
            backgroundColor={'lightgrey'}>
            <Box flexDirection='row' gap={'m'}>
              <Avatar rounded size={'medium'} source={{uri: User?.avatar}} />
              <Text>{User?.username}</Text>
            </Box>
          </Box>
          <Box flex={1} padding={'s'} justifyContent="flex-end">
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('AccountCenter')}>
              <Box padding={'xs'} borderRadius={'m'} borderWidth={1}>
                <Text color={'mainblack'} textAlign="center">
                  Go to Accountcenter
                </Text>
              </Box>
            </TouchableWithoutFeedback>
          </Box>
        </Box>
      </RBSheet>
      {/* Profile Tab */}
      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
