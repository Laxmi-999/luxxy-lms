import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import adminSlice from './slices/adminSlice';
import bookSlice from './slices/bookSlice';


const store = configureStore({
  reducer: {
    auth: authSlice,
    admin:adminSlice,
    books:bookSlice,
  },
});

// Export types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
