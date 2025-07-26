// src/features/events/eventSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id) => {
    const res = await axios.get(`https://ticksy-backend.onrender.com/events/${id}`);
    return res.data;
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    events: [],
    selectedEvent: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state) => {
        state.status = "failed";
      });
  },
});
export const increaseTicket = (state) => {
  if (state.selectedEvent) {
    state.selectedEvent.tickets += 1;
  }
};
export const decreaseTicket = (state) => {
  if (state.selectedEvent && state.selectedEvent.tickets > 0) {
    state.selectedEvent.tickets -= 1;
  }
}

export default eventSlice.reducer;