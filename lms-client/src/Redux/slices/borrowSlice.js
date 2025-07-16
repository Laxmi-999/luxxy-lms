import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';



//  Get all borrows by current user
export const getUserBorrows = createAsyncThunk(
  'borrows/getUserBorrows',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/borrow/request');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch borrows');
    }
  }
);


//  Create borrow request
export const createBorrowRequest = createAsyncThunk(
  'borrows/createBorrowRequest',
  async (bookId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/borrow/request', { bookId });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to request borrow');
    }
  }
);

// Fetch all pending borrows (for librarian)
export const getPendingBorrows = createAsyncThunk(
  'borrows/getPendingBorrows',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/borrow/requests?status=pending');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pending borrow requests'
      );
    }
  }
);

// Fetch all pending borrows (for librarian)
export const getPendingReturns = createAsyncThunk(
  'borrows/getReturnBorrows',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/borrow/requests?status=returned');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pending borrow requests'
      );
    }
  }
);

const borrowSlice = createSlice({
  name: 'borrows',
  initialState: {
    userBorrows: [],
    pendingBorrows: [],
    pendingReturns:[],
    borrows:[],
   loading: false,
    error: null,
  },
  reducers: {
    setPendingBorrows(state, action) {
            state.pendingBorrows = action.payload;
        },
        removePendingBorrow(state, action) {
            state.pendingBorrows = state.pendingBorrows.filter(
                (borrow) => borrow._id !== action.payload
            );
        },
  },
  extraReducers: (builder) => {
    builder

      // Get borrows
      .addCase(getUserBorrows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBorrows.fulfilled, (state, action) => {
        state.loading = false;
        state.userBorrows = action.payload;
      })
      .addCase(getUserBorrows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create borrow
      .addCase(createBorrowRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBorrowRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.borrows.push(action.payload);
      })
      .addCase(createBorrowRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Pending Borrows
      .addCase(getPendingBorrows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingBorrows.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingBorrows = action.payload;
      })
      .addCase(getPendingBorrows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Get pending returns
      .addCase(getPendingReturns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReturns = action.payload;
      })
      .addCase(getPendingReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});
export const { setPendingBorrows, removePendingBorrow } = borrowSlice.actions;
export default borrowSlice.reducer;
