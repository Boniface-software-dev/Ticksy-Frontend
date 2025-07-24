import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    currentUser: undefined,
    isLoading: false,
    error: null,
};
export const register = createAsyncThunk(
    'auth/register', 
    async (userData, thunkAPI) => {
    try {
        const response = await axios.post("http://127.0.0.1:5555/signup", userData);
        return response.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data.errors);
    }
})
export const login = createAsyncThunk(
    'auth/login', 
    async (userData, thunkAPI) => {
    try {
        const response = await axios.post("http://127.0.0.1:5555/login", userData);
        localStorage.setItem("accessToken", response.data.user.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data.user;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data.errors);
    }
})
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loadUser: (state) => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                state.currentUser = JSON.parse(storedUser);
            }
        },
        logout: (state) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            state.currentUser = null;
        },
    },
    extraReducers: builder => {
        builder

        .addCase(register.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
    }
});

export const { loadUser, logout } = authSlice.actions;
export default authSlice.reducer;