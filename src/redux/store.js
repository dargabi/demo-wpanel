import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import reportsReducer from './slices/reportsSlice';
import dashboardReducer from './slices/dashboardSlice';
import uiReducer from './slices/uiSlice';

/**
 * Redux store configuration
 * Combines all reducers and sets up middleware
 */
const store = configureStore({
  reducer: {
    clients: clientsReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
