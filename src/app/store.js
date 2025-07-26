import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'
import eventsReducer from '../features/events/eventSlice';
import { meta } from "@eslint/js";

const store = configureStore({
    reducer:{
        auth: authReducer,
        event: eventsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
        }),
    devTools: import.meta.env.MODE !== 'production',
})

export default store