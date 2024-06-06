import { configureStore } from '@reduxjs/toolkit'
import { rootReducers } from './slices'

export const store = configureStore({
    reducer: rootReducers
})
