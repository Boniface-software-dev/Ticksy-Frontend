// src/features/events/eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Fetch event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id) => {
    const res = await axios.get(`http://localhost:5000/events/${id}`);
    return res.data;
  }
);
//Ticket management slice for Redux Toolkit
export const checkoutTickets = createAsyncThunk(
  "events/checkoutTickets",
  async ({ eventId, tickets }, thunkAPI ) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    const response = await axios.post(
      `http://localhost:5000/events/${eventId}/checkout`,
      { tickets },
      {
        headers: {
          Authorization: `Bearer ${token}`,}}
    );
    return response.data;
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    selectedEvent: null,
    status: "idle",
    error: null,
  },
  reducers: {
    increaseTicket: (state) => {
      if (state.selectedEvent) {
        state.selectedEvent.tickets += 1;
      }
    },
    decreaseTicket: (state) => {
      if (state.selectedEvent && state.selectedEvent.tickets > 0) {
        state.selectedEvent.tickets -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(checkoutTickets.pending, (state) => {
        state.status = "processing";
      })
      .addCase(checkoutTickets.fulfilled, (state, action) => {
        state.status = "successd";
        state.selectedTicket = {};
      })
      .addCase(checkoutTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      }); 
  },
});

export const { updateTicketQuantity } = eventSlice.actions;
export default eventSlice.reducer;
