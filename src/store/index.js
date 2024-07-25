import {configureStore} from '@reduxjs/toolkit';
import {rootReducers} from './slices';
import {apiSlice} from './slices/apiSlice';
import {storiesApi} from './slices/storiesApi';
import {chatsApi} from './slices/chatsApi';
export const store = configureStore({
  reducer: rootReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      storiesApi.middleware,
      chatsApi.middleware,
    ),
});
