
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/axiosInstance';
import axios from 'axios';



const baseUrl = 'http://localhost:8000/api';

// ========================= Async Thunks ==============================

// Get all books
export const fetchAllBooks = createAsyncThunk('books/fetchAllBooks', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${baseUrl}/book/get-all-books`);
     console.log('books are', res);
      return res.data;
    
  } catch (error) {
    console.log('error while  fetching all books', error); 
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
  }
});



// Search books
export const searchBooks = createAsyncThunk('books/searchBooks', async (query, thunkAPI) => {
  try {
    const res = await axios.get(`${baseUrl}/book/search-book/search?query=${query}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Search failed');
  }
});



// Add new book (admin or librarian only)
export const addBook = createAsyncThunk('books/addBook', async (bookData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/book/add-book', bookData);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add book');
  }
});


// Update book
export const updateBook = createAsyncThunk('books/updateBook',
   async ({ bookId, updatedBookData }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/book/update-book/${bookId}`, updatedBookData);
    console.log('updated book data are', res.data);
    
    return res.data;
  } catch (error) {
    console.log('error while updating book', error);
    
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update book');
  }
});



// Delete book
export const deleteBook = createAsyncThunk('books/deleteBook',
   async (bookId, thunkAPI) => {
  try {
    await axiosInstance.delete(`/book/delete-book/${bookId}`);
    return bookId;
  } catch (error) {
    console.log('error while deleting book', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete book');
  }
});




// get single book
export const getSingleBook = createAsyncThunk('books/getSingleBook', async(id, thunkAPI) =>{
    try{
       const res = await axiosInstance.get(`/book/get-single-book/${id}`);
       return res.data ; // this will becomes payload for fullfilled status
    }catch(error){
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'failed to get the book by id');

    }
})



// ========================= Book Slice ==============================

const bookSlice = createSlice({
  name: 'books',
  initialState: {
   books: [],
   selectedBook:null,
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
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload  || 'failed to fetch the books';
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
        state.error = action.payload || 'Book not found';
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
        state.error = action.payload || 'failed to add book';
      })

      // Update book
       .addCase(updateBook.pending, (state, action) => {
       state.loading =  true;
       state.error  = null;
      })
       .addCase(updateBook.fulfilled, (state, action) => {
        state.loading= false;
         state.books = state.books.map((book) =>
          book._id === action.payload._id ? action.payload : book
        );
      })

      .addCase(updateBook.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload || 'failed to update book';
      })


      // Delete book
       .addCase(deleteBook.pending, (state, action) => {
        state.loading  = true;
        state.error = null;
      })

      .addCase(deleteBook.fulfilled, (state, action) => {
         state.loading= false;
        state.books = state.books.filter((book) => book._id !== action.payload);
      })

       .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'failed to delete Book';
      })

      //get single book
      .addCase(getSingleBook.pending, (state, action) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(getSingleBook.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBook = action.payload;
       

      })
      .addCase(getSingleBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

      })
  },
});

export const { clearSearch } = bookSlice.actions;
export default bookSlice.reducer;
