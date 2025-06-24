
import axiosInstance from '@/lib/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// // Function to get user from localStorage safely
// const getUserFromLocalStorage = () => {
//   if (typeof window !== 'undefined') { // Check if window is defined (for client-side execution)
//     const user = localStorage.getItem('user');
//     try {
//       return user ? JSON.parse(user) : null;
//     } catch (e) {
//       console.error("Failed to parse user from localStorage", e);
//       localStorage.removeItem('user'); // Clear corrupted data
//       return null;
//     }
//   }
//   return null;
// };

// const user = getUserFromLocalStorage();
// console.log('user from local storage is', user);

// Register user
export const userRegister = createAsyncThunk(
  'users/register',
  async (userData: any, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/users/register', userData);
       
       console.log('User registered successfully:', response.data);
       return response.data;


    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login use
export const userLogin = createAsyncThunk(
  'users/login',
  async (userData: any, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/users/login', userData);
       console.log('Login response data:', res);
      
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      return res.data;

    } catch (error: any) {
      console.log('error ', error);
      

      const message = error.response?.data?.message || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('users/logout', async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    isLoggedIn:false,
    error: '',
    status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.error = '';
      state.status = 'idle'; // Reset status here too
    },
    // You might want a clearError action if you want to clear errors without resetting everything
    clearAuthError: (state) => {
      state.isError = false;
      state.error = '';
      state.status = 'idle'; // Reset status when clearing error
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading'; // Added
        state.isError = false;
        state.error = '';
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
        state.status = 'succeeded'; // Added
        state.isError = false;
        state.error = '';
        // localStorage.setItem('user', JSON.stringify(action.payload)); // Moved to thunk
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
        state.userInfo = null;
        state.status = 'failed';
      })

      // Login
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading'; 
        state.isError = false; 
        state.error = '';
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.userInfo = action.payload;
        state.status = 'succeeded'; 
        state.isError = false;
        state.error = '';
        // localStorage.setItem('user', JSON.stringify(action.payload)); // Moved to thunk
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload as string;
        state.userInfo = null;
        state.status = 'failed';
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
        state.isSuccess = false;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.isError = false;
        state.error = '';
        state.status = 'idle';
      });
  },
});

export const { reset, clearAuthError } = authSlice.actions; // Export clearAuthError if you add it
export default authSlice.reducer;