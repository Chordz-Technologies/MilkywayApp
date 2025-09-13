
// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import calendarReducer from './calendarSlice';
// import authReducer from './authSlice';
// import distributorReducer from './distributorSlice';  // Import distributor slice


// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['calendar', 'distributor'],  // Added distributor slice here
// };


// const rootReducer = combineReducers({
//   calendar: calendarReducer,
//   auth: authReducer,
//   distributor: distributorReducer,  // Added distributor slice here
// });


// const persistedReducer = persistReducer(persistConfig, rootReducer);


// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });


// export const persistor = persistStore(store);


// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import calendarReducer from './calendarSlice';
import authReducer from './authSlice';
import distributorCalendarReducer from './distributorSlice';  // ✅ Import the correct slice

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['calendar', 'distributorCalendar'],  // ✅ Updated name
};

const rootReducer = combineReducers({
  calendar: calendarReducer,
  auth: authReducer,
  distributorCalendar: distributorCalendarReducer,  // ✅ Use correct name here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
