import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { userSlice } from './userSlice';
import postSlice from './postSlice';
import { storiesApi } from './storiesApi';
import { chatsApi } from './chatsApi';
export const rootReducers = combineReducers({
  [chatsApi.reducerPath]: chatsApi.reducer,
  [storiesApi.reducerPath]: storiesApi.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice.reducer,
  posts: postSlice
});
