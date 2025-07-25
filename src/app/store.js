import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'
import { meta } from "@eslint/js";

const store = configureStore({
    reducer:{
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
        }),
    devTools: import.meta.env.MODE !== 'production',
})

export default store