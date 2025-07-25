// src/redux/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://127.0.0.1:5000";

// Fetch approved events
export const fetchApprovedEvents = createAsyncThunk(
  'events/fetchApprovedEvents',
  async () => {
    const response = await axios.get(`${BASE_URL}/admin/pending`);
    return response.data.filter(event => event.status === "approved");
  }
);

// Fetch single event by ID
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id) => {
    const response = await axios.get(`${BASE_URL}/events/${id}`);
    return response.data;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    approvedEvents: [],
    selectedEvent: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedEvents = action.payload;
      })
      .addCase(fetchApprovedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.selectedEvent = action.payload;
      });
  }
});

export const { clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
