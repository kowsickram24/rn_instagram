import {useQuery} from '@tanstack/react-query';
import {firestore} from '../../../firebase.config';

const fetchPosts = async userId => {
  try {
    let query = firestore().collection('posts').orderBy('time', 'desc');

    if (userId) {
      query = query.where('userId', '==', userId);
    }

    const snapshot = await query.get();

    const postsData = await Promise.all(
      snapshot.docs.map(async doc => {
        const postData = {id: doc.id, ...doc.data()};

        const userDoc = await firestore()
          .collection('users')
          .doc(postData.userId)
          .get();

        postData.user = userDoc.exists ? userDoc.data() : null;
        return postData;
      }),
    );

    return postsData;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
};
export const usePosts = userId =>
  useQuery({
    queryKey: ['posts', {userId}],
    queryFn: () => fetchPosts(userId),
  });

const fetchPostById = async postId => {
  if (!postId) throw new Error('postId is required');

  const postRef = await firestore().collection('posts').doc(postId).get();

  if (!postRef.exists) {
    throw new Error('No such post document!');
  }

  const postData = postRef.data();

  if (!postData) {
    throw new Error('Failed to get post data!');
  }

  const userDoc = await firestore()
    .collection('users')
    .doc(postData.userId)
    .get();
  postData.user = userDoc.exists ? userDoc.data() : null;

  return postData;
};

export const usePostbyId = postId =>
  useQuery({
    queryKey: ['post', {postId}],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });
