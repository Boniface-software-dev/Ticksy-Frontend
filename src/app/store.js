import { configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD
import authReducer from '../features/authentification/authSlice'
import eventReducer from '../features/events/eventSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';
=======
import authReducer from "../features/authentification/authSlice";
import eventReducer from "../features/events/eventSlice";
>>>>>>> 2afebd4348ba386a8e200cc64414fcbf58b742db

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
