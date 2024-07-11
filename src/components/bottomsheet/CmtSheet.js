import { Avatar, Input } from "@rneui/themed";
import { FlatList, TouchableOpacity } from "react-native";
import { Box, Text } from "../../theme";
import { forwardRef, useEffect, useState } from "react";
import { firestore } from "../../../firebase.config";
import { Heaty_f, Heaty_uf } from "../../constants/assets";
import RBSheet from "react-native-raw-bottom-sheet";
import { TextInput } from "react-native";

const CmtSheet = forwardRef(({postId, userId, navigation}, ref) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [userAvatar, setUserAvatar] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
  
    useEffect(() => {
      const fetchComments = async () => {
        const postRef = firestore().collection('posts').doc(postId);
  
        const unsubscribe = postRef.onSnapshot(async doc => {
          if (doc.exists) {
            const postData = doc.data();
            const commentsWithUserDetails = await Promise.all(
              (postData.comments || []).map(async comment => {
                const userDoc = await firestore()
                  .collection('users')
                  .doc(comment.userId)
                  .get();
                if (userDoc.exists) {
                  const userData = userDoc.data();
                  return {
                    ...comment,
                    username: userData.username,
                    userAvatar: userData.avatar,
                  };
                }
                return comment;
              }),
            );
            setComments(commentsWithUserDetails);
          }
        });
  
        return () => unsubscribe();
      };
  
      fetchComments();
    }, [postId]);
  
    useEffect(() => {
      const fetchUserAvatar = async () => {
        try {
          const userDoc = await firestore().collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserAvatar(userData.avatar || '');
          } else {
            setUserAvatar('');
          }
        } catch (error) {
          console.error('Error fetching user avatar: ', error);
        }
      };
  
      fetchUserAvatar();
    }, [userId]);
  
    const handleComment = async () => {
      if (commentText.trim() === '') return;
  
      try {
        const newComment = {
          userId: userId,
          comment: commentText,
          time: new Date().toISOString(),
          likes: [],
          replies: [],
        };
  
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            comments: firestore.FieldValue.arrayUnion(newComment),
          });
  
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment: ', error);
      }
    };
  
    const handleLikeComment = async (comment, isLiked) => {
      try {
        const updatedLikes = isLiked
          ? comment.likes.filter(id => id !== userId)
          : [...comment.likes, userId];
  
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            comments: comments.map(c =>
              c.time === comment.time ? {...c, likes: updatedLikes} : c,
            ),
          });
      } catch (error) {
        console.error('Error liking comment: ', error);
      }
    };
  
    const handleReply = async comment => {
      if (replyText.trim() === '') return;
  
      try {
        const newReply = {
          userId: userId,
          comment: replyText,
          time: new Date().toISOString(),
          likes: [],
        };
  
        const updatedReplies = await Promise.all(
          [...comment.replies, newReply].map(async reply => {
            const userDoc = await firestore()
              .collection('users')
              .doc(reply.userId)
              .get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              return {
                ...reply,
                username: userData.username,
                userAvatar: userData.avatar,
              };
            }
            return reply;
          }),
        );
  
        await firestore()
          .collection('posts')
          .doc(postId)
          .update({
            comments: comments.map(c =>
              c.time === comment.time ? {...c, replies: updatedReplies} : c,
            ),
          });
  
        setReplyText('');
        setReplyingTo(null);
      } catch (error) {
        console.error('Error replying to comment: ', error);
      }
    };
  
    const renderCommentItem = ({item}) => (
      <Box key={item.time} paddingHorizontal="m" paddingVertical="s">
        <Box flexDirection="row" alignItems="center">
          <Avatar source={{uri: item.userAvatar}} size="small" rounded />
          <Box marginLeft="s">
            <TouchableOpacity
              onPress={() =>
                navigation.push('ProfileView', {userId: item.userId})
              }>
              <Text fontSize={10} color="mainblack" fontWeight="400">
                {item.username}
              </Text>
            </TouchableOpacity>
            <Box
              flex={1}
              flexDirection="row"
              alignItems="center"
              gap={'s'}
              justifyContent="space-between">
              <Text fontSize={12} color="mainblack">
                {item.comment}
              </Text>
              <Box justifyContent="flex-end" alignItems="center">
                <TouchableOpacity
                  onPress={() =>
                    handleLikeComment(item, item.likes.includes(userId))
                  }>
                  {item.likes.includes(userId) ? (
                    <Heaty_f height="14" width="14" />
                  ) : (
                    <Heaty_uf height="14" width="14" />
                  )}
                </TouchableOpacity>
                {/* <Text fontSize={10}> {item?.likes?.length}</Text> */}
              </Box>
            </Box>
          </Box>
        </Box>
        <TouchableOpacity onPress={() => setReplyingTo(item)}>
          <Text color={'darkgrey'} fontSize={10}>
            Reply
          </Text>
        </TouchableOpacity>
  
        {item.replies && item.replies.length > 0 && (
          <Box marginLeft="l">
            {item.replies.map(reply => (
              <Box
                key={reply.time}
                flexDirection="row"
                alignItems="center"
                marginTop="s">
                <Avatar source={{uri: reply.userAvatar}} size="small" rounded />
                <Box marginLeft="s">
                  <Text fontSize={10} color={'mainblack'}>
                    {reply.username}
                  </Text>
                  <Text fontSize={12} color={'mainblack'}>
                    {reply.comment}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  
    return (
      <RBSheet
        draggable
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          },
        }}
        closeOnPressBack
        ref={ref}
        height={450}>
        <Box flex={1}>
          <Text
            padding="s"
            fontWeight="bold"
            fontSize={12}
            textAlign="center"
            color="mainblack">
            Comments
          </Text>
          <FlatList
            contentContainerStyle={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.time}
            ListEmptyComponent={
              <Box flex={1} justifyContent="center" alignItems="center">
                <Text
                  color={'mainblack'}
                  textAlign="center"
                  fontWeight={'bold'}
                  paddingVertical="s">
                  No Comments Yet
                </Text>
              </Box>
            }
          />
  
          {replyingTo && (
            <Box flexDirection="row" alignItems="center" padding="s">
              <Avatar source={{uri: userAvatar}} size="small" rounded />
              <TextInput
                style={{flex: 1, fontSize: 14, marginLeft: 10}}
                placeholder="Write a reply"
                value={replyText}
                onChangeText={setReplyText}
              />
              <TouchableOpacity onPress={() => handleReply(replyingTo)}>
                <Text>Send</Text>
              </TouchableOpacity>
            </Box>
          )}
          {!replyingTo && (
            <Input
              inputStyle={{fontSize: 14}}
              leftIcon={
                <Avatar source={{uri: userAvatar}} size="small" rounded />
              }
              rightIcon={
                <TouchableOpacity onPress={handleComment}>
                  <Text>Send</Text>
                </TouchableOpacity>
              }
              value={commentText}
              onChangeText={setCommentText}
              inputContainerStyle={{borderBottomWidth: 0}}
              placeholder="Write a comment"
            />
          )}
        </Box>
      </RBSheet>
    );
  });


  export default CmtSheet;