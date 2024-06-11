import { configureStore } from '@reduxjs/toolkit';
import { rootReducers } from './slices';
import { apiSlice } from './slices/apiSlice';

export const store = configureStore({
  reducer: rootReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
