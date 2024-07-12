import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../../../firebase.config';

// Async thunk for fetching stories
export const fetchStories = createAsyncThunk('stories/fetchStories', async () => {
  const storiesSnapshot = await firestore().collection('stories').orderBy('time', 'desc').get();
  const fetchedStories = [];

  for (const doc of storiesSnapshot.docs) {
    const storyData = { id: doc.id, ...doc.data() };
    const userSnapshot = await firestore().collection('users').doc(storyData.userId).get();
    storyData.user = userSnapshot.data();
    fetchedStories.push(storyData);
  }

  return fetchedStories;
});

const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    stories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload;
        state.loading = false;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storiesSlice.reducer;
