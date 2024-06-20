import {FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Back, Camera, Search_uf} from '../../../constants/assets';
import {Avatar, Input} from '@rneui/themed';
import firestore from '@react-native-firebase/firestore';
import {Box, Text} from '../../../theme';
import {useSelector} from 'react-redux';
import {Button} from '@rneui/themed';
import SnackBar from '../../../components/snackbar/snackBar';
import ChatCard from '../../../components/card/chatCard';
import ChatSearch from '../../../components/searchbar/chatSearch';
const ChatBox = ({navigation}) => {
  const currentUser = useSelector(state => state.user.user);
  const [users, setUsers] = useState([]);
  const [snackVisible, setSnackVisible] = useState(false);

  const showSnackBar = () => {
    setSnackVisible(true);
  };

  const dismissSnackBar = () => {
    setSnackVisible(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = firestore().collection('users');

      try {
        const snapshot = await usersCollection.get();
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.log('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const RenderChats = ({item}) => {};

  return (
    <Box flex={1} backgroundColor="mainwhite">
      <ChatSearch />
      <TouchableOpacity onPress={() => navigation.navigate('ChatBox')}>
        <ChatCard />
      </TouchableOpacity>
      <SnackBar
        visible={snackVisible}
        content="This is a snackbar message!"
        duration={3000}
        onDismiss={dismissSnackBar}
      />
      {/* <Button  onPress={showSnackBar} title={'Snack'} /> */}
    </Box>
  );
};

export default ChatBox;
