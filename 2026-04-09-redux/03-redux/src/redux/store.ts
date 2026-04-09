import followingSlice from './following-slice';
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        followingSlice
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch