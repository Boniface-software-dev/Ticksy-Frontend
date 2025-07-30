import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/login', credentials);

    const fullUser = {
      access_token: res.data.access_token,
      ...res.data.user,
    };

    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/signup', async (userData, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/signup', userData);

    const fullUser = {
      access_token: res.data.access_token,
      ...res.data.user,
    };

    localStorage.setItem('user', JSON.stringify(fullUser));
    return fullUser;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: initialUser,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;