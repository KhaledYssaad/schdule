import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import scheduleReducer from './scheduleSlice';
import { apiSlice } from './apiSlice';

// Manual storage wrapper to avoid redux-persist/lib/storage import issues in Vite/ESM
const createStorage = () => {
  return {
    getItem(key) {
      return Promise.resolve(localStorage.getItem(key));
    },
    setItem(key, value) {
      localStorage.setItem(key, value);
      return Promise.resolve();
    },
    removeItem(key) {
      localStorage.removeItem(key);
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' 
  ? createStorage() 
  : {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['schedule'], // Only persist the schedule slice
};

const rootReducer = combineReducers({
  schedule: scheduleReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
