import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import genreSlice from '../Redux/slices/genreSlice';
import authSlice from './slices/authSlice';
import bookSlice from './slices/bookSlice';
import userSlice from './slices/userSlice';
import reservationSlice from './slices/reservationSlice';
import borrowSlice from './slices/borrowSlice';


let logger: any;
if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger'); // Correct import for createLogger
  logger = createLogger();
}

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  books: bookSlice,
  reservations: reservationSlice,
  borrows: borrowSlice,
  genre:genreSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // Customize which slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });

    if (process.env.NODE_ENV === 'development' && logger) {
      middlewares.push(logger);
    }

    return middlewares;
  },
});

export type RootState = ReturnType<typeof store.getState>;

const persistor = persistStore(store);
export default persistor;