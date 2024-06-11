import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { userSlice } from './userSlice';
export const rootReducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  user: userSlice.reducer,
});
