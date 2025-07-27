import { configureStore } from "@reduxjs/toolkit";
// import authReducer from '../features/authentification/authSlice' ❌ Comment this for now
import eventReducer from '../features/events/eventSlice';

const store = configureStore({
  reducer: {
    // auth: authReducer,
    events: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
