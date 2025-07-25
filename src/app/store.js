import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'
import eventsReducer from '../redux/eventsSlice';
import { meta } from "@eslint/js";

const store = configureStore({
    reducer:{
        auth: authReducer,
        events: eventsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
        }),
    devTools: import.meta.env.MODE !== 'production',
})

export default store