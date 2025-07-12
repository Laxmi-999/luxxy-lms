// @/Redux/slices/genreSlice.js
import { createSlice } from '@reduxjs/toolkit';

const genreSlice = createSlice({
  name: 'genre',
  initialState: {
    genres: [],
  },
  reducers: {
    setGenre: (state, action) => {
      state.genres = action.payload;
    },
  },
});

export const { setGenre } = genreSlice.actions;
export default genreSlice.reducer;
