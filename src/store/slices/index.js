import {combineReducers} from '@reduxjs/toolkit';
import {userSlice} from './userSlice';

export const rootReducers = combineReducers({
    user: userSlice.reducer
})
