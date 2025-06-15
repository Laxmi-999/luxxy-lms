import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from '../axiosInstance';



// const API = '/api/admin/'; // Adjust base URL according to your backend route


// Thunks

export const fetchAdminProfile = createAsyncThunk('user/fetchAdminProfile', async (_, thunkAPI) => {
  try {
 const res = await axiosInstance.get('/profile');
    return res.data;
          
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch admin profile');
  }
});

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async (_, thunkAPI) => {
  try {
 const res = await axiosInstance.get('/admin/users')
    return res.data;
  } catch (err) {
    console.log(err);
    
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const updateUserRole = createAsyncThunk('user/updateUserRole', async ({ userId, role }, thunkAPI) => {
  try {
    const res = await axiosInstance.put('/role', { userId, role });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update role');
  }
});

export const addLibrarian = createAsyncThunk('/addLibrarian', async (librarianData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/admin/add-librarian', librarianData);
    console.log('new librarian data is', res);
    
    return res.data;
  } catch (err) {
    console.log('error while adding librarian', err);
    
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add librarian');
  }
});

export const fetchAllBooks = createAsyncThunk('user/fetchAllBooks', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/books');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
  }
});

export const fetchReport = createAsyncThunk('user/fetchReport', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/reports');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch report');
  }
});

// Slice

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminProfile: null,
    users: [],
    books: [],
    report: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.adminProfile = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
        state.successMessage = 'User role updated';
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addLibrarian.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.successMessage = 'Librarian added';
      })
      .addCase(addLibrarian.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchReport.fulfilled, (state, action) => {
        state.report = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = adminSlice.actions;
export default adminSlice.reducer;
