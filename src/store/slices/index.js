import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { userSlice } from './userSlice';
import postSlice from './postSlice';
import storiesSlice from './storiesSlice';
export const rootReducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice.reducer,
  posts: postSlice,
  stories: storiesSlice
});
