import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchOrganizerEvents = createAsyncThunk(
  "events/fetchOrganizerEvents",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/my-events");
      console.log("Fetched events:", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/events", eventData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/events/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (eventId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/events/${eventId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    approvedEvents: [],
    pendingEvents: [],
    rejectedEvents: [],
    history: [],
    currentEventDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearEventDetails(state) {
      state.currentEventDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizerEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const now = new Date();
        const approved = [];
        const pending = [];
        const rejected = [];
        const history = [];

        if (Array.isArray(action.payload)) {
          action.payload.forEach((event) => {
            const eventDate = new Date(event.start_time); 

            if (event.status === "pending") {
      pending.push(event);
    } else if (event.status === "rejected") {
      rejected.push(event);
    } else if (event.status === "approved") {
      if (eventDate >= now) {
        approved.push(event);
      } else {
        history.push(event);
      }
    }
  });
}

        state.approvedEvents = approved;
        state.pendingEvents = pending;
        state.rejectedEvents = rejected;
        state.history = history;
      })
      .addCase(fetchOrganizerEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch events";
      })

      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEvents.push(action.payload); // New events go to pending
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from rejected list and add to pending
        state.rejectedEvents = state.rejectedEvents.filter(
          (event) => event.id !== action.payload.id
        );
        state.pendingEvents.push(action.payload);
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Event Details
      .addCase(fetchEventDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEventDetails = action.payload;
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventDetails } = eventSlice.actions;
export default eventSlice.reducer;
