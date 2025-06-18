import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';




// to get admin
export const fetchAdminProfile = createAsyncThunk('user/fetchAdminProfile', async (_, thunkAPI) => {
  try {
 const res = await axiosInstance.get('/profile');
    return res.data;
          
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch admin profile');
  }
});

// to get all users

export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async (_, thunkAPI) => {
  try {
 const res = await axiosInstance.get('/admin/users')
    return res.data;
  } catch (err) {
    console.log(err);
    
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});


// to update user
export const updateUser = createAsyncThunk('user/updateUser', 

  async ({ userId, userData}, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/admin/update-user/${userId}`, userData );
    return res.data;
  } catch (err) {
    console.log('error while updating user is ', err);
    
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update user details');
  }
});


// to add new user
export const addUser = createAsyncThunk('/addUser', async (userData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/admin/add-user', userData);
    console.log('new user data is', res);
    
    return res.data;
  } catch (err) {
    console.log('error while adding user', err);
    
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add new user');
  }
});



// to add new librarian
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





// to get all books
export const fetchAllBooks = createAsyncThunk('user/fetchAllBooks', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/books');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
  }
});





// to get the reports
export const fetchReport = createAsyncThunk('user/fetchReport', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/reports');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch report');
  }
});



/// for deleting user 
export const deleteUser = createAsyncThunk(
    'admin/deleteUser', 
    async (userId, thunkAPI) => {
        try {
            const res = await axiosInstance.delete(`/admin/delete-user/${userId}`); 
             console.log(`User ${userId} deleted successfully`, res);

            return userId; 
        } catch (err) {
            console.error('Error deleting user:', err);
            return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete user');
        }
    }
);


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

      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
        state.successMessage = 'User role updated';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addLibrarian.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.successMessage = 'Librarian added';
      })
      .addCase(addLibrarian.rejected, (state, action) => {
        state.error = action.payload;
      })

       .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.successMessage = 'Librarian added';
      })
      .addCase(addUser.rejected, (state, action) => {
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
