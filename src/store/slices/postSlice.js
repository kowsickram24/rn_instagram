import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../../../firebase.config';

// Thunk to fetch post data
export const fetchPostData = createAsyncThunk(
  'posts/fetchPostData',
  async ({ postId, userId }) => {
    const postRef = firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      const postData = postDoc.data();
      const userRef = firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return { postData, userData };
      }
    }

    throw new Error('Post or User not found');
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    isLiked: false,
    isSaved: false,
    likedUsers: [],
    likedId: [],
    loading: true,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    toggleLike: (state) => {
      state.isLiked = !state.isLiked;
    },
    toggleSave: (state) => {
      state.isSaved = !state.isSaved;
    },
    setLikedUsers: (state, action) => {
      state.likedUsers = action.payload;
    },
    setLikedId: (state, action) => {
      state.likedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostData.fulfilled, (state, action) => {
        const { postData, userData } = action.payload;
        state.isLiked = postData.likes.includes(userData.userId);
        state.isSaved = userData.savedPosts.includes(postData.postId);
        state.loading = false;
      })
      .addCase(fetchPostData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setLoading,
  toggleLike,
  toggleSave,
  setLikedUsers,
  setLikedId,
} = postsSlice.actions;

export default postsSlice.reducer;
