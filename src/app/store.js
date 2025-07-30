import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'
import eventReducer from '../features/events/eventSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
