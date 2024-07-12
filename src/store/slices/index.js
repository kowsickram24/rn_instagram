import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { userSlice } from './userSlice';
import postSlice from './postSlice';

export const rootReducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice.reducer,
  posts: postSlice.reducer,
});
