import {Button, Header} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ProfileCard from '../../../components/card/profileCard';
import {Menu} from '../../../constants/assets';
import TopNavigator from '../../../navigation/TopTab/TopTab';
import {Box, Text, width} from '../../../theme';
const Profile = ({navigation, User}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
          <Text fontSize={12} color={'mainblack'}>
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

      {/* Profile Tab */}
      <TopNavigator navigation={navigation} />
    </Box>
  );
};

export default Profile;
