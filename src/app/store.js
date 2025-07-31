import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'
import eventReducer from '../features/events/eventSlice';
import ticketsReducer from '../features/tickets/ticketsSlice';

import authReducer from "../features/authentification/authSlice";

import eventReducer from "../features/events/eventSlice";

import eventsReducer from "../features/organizer/eventSlice";
import attendeeReducer from "../features/organizer/attendeeSlice";
import reviewReducer from "../features/organizer/reviewSlice";
import uiReducer from "../features/organizer/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketsReducer,
    organizer: eventsReducer,
    attendees: attendeeReducer,
    reviews: reviewReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
    }),
  devTools: import.meta.env.MODE !== "production",
});

export default store;
