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
// export const fetchGenresAndStore = async (dispatch) => {
//   try {
//     const { data } = await axiosInstance.get('/genre');
//     dispatch(setGenres(data));
//   } catch (error) {
//     console.error('Failed to fetch genres:', error);
//   }
// };


export const { setGenre } = genreSlice.actions;
export default genreSlice.reducer;
