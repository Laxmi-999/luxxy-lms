import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import bookSlice from './slices/bookSlice';
import userSlice from './slices/userSlice';


const store = configureStore({
  reducer: {
    auth: authSlice,
    user:userSlice,
    books:bookSlice,
  },
});

// Export types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
