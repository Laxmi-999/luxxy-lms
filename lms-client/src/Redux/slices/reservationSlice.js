// src/Redux/slices/reservationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import axios from 'axios';



// Member : Create a reservation
export const createReservation = createAsyncThunk(
  'reservations/create',
  async (bookId, thunkAPI) => {
    try {
      const res = await axiosInstance.post('/reservation/reserve', { bookId });
      console.log('reservation response is', res);
      
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create reservation');
    }
  }
);


// Member: Get their own reservations
export const getUserReservations = createAsyncThunk(
  'reservations/user',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/reservation/my-reservations');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch user reservations');
    }
  }
);



// Librarian: Get all pending reservations
export const getPendingReservations = createAsyncThunk(
  'reservations/pending',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/reservation/pending');
      console.log('pending reservation response is', res);
      
      return res.data;
    } catch (err) {
      console.log('error while getting pending reservations', err);
      
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch pending reservations');
    }
  }
);


//approve reservation
 export const approveReservation = createAsyncThunk('reservation/approveReservation',
   async (reservationId, thunkAPI) => {

  try{
     const res = await axiosInstance.put(`/reservation/approve/${reservationId}`,
      { status: 'approved' });
      console.log('approve reservation', res.data);
    
      return res.data;

  }catch(error){
   console.log('error while approving reservation', error);
   
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to approve reservation');

  }

});



//reject reservation
 export const rejectReservation = createAsyncThunk('reservation/rejectReservation', 
  async (reservationId) => {
  try{
     const res = await axios.put(`/reservation/approve/${reservationId}`, { status: 'reject' });
     return res.data;

  }catch(error){
  
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to reject reservation');

  }

});



const reservationSlice = createSlice({
  name: 'reservations',
  initialState: {
    loading: false,
    error: null,
    userReservations: [],
    pendingReservations: [],
    successMessage: null,
  },
  reducers: {
    clearReservationMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Create
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.userReservations.push(action.payload);
        state.successMessage = 'Reservation request sent!';
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get user reservations
      .addCase(getUserReservations.fulfilled, (state, action) => {
        state.userReservations = action.payload;
      })
      .addCase(getUserReservations.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Get pending reservations
       .addCase(getPendingReservations.pending, (state, ) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingReservations.fulfilled, (state, action) => {
        state.pendingReservations = action.payload;
      })
      .addCase(getPendingReservations.rejected, (state, action) => {
        state.error = action.payload;
      })

      //approve reservations
       .addCase(approveReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(approveReservation.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.userReservations = state.userReservations.map((r) =>
          r._id === updated._id ? updated : r
        );
        state.successMessage = 'Reservation approved successfully';
      })

      .addCase(approveReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


       // Reject Reservation
      .addCase(rejectReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectReservation.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.userReservations = state.userReservations.map((r) =>
          r._id === updated._id ? updated : r
        );
        state.successMessage = 'Reservation rejected successfully';
      })
      .addCase(rejectReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReservationMessages } = reservationSlice.actions;

export default reservationSlice.reducer;
