import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firestore } from '../../../firebase.config';

// Async thunk for fetching stories with optional userId parameter
export const fetchStories = createAsyncThunk('stories/fetchStories', async (userId = null) => {
  let storiesSnapshot;
  if (userId) {
    storiesSnapshot = await firestore()
      .collection('stories')
      .where('userId', '==', userId)
      .get();
  } else {
    storiesSnapshot = await firestore().collection('stories').get();
  }

  const fetchedStories = [];

  for (const doc of storiesSnapshot.docs) {
    const storyData = { id: doc.id, ...doc.data() };
    const userSnapshot = await firestore().collection('users').doc(storyData.userId).get();
    storyData.user = userSnapshot.data();
    fetchedStories.push(storyData);
  }

  return fetchedStories;
});

// Async thunk for deleting a story
export const deleteStory = createAsyncThunk('stories/deleteStory', async ({ userId, story }) => {
  const userStoriesRef = firestore().collection('stories').doc(userId);
  await userStoriesRef.update({
    stories: firestore.FieldValue.arrayRemove(story),
  });
  return { userId, storyId: story.id };
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
      })
      .addCase(deleteStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        const { userId, storyId } = action.payload;
        const userStories = state.stories.find(story => story.userId === userId);
        if (userStories) {
          userStories.stories = userStories.stories.filter(story => story.id !== storyId);
        }
        state.loading = false;
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default storiesSlice.reducer;
