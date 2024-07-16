import {Box, Text} from '../../../theme';
import {Input} from '@rneui/themed';
import {useState} from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import { firestore } from '../../../../firebase.config';
export  const StoryFooter = ({userId, storyId}) => {
  const currentUser = useSelector(state => state.user.user);
  const sameUser = currentUser.userId === userId;
  const [replyTxt, setReplyTxt] = useState('');

  const handleReply = async () => {
    if (!replyTxt.trim()) return;

    try {
      // Check if a chat already exists
      const chatQuerySnapshot = await firestore()
        .collection('chats')
        .where('members', 'array-contains', currentUser.userId)
        .get();

      let chatDoc;
      chatQuerySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.members.includes(userId)) {
          chatDoc = doc;
        }
      });

      if (!chatDoc) {
        // Create a new chat
        chatDoc = await firestore()
          .collection('chats')
          .add({
            members: [currentUser.userId, userId],
            lastMessage: {},
            messages: [],
          });
      }

      // Send the reply message in the chat
      const timestamp = firestore.Timestamp.now();
      const newMessage = {
        userId: currentUser.userId,
        messageType: 'storyreply',
        message: replyTxt,
        time: timestamp,
      };

      await firestore()
        .collection('chats')
        .doc(chatDoc.id)
        .update({
          messages: firestore.FieldValue.arrayUnion(newMessage),
          lastMessage: newMessage,
        });

      setReplyTxt('');
    } catch (error) {
      console.error('Error replying to story: ', error);
    }
  };

  return (
    <Box flexDirection="row" backgroundColor={'mainblack'} padding={'s'}>
      {!sameUser ? (
        <>
          <Input
            value={replyTxt}
            onChangeText={setReplyTxt}
            renderErrorMessage={false}
            inputContainerStyle={{
              borderWidth: 1,
              borderColor: 'white',
              borderRadius: 20,
            }}
            containerStyle={{
              flex: 1,
            }}
            rightIcon={
              <TouchableOpacity onPress={handleReply}>
                <Icon name="send" color="white" size={20} />
              </TouchableOpacity>
            }
            placeholderTextColor={'white'}
            inputStyle={{padding: 10, fontSize: 14, color: 'white'}}
            placeholder="Message"
          />
        </>
      ) : (
        <Text fontSize={14} color={'mainwhite'}>
          Seen
        </Text>
      )}
    </Box>
  );
};
