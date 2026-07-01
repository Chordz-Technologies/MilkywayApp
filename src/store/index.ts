import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import calendarReducer from './calendarSlice';
import authReducer from './authSlice';
import distributorCalendarReducer from './distributorSlice';
import consumersReducer from './consumersSlice';
import profileReducer from './distributorProfileSlice';
import vendorProfileReducer from './vendorProfileSlice';
import consumerProfileReducer from './consumerProfileSlice';
import languageReducer from './languageSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['calendar', 'distributorCalendar', 'consumers', 'auth', 'profile', 'vendorProfile', 'consumerProfile', 'language'],
  blacklist: [],
};

const rootReducer = combineReducers({
  calendar: calendarReducer,
  auth: authReducer,
  distributorCalendar: distributorCalendarReducer,
  consumers: consumersReducer,
  profile: profileReducer,
  vendorProfile: vendorProfileReducer,
  consumerProfile: consumerProfileReducer,
  language: languageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
      immutableCheck: __DEV__,
      actionCreatorCheck: __DEV__,
    }),
  devTools: __DEV__ && {
    name: 'MilkywayApp Store',
    trace: true,
    traceLimit: 25,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
