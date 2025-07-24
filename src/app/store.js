import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authentification/authSlice'

const store = configureStore({
    reducer:{
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: true,
        })
})

export default store