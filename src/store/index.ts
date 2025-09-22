
// // // store/index.ts
// // import { configureStore, combineReducers } from '@reduxjs/toolkit';
// // import { persistReducer, persistStore } from 'redux-persist';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // import calendarReducer from './calendarSlice';
// // import authReducer from './authSlice';
// // import distributorCalendarReducer from './distributorSlice';  // ✅ Import the correct slice

// // const persistConfig = {
// //   key: 'root',
// //   storage: AsyncStorage,
// //   whitelist: ['calendar', 'distributorCalendar'],  // ✅ Updated name
// // };

// // const rootReducer = combineReducers({
// //   calendar: calendarReducer,
// //   auth: authReducer,
// //   distributorCalendar: distributorCalendarReducer,  // ✅ Use correct name here
// // });

// // const persistedReducer = persistReducer(persistConfig, rootReducer);

// // export const store = configureStore({
// //   reducer: persistedReducer,
// //   middleware: getDefaultMiddleware =>
// //     getDefaultMiddleware({
// //       serializableCheck: false,
// //     }),
// // });

// // export const persistor = persistStore(store);

// // export type RootState = ReturnType<typeof store.getState>;
// // export type AppDispatch = typeof store.dispatch;

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { persistReducer, persistStore } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Import all your slices
// import calendarReducer from './calendarSlice';
// import authReducer from './authSlice';
// import distributorCalendarReducer from './distributorSlice';
// import consumersReducer from './consumersSlice'; // ✅ New consumers slice

// // Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['calendar', 'distributorCalendar', 'consumers', 'auth'], // ✅ Added consumers and auth to persist
//   blacklist: [], // You can add slices here that you don't want to persist
//   // Optional: Configure nested persistence for specific slice properties
//   // transforms: [], // Add transforms if needed for data serialization
// };

// // Combine all reducers
// const rootReducer = combineReducers({
//   calendar: calendarReducer,
//   auth: authReducer,
//   distributorCalendar: distributorCalendarReducer,
//   consumers: consumersReducer, // ✅ Added consumers slice
// });

// // Create persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure store with enhanced middleware
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types for redux-persist
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//         // Ignore these field paths in all actions
//         ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
//         // Ignore these paths in the state
//         ignoredPaths: ['items.dates'],
//       },
//       // Enable additional middleware in development
//       immutableCheck: __DEV__,
//       actionCreatorCheck: __DEV__,
//     }),
//   // Enable Redux DevTools in development only
//   devTools: __DEV__ && {
//     name: 'MilkywayApp Store', // Custom name for DevTools
//     trace: true, // Enable action stack traces
//     traceLimit: 25, // Limit trace entries
//   },
// });

// // Create persistor
// export const persistor = persistStore(store);

// // Export types for TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Optional: Add store subscription for debugging
// if (__DEV__) {
//   store.subscribe(() => {
//     const state = store.getState();
//     console.log('🏪 Store updated:', {
//       consumers: state.consumers?.consumers?.length || 0,
//       auth: state.auth?.isAuthenticated || false,
//       calendar: Object.keys(state.calendar || {}).length,
//       distributorCalendar: Object.keys(state.distributorCalendar || {}).length,
//     });
//   });
// }

// // Export store and persistor as default if needed elsewhere
// export default { store, persistor };
// store/index.ts - Updated with proper TypeScript types
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import calendarReducer from './calendarSlice';
import authReducer from './authSlice';
import distributorCalendarReducer from './distributorSlice';
import consumersReducer from './consumersSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['calendar', 'distributorCalendar', 'consumers', 'auth'],
  blacklist: [],
};

const rootReducer = combineReducers({
  calendar: calendarReducer,
  auth: authReducer,
  distributorCalendar: distributorCalendarReducer,
  consumers: consumersReducer,
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

// ✅ FIXED: Proper TypeScript types for Redux Toolkit
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };
