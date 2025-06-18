
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';



// ========================= Async Thunks ==============================

// Get all books
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/admin/get-books');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
  }
});

// Search books
export const searchBooks = createAsyncThunk('books/searchBooks', async (query, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/admin/search-book/search?query=${query}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});


// Add new book (admin or librarian only)
export const addBook = createAsyncThunk('books/addBook', async (bookData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('admin/add-book', bookData);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add book');
  }
});


// Update book
export const updateBook = createAsyncThunk('books/updateBook', async ({ id, updatedData }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/admin/update-book/${id}`, updatedData);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update book');
  }
});



// Delete book
export const deleteBook = createAsyncThunk('books/deleteBook', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/delete-book/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete book');
  }
});




// ========================= Book Slice ==============================

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    error: null,
    searchResults: [],
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Search books
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      // Add book
      .addCase(addBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      // Update book
      .addCase(updateBook.fulfilled, (state, action) => {
        state.books = state.books.map((book) =>
          book._id === action.payload._id ? action.payload : book
        );
      })

      // Delete book
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      });
  },
});

export const { clearSearch } = bookSlice.actions;
export default bookSlice.reducer;
