// src/features/tickets/ticketsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTicketsByEvent = createAsyncThunk(
  'tickets/fetchTicketsByEvent',
  async (eventId) => {
    const response = await axios.get(`http://localhost:5000/events/${eventId}/tickets`);
    return response.data;
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketsByEvent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketsByEvent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTicketsByEvent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default ticketsSlice.reducer;
