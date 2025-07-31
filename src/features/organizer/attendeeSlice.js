import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";


export const fetchAttendees = createAsyncThunk(
  "attendees/fetch",
  async (eventId, thunkAPI) => {
    try {
      const res = await axios.get(`/organizer/events/${eventId}/attendees`);
      return { eventId, attendees: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkInAttendee = createAsyncThunk(
  "attendees/checkIn",
  async ({ eventId, attendeeId }, thunkAPI) => {
    try {
      await axios.patch(`/organizer/checkin/${attendeeId}`);
      return { eventId, attendeeId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const undoCheckInAttendee = createAsyncThunk(
  "attendees/undoCheckIn",
  async ({ eventId, attendeeId }, thunkAPI) => {
    try {
      await axios.patch(`/organizer/checkout/${attendeeId}`);
      console.log("Undo check-in for attendee:", attendeeId);
      return { eventId, attendeeId };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const exportAttendees = createAsyncThunk(
  "attendees/export",
  async ({ eventId, format }, thunkAPI) => {
    try {
      const res = await axios.get(`/events/${eventId}/attendees/export?format=${format}`, {
        responseType: "blob",
      });
      return { eventId, blob: res.data, format };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const initialState = {
  attendeesByEvent: {}, 
  checkIns: {},         
  exportStatus: "idle",
  loadingEventId: null,
  error: null,
};


const attendeeSlice = createSlice({
  name: "attendees",
  initialState,
  reducers: {
    markCheckedIn: (state, action) => {
      const { attendeeId } = action.payload;
      state.checkIns[attendeeId] = true;
    },
    clearAttendees: (state) => {
      state.attendeesByEvent = {};
      state.checkIns = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendees.pending, (state, action) => {
        state.loadingEventId = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        const { eventId, attendees } = action.payload;
        state.attendeesByEvent[eventId] = attendees.attendees;
        if (Array.isArray(attendees.attendees)) {
          attendees.attendees.forEach((a) => {
            state.checkIns[a.id] = a.checked_in;
          });
        }
        state.loadingEventId = null;
      })
      .addCase(fetchAttendees.rejected, (state, action) => {
        state.loadingEventId = null;
        state.error = action.payload;
      })

      .addCase(checkInAttendee.fulfilled, (state, action) => {
        const { eventId, attendeeId } = action.payload;
      const list = state.attendeesByEvent[eventId];
      if (list) {
        const attendee = list.find((a) => a.id === attendeeId);
        if (attendee) {
          attendee.checked_in = true;
        }
      }
      state.checkIns[attendeeId] = true;
      })
      .addCase(checkInAttendee.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(undoCheckInAttendee.fulfilled, (state, action) => {
        const { eventId, attendeeId } = action.payload;
      const list = state.attendeesByEvent[eventId];
      if (list) {
        const attendee = list.find((a) => a.id === attendeeId);
        if (attendee) {
          attendee.checked_in = false;
        }
      }
      state.checkIns[attendeeId] = false;
      })
      .addCase(undoCheckInAttendee.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(exportAttendees.pending, (state) => {
        state.exportStatus = "loading";
        state.error = null;
      })
      .addCase(exportAttendees.fulfilled, (state, action) => {
        state.exportStatus = "succeeded";
        const url = URL.createObjectURL(action.payload.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendees.${action.payload.format}`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .addCase(exportAttendees.rejected, (state, action) => {
        state.exportStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { markCheckedIn, clearAttendees } = attendeeSlice.actions;

export default attendeeSlice.reducer;

