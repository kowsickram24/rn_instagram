// src/services/storiesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { firestore } from '../../../firebase.config';

export const storiesApi = createApi({
  reducerPath: 'storiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    fetchStories: builder.query({
      async queryFn(userId = null) {
        try {
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

          return { data: fetchedStories };
        } catch (error) {
          return { error };
        }
      },
    }),
    deleteStory: builder.mutation({
      async queryFn({ userId, story }) {
        try {
          const userStoriesRef = firestore().collection('stories').doc(userId);
          await userStoriesRef.update({
            stories: firestore.FieldValue.arrayRemove(story),
          });
          return { data: { userId, storyId: story.id } };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useFetchStoriesQuery, useDeleteStoryMutation } = storiesApi;
